import { Note, NoteWithTags, Tag } from './types';
import { unstable_noStore as noStore, revalidateTag, unstable_cache } from 'next/cache';
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

export async function fetchAllNotes(user_id: string) {
  console.log('Fetching user notes');
  try {
    const userNotes = await sql<NoteTag[]>`
        SELECT notes.id, notes.title, notes.text, notes.date_created, notes.date_modified, tags.name AS tag_name
        FROM notes
        LEFT JOIN notes_tags ON notes.id = notes_tags.note_id
        LEFT JOIN tags ON notes_tags.tag_id = tags.id
        WHERE notes.user_id = ${user_id}
        ORDER BY notes.date_modified DESC`;

    return parseNoteTags(userNotes);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user notes.');
  }
}

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

export const getCachedAllNotes = unstable_cache(async (id) => fetchAllNotes(id), undefined, { tags: ['userNotes'] });
export const getCachedLatestNotes = unstable_cache(async (n, id) => fetchLatestNotes(n, id), undefined, { tags: ['userNotes'] });
export const getUserTags = unstable_cache(async (id) => fetchUserTags(id), undefined, { tags: ['userTags'] });
