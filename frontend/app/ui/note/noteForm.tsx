'use client';

import CreatableSelect from 'react-select';
import { useFormState, useFormStatus } from 'react-dom';
import { createNote } from '../../lib/actions';
import { caprasimo } from '../fonts';
import { Button } from '../button';
import { useState, KeyboardEventHandler } from 'react';
import { NoteFormState, NoteWithTags, NoteForm } from '../../lib/types';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

type Props = {
  noteState?: NoteWithTags;
};

const components = {
  DropdownIndicator: null,
};

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

/**
 * Consider:
 * - If task is to update, note, pass NoteWithTags in as a prop
 * - If NoteWithTags is in prop, define initialState based on the values in it
 * - Rewrite "createNote" (and update it) to check if "id" is in the submitted formData.
 * - Can use that to determine whether we update or create note.
 * - Believe a similar method was used in the next js demo app
 */
export default function NoteForm({ noteState }: Props) {
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

  /**
   * See if these States can be modified to fit with overall formState
   */
  const initialState: NoteFormState = { message: null, errors: {} };
  const [errorMessage, dispatch] = useFormState(createNote, initialState);

  const defaultValueOptions = note.tags.map((value) => ({ value, label: value }));

  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState<readonly Option[]>(defaultValueOptions);

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (!inputValue) return;
    switch (e.key) {
      case 'Enter':
      case 'Tab':
        setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue('');
        e.preventDefault();
    }
  };

  return (
    <form action={dispatch} className='space-y-3'>
      <div className='flex-1 rounded-lg bg-gray-50 px-6 py-4 min-w-64'>
        <div className='w-full'>
          <div>
            <label id='title-label' className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='title'>
              Title
            </label>
            <input
              className={`${caprasimo.className} peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500`}
              id='title'
              type='text'
              name='title'
              autoComplete='off'
              defaultValue={note.title}
              placeholder='Enter a note title (optional)'
              aria-labelledby='title-label'
            />
          </div>
          <div className='mt-4'>
            <label id='text-label' className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='text'>
              Text
            </label>
            <input
              className='peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500'
              id='text'
              type='text'
              name='text'
              autoComplete='off'
              defaultValue={note.text}
              placeholder='Start writing your new note...'
              required
              aria-labelledby='text-label'
            />
          </div>
          <div className='mt-4'>
            <label id='tags-label' className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='tags'>
              Tags
            </label>
            <CreatableSelect
              id='tags'
              instanceId={'tag'}
              name='tags'
              components={components}
              inputValue={inputValue}
              isClearable
              isMulti
              // defaultValue={defaultValueOptions.map((e) => e)}
              menuIsOpen={false}
              onChange={(newValue) => setValue(newValue)}
              onInputChange={(newValue) => setInputValue(newValue)}
              onKeyDown={handleKeyDown}
              placeholder='Type some tags and press enter...'
              value={value}
              aria-labelledby='tags-label'
            />
          </div>
        </div>
        <SubmitButton text={`${noteState ? 'Update' : 'Create'} Note`} />

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

function SubmitButton({ text }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button className='mt-4 w-full' aria-disabled={pending}>
      {text}
      {/* <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' /> */}
    </Button>
  );
}
