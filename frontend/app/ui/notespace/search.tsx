'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter, useParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, push } = useRouter();
  const params = useParams<{ query: string }>();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      replace(`/notespace/${term}`);
    } else {
      push('/notespace');
    }
    // replace(`${pathname}?${params.toString()}`);
  }, 300);

  // const handleSearch = useDebouncedCallback((term: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set('page', '1');
  //   if (term) {
  //     params.set('query', term);
  //   } else {
  //     params.delete('query');
  //   }
  //   replace(`${pathname}?${params.toString().toLowerCase()}`);
  // }, 300);

  return (
    <div className='relative flex flex-1 flex-shrink-0'>
      <label htmlFor='search' className='sr-only'>
        Search
      </label>
      <input
        className='peer block w-full rounded-full border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 focus-visible:outline-amber-700'
        placeholder='Search for a note topic...'
        onChange={(event) => {
          handleSearch(event.target.value);
        }}
        defaultValue={params.query}
      />
      <MagnifyingGlassIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
    </div>
  );
}
