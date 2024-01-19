'use client';

import CreatableSelect from 'react-select';
import { useFormState, useFormStatus } from 'react-dom';
import { createNote, deleteNote } from '../../lib/actions';
import { caprasimo } from '../fonts';
import { Button } from '../button';
import { useState, KeyboardEventHandler } from 'react';
import { NoteFormState, NoteWithTags, NoteForm, Tag } from '../../lib/types';
import { ExclamationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import TagField from './tagField';
import Modal from '../modal';

type Props = {
  readonly noteState?: NoteWithTags;
  readonly userTags: Tag[];
};

// const components = {
//   DropdownIndicator: null,
// };

// interface Option {
//   readonly label: string;
//   readonly value: string;
// }

// const createOption = (label: string) => ({
//   label,
//   value: label,
// });

/**
 * Consider:
 * - If task is to update, note, pass NoteWithTags in as a prop
 * - If NoteWithTags is in prop, define initialState based on the values in it
 * - Rewrite "createNote" (and update it) to check if "id" is in the submitted formData.
 * - Can use that to determine whether we update or create note.
 * - Believe a similar method was used in the next js demo app
 */
export default function NoteForm({ noteState, userTags }: Props) {
  let note: NoteForm;
  if (!noteState) {
    note = { id: '', user_id: '', title: '', text: '', tags: [] };
  } else {
    note = {
      id: noteState.id,
      user_id: noteState.user_id,
      title: noteState.title,
      text: noteState.text,
      tags: noteState.tags,
    };
  }

  const initialState: NoteFormState = { message: null, errors: {} };
  const [errorMessage, dispatch] = useFormState(createNote, initialState);

  return (
    <form action={dispatch}>
      <div className='flex-1 rounded-lg pt-6 pb-1 min-w-[70vw] md:min-w-96'>
        <input id='id' name='id' type='text' autoComplete='off' defaultValue={note.id} hidden aria-hidden></input>
        <div className='w-full bg-amber-50 border border-gray-200  rounded-xl'>
          <div className=''>
            <label id='title-label' className='sr-only' htmlFor='title'>
              Title
            </label>
            <input
              className={`${caprasimo.className} bg-transparent rounded-t-xl block w-full border-b border-amber-500 p-2 placeholder:text-gray-500 placeholder:text-xs focus-visible:outline-amber-600`}
              id='title'
              type='text'
              name='title'
              autoComplete='off'
              defaultValue={note.title}
              placeholder='Enter a note title (optional)'
              aria-label='Note title'
              // aria-labelledby='title-label'
            />
          </div>
          <div className=''>
            <label id='text-label' className='sr-only' htmlFor='text'>
              Text
            </label>
            <textarea
              className='block bg-transparent resize-none rounded-b-xl w-full p-2 text-sm placeholder:text-gray-500 focus-visible:outline-amber-600 '
              id='text'
              name='text'
              rows={8}
              autoComplete='off'
              defaultValue={note.text}
              placeholder='Start writing your new note...'
              required
              aria-label='Note text'
              // aria-labelledby='text-label'
            />
          </div>
        </div>
        <div className='my-2'>
          <TagField tags={note.tags} userTags={userTags}></TagField>
        </div>
        <div className='flex gap-2 mt-4'>
          <SubmitButton text={`${noteState ? 'Update' : 'Create'} Note`} />
          <Modal
            hasBlur={false}
            modalContentComponent={
              <div className='max-w-64 text-center space-y-2'>
                <p>
                  Are you <span className='font-semibold'>sure</span>? This action can&apos;t be undone.
                </p>
                <DeleteNoteButton noteId={note.id}></DeleteNoteButton>
              </div>
            }>
            <div className='rounded-lg bg-red-500 flex items-center justify-center w-10 aspect-square'>
              <TrashIcon className='h-5 w-5 text-white' />
            </div>
          </Modal>
        </div>

        <div className='flex h-8 items-end space-x-1' aria-live='polite' aria-atomic='true'>
          {errorMessage?.message && (
            <>
              <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
              <p className='text-sm text-red-500'>{errorMessage.message}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

interface SubmitButtonProps {
  readonly text: string;
}

type DeleteButtonProps = {
  readonly noteId: string;
};

function SubmitButton({ text }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button className='grow' aria-disabled={pending} type='submit'>
      {text}
      {/* <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' /> */}
    </Button>
  );
}

function DeleteNoteButton({ noteId }: DeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteNote(noteId);
    setDeleting(false);
  };

  return (
    <button
      type='button'
      className='rounded-lg bg-red-500 items-center justify-center px-4 h-10 mx-auto text-white disabled:bg-red-300'
      onClick={handleDelete}
      disabled={deleting}>
      Delete Note
    </button>
  );
}
