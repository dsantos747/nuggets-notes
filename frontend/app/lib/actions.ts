'use server';

import { z } from 'zod';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn, auth } from '@/auth';
import { NoteFormState, Note } from '@/app/lib/types';
import bcrypt from 'bcrypt';
import { isRedirectError } from 'next/dist/client/components/redirect';
import sql from './db';

const NoteFormSchema = z.object({
  id: z.string(),
  // user_id: z.string(),
  title: z.string(),
  text: z.string({
    invalid_type_error: 'Please enter some text.',
  }),
  // date_created: z.coerce.date(),
  // date_modified: z.coerce.date(),
  // tags: z.array(z.object({ value: z.string() })),
  tags: z.unknown(z.string()),
});

const AuthFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter your name.',
  }),
  email: z.string({
    invalid_type_error: 'Please enter a valid email.',
  }),
  password: z.string({
    invalid_type_error: 'Please enter a valid password.',
  }),
  confirmPassword: z.string({
    invalid_type_error: 'Please enter the same password.',
  }),
});

// const CreateNote = NoteFormSchema.omit({ id: true, user_id: true, date_created: true, date_modified: true });
// const UpdateNote = NoteFormSchema.omit({ user_id: true, date_created: true, date_modified: true });

const Login = AuthFormSchema.omit({ id: true, name: true, confirmPassword: true, tags: true });
const SignUp = AuthFormSchema.omit({ id: true });

export async function createNote(prevState: NoteFormState | undefined, formData: FormData) {
  // console.log(formData);
  const authStatus = await auth();
  const user_id = authStatus?.user?.id;
  if (typeof user_id !== 'string') {
    return { message: 'Could not authorise user.' };
  }

  const validatedFields = NoteFormSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    text: formData.get('text'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Note',
    };
  }
  let { id, title, text } = validatedFields.data;

  /**
   * Use this mode variable to determine what SQL query to do
   */

  // Handle errors in this?
  const tagEntries = Array.from(formData.entries()).filter(([name]) => name === 'tags');
  const tags = tagEntries.map(([, value]) => value.toString());
  // return { message: 'test' };

  if (id === '') {
    // Create Note
    try {
      await sql.begin(async (sql) => {
        const newNote: Note[] = await sql`
          INSERT INTO notes (user_id, title, text, date_created, date_modified)
          VALUES (${user_id}, ${title}, ${text}, NOW(), NOW())
          RETURNING *
        `;

        const note_id = newNote[0].id;
        const tagsObj = tags.map((tag) => ({ name: tag, user_id: user_id, manual: 'true' }));

        await sql`INSERT INTO tags
          ${sql(tagsObj, 'name', 'user_id', 'manual')}
          ON CONFLICT (name, user_id) DO NOTHING
        `;

        await sql`
          INSERT INTO notes_tags (note_id, tag_id)
          SELECT ${note_id}, tags.id
          FROM tags
          WHERE tags.name = ANY(${tags})
        `;

        console.log('Note created successfully! ID:', note_id);
      });
    } catch (error) {
      console.log(error);
      return { message: 'Database Error: Failed to Create Note' };
    }
  } else {
    // Update Note
    const note_id = id;
    try {
      await sql.begin(async (sql) => {
        await sql`
          UPDATE notes SET title=${title},text=${text},date_modified=NOW()
          WHERE id=${note_id}
        `;

        const tagsObj = tags.map((tag) => ({ name: tag, user_id: user_id, manual: 'true' }));

        await sql`INSERT INTO tags
          ${sql(tagsObj, 'name', 'user_id', 'manual')}
          ON CONFLICT (name, user_id) DO NOTHING
        `;

        await sql`
          DELETE FROM notes_tags
          WHERE note_id = ${note_id} AND tag_id NOT IN (
            SELECT id FROM tags WHERE name = ANY(${tags})
          )
        `;

        await sql`
          INSERT INTO notes_tags (note_id, tag_id)
          SELECT ${note_id}, tags.id
          FROM tags
          WHERE tags.name = ANY(${tags})
          ON CONFLICT DO NOTHING
        `;

        // Delete tags if their id is not present in notes_tags, for note_id's filtered to user.
        await sql`
          DELETE FROM tags
          WHERE id NOT IN (
            SELECT DISTINCT tag_id
            FROM notes_tags
            WHERE note_id IN (
              SELECT id
              FROM notes
              WHERE user_id = ${user_id}
            )
          )
        `;

        console.log('Note updated successfully! ID:', note_id);
      });
    } catch (error) {
      console.log(error);
      return { message: 'Database Error: Failed to Update Note' };
    }
  }

  revalidatePath('/notespace');
  revalidateTag('userNotes');
  revalidateTag('userTags');
  // redirect('/notespace');
}

export async function deleteNote(id: string) {
  /**
   * The setting of user_id here, rather than as passed through as an argument, is to avoid having
   * the user_id present on the client. However, it will add an additional performance hit. Once frontend
   * structure is fully set up, consider if it is safe to move user_id to the point of requesting (i.e.,
   * if we always make the request from a server-side component (not client))
   */
  const authStatus = await auth();
  const user_id = authStatus?.user?.id;
  if (typeof user_id !== 'string') {
    return { message: 'Could not authorise user.' };
  }

  try {
    await sql.begin(async (sql) => {
      // Delete any entries in notes_tags related to this note
      await sql`DELETE FROM notes_tags WHERE note_id = ${id}`;

      // Delete note
      await sql`DELETE FROM notes WHERE id = ${id}`;

      // Delete tags if their id is not present in notes_tags, for note_id's filtered to user.
      await sql`
        DELETE FROM tags
        WHERE id NOT IN (
          SELECT DISTINCT tag_id
          FROM notes_tags
          WHERE note_id IN (
            SELECT id
            FROM notes
            WHERE user_id = ${user_id}
          )
        )
      `;
      revalidatePath('/notespace');
      revalidateTag('userNotes');
      revalidateTag('userTags');
      return { message: 'Deleted Note' };
    });
  } catch (error) {
    console.log(error);
    return { message: 'Database Error: Failed to Delete Note' };
  }
}

export async function login(prevState: { message: string } | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials.' };
        default:
          return { message: 'Something went wrong.' };
      }
    }
    if (isRedirectError(error)) {
      revalidatePath('/notespace');
      redirect('/notespace');
    }
    return { message: 'Failed to log in.' };
  }
}

export async function signUp(prevState: { message: string } | undefined, formData: FormData) {
  try {
    const validatedFields = SignUp.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Invoice.',
      };
    }
    const { name, email, password, confirmPassword } = validatedFields.data;

    if (password !== confirmPassword) {
      return { message: 'Passwords do not match.' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return { message: 'Existing user found - try logging in.' };
    }
    await sql`INSERT INTO users(name, email, password_hashed) VALUES (${name}, ${email}, ${hashedPassword})`;

    await signIn('credentials', { email, password });
  } catch (error) {
    if (isRedirectError(error)) {
      revalidatePath('/notespace');
      redirect('/notespace');
    }
    return { message: 'Sign-up error: Failed to create account.' };
  }
}
