'use client';

import { deleteNote } from '../../lib/actions';

type Props = {
  noteId: string;
};

export default function DeleteNote({ noteId }: Props) {
  return (
    <button
      onClick={() => {
        deleteNote(noteId);
      }}>
      Delete Note
    </button>
  );
}
