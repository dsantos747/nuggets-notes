'use client';

import { KeyboardEventHandler, useState } from 'react';
import CreatableSelect, { ControlProps } from 'react-select';
import { Tag } from '@/app/lib/types';

const components = {
  //   DropdownIndicator: null,
};

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

type Props = {
  readonly tags: string[];
  readonly userTags: Tag[];
};

const customClassNames = {
  clearIndicator: () => 'scale-75 cursor-pointer',
  container: () => '',
  control: (state: any) => `rounded-md border-[1px] ${state.isFocused ? 'border-2 border-amber-600' : 'border-grey-300'}`,
  dropdownIndicator: () => 'scale-75 cursor-pointer',
  group: () => '',
  groupHeading: () => '',
  indicatorsContainer: () => '',
  indicatorSeparator: () => '',
  input: () => 'text-xs',
  loadingIndicator: () => '',
  loadingMessage: () => '',
  menu: () => 'bg-white flex px-2 pt-3 pb-2 rounded-md border-[1px] border-gray-300',
  menuList: () => 'flex gap-1 w-content text-xs',
  menuPortal: () => '',
  multiValue: () => 'rounded-full bg-amber-100 px-2 py-1 border-[1px] border-amber-300',
  multiValueLabel: () => 'text-xs',
  multiValueRemove: () => '',
  noOptionsMessage: () => '',
  option: () => 'rounded-full bg-amber-100 px-2 py-1 border-[1px] border-amber-300 hover:cursor-pointer',
  placeholder: () => 'text-xs text-gray-500',
  singleValue: () => 'border-[1px] border-amber-300 rounded-xl',
  valueContainer: () => 'gap-1 px-2 flex flex-wrap',
};

export default function TagField({ tags, userTags }: Props) {
  const defaultValueOptions = tags.map((value) => ({ value, label: value }));
  const tagOptions = userTags.map((tag) => ({ value: tag.name, label: tag.name }));

  const [tagFieldValue, setTagFieldValue] = useState('');
  const [tagFieldState, setTagFieldState] = useState<readonly Option[]>(defaultValueOptions);

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (!tagFieldValue) return;
    switch (e.key) {
      case 'Enter':
      case 'Tab':
        setTagFieldState((prev) => [...prev, createOption(tagFieldValue)]);
        setTagFieldValue('');
        e.preventDefault();
    }
  };
  return (
    <CreatableSelect
      id='tags'
      instanceId={'tag'}
      name='tags'
      components={components}
      inputValue={tagFieldValue}
      options={tagOptions}
      isClearable
      isMulti
      defaultMenuIsOpen={false}
      onChange={(newValue) => setTagFieldState(newValue)}
      onInputChange={(newValue) => setTagFieldValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder='Type some tags and press enter...'
      value={tagFieldState}
      aria-label='Tags'
      unstyled
      classNames={customClassNames}
    />
  );
}
