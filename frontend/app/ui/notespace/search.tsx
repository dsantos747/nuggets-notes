'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter, useParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
  const { replace, push } = useRouter();
  const params = useParams<{ query: string }>();

  const handleSearch = useDebouncedCallback((term: string) => {
    if (term) {
      replace(`/notespace/${term}`);
    } else {
      push('/notespace');
    }
  }, 300);

  return (
    <div className='relative flex flex-1 flex-shrink-0'>
      <label htmlFor='search' className='sr-only'>
        Search
      </label>
      <input
        className='peer block w-full rounded-full border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus-visible:outline-amber-700'
        placeholder='Show me what I know about...'
        onChange={(event) => {
          handleSearch(event.target.value);
        }}
        defaultValue={params.query}
      />
      <MagnifyingGlassIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
      <button
        className={params.query ? 'absolute right-3 top-1/2' : 'hidden'}
        onClick={() => {
          handleSearch('');
        }}>
        <XMarkIcon className='h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900'></XMarkIcon>
      </button>
    </div>
  );
}
