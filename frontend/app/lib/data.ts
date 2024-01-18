import { Note, NoteWithTags, Tag, User } from './types';
import { unstable_noStore as noStore, revalidateTag } from 'next/cache';
import sql from './db';

type NoteTag = Note & {
  tag_name: string;
};

/**
 * This function appends a tag array to each note id
 */
const parseNoteTags = (notes: NoteTag[]) => {
  const notesWithTags: NoteWithTags[] = notes.reduce<NoteWithTags[]>((acc, row) => {
    const existingNote = acc.find((note) => note.id === row.id);

    if (existingNote) {
      existingNote.tags.push(row.tag_name);
    } else {
      // Create a new NoteWithTags for each unique note_id
      acc.push({
        id: row.id,
        user_id: row.user_id,
        title: row.title,
        text: row.text,
        date_created: row.date_created,
        date_modified: row.date_modified,
        tags: row.tag_name ? [row.tag_name] : [], // Initialize the tags array
      });
    }

    return acc;
  }, []);
  return notesWithTags;
};

export async function fetchLatestNotes(limit: number, user_id: string) {
  console.log('Fetching latest notes');
  try {
    const latestNotes = await sql<NoteTag[]>`
        WITH latest_notes AS (
          SELECT DISTINCT ON (notes.id) notes.id
          FROM notes
          WHERE notes.user_id = ${user_id}
          ORDER BY notes.id, notes.date_modified DESC
          LIMIT ${limit}
        )

        SELECT notes.id, notes.title, notes.text, notes.date_created, notes.date_modified, tags.name AS tag_name
        FROM latest_notes
        JOIN notes ON latest_notes.id = notes.id
        LEFT JOIN notes_tags ON notes.id = notes_tags.note_id
        LEFT JOIN tags ON notes_tags.tag_id = tags.id
        ORDER BY notes.date_modified DESC`;

    // WHERE notes.user_id = ${user_id}
    // LIMIT ${limit}

    return parseNoteTags(latestNotes);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest notes.');
  }
}

// const INVOICES_PER_PAGE = 6;
// export async function fetchFilteredNotes(query: string, currentPage: number) {
//   noStore();
//   const offset = (currentPage - 1) * INVOICES_PER_PAGE;

//   try {
//     const notes = await sql<NotesTable>`
//       SELECT
//         notes.id,
//         notes.amount,
//         notes.date,
//         notes.status,
//         customers.name,
//         customers.email,
//         customers.image_url
//       FROM notes
//       JOIN customers ON notes.customer_id = customers.id
//       WHERE
//         customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`} OR
//         notes.amount::text ILIKE ${`%${query}%`} OR
//         notes.date::text ILIKE ${`%${query}%`} OR
//         notes.status ILIKE ${`%${query}%`}
//       ORDER BY notes.date DESC
//       LIMIT ${INVOICES_PER_PAGE} OFFSET ${offset}
//     `;

//     return notes.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch notes.');
//   }
// }

/**
 * Could this be refactored with the general fetchNote - id could be an optional input
 */
export async function fetchNoteById(id: string, user_id: string) {
  noStore();
  try {
    /**
     * NEED TO JOIN WITH NOTETAGS SOMEHOW, TO ADD A LIST OF TAGS TO THE RETURN VALUE
     */
    const note = await sql<NoteTag[]>`
        SELECT notes.id, notes.title, notes.text, notes.date_created, notes.date_modified, tags.name AS tag_name
        FROM notes
        LEFT JOIN notes_tags ON notes.id = notes_tags.note_id
        LEFT JOIN tags ON notes_tags.tag_id = tags.id
        WHERE notes.id = ${id} AND notes.user_id = ${user_id};
      `;

    const noteWithTags = parseNoteTags(note);
    return noteWithTags[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch note.');
  }
}

export async function fetchUserTags(user_id: string) {
  console.log('Fetching user tags');
  try {
    const latestNotes = await sql<Tag[]>`
        SELECT name
        FROM tags
        WHERE user_id = ${user_id}
        `;

    revalidateTag('userTags');
    return latestNotes;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user tags.');
  }
}
