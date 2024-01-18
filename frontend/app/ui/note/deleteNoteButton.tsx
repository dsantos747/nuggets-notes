'use client';

import { deleteNote } from '../../lib/actions';

type Props = {
  readonly noteId: string;
};

export default function DeleteNote({ noteId }: Props) {
  return (
    <button
      type='button'
      onClick={() => {
        deleteNote(noteId);
      }}>
      Delete Note
    </button>
  );
}
