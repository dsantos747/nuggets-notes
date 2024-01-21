import { auth, signOut } from '@/auth';
import SearchBar from '../ui/notespace/search';
import NoteCloud from '../ui/notespace/noteCloud';
import { caprasimo } from '../ui/fonts';
import { unstable_cache } from 'next/cache';
import { fetchLatestNotes, fetchUserTags } from '../lib/data';
import { NoteWithTags, Tag } from '../lib/types';

export default async function NotespaceLayout({ children }: { readonly children: React.ReactNode }) {
  const authStatus = await auth();
  // let latestNotes: NoteWithTags[] = [];
  // let userTags: Tag[] = [];
  // const numberOfNotes = 10;

  // if (typeof authStatus?.user?.id === 'string') {
  //   // Cache incorporated to prevent db call on EVERY page reload
  //   const getCachedLatestNotes = unstable_cache(async (n, id) => fetchLatestNotes(n, id), undefined, { tags: ['userNotes'] });
  //   const getUserTags = unstable_cache(async (id) => fetchUserTags(id), undefined, { tags: ['userTags'] });

  //   latestNotes = await getCachedLatestNotes(numberOfNotes, authStatus.user.id);
  //   userTags = await getUserTags(authStatus.user.id);
  // }

  return (
    <main className='flex justify-center min-h-screen bg-amber-400'>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
        className='absolute right-6 top-4 z-10 '>
        <button type='submit' className='hover:text-orange-800 transition-colors duration-100'>
          Sign Out
        </button>
      </form>
      <div className='relative flex w-full flex-col space-y-4 md:space-y-8'>
        {/* <SearchBar></SearchBar> */}
        <div className='mx-auto max-w-lg md:pt-16'>
          <p className='select-none'>Hello, {authStatus?.user?.name ?? 'Guest'}!</p>
          <h1 className={`${caprasimo.className} text-4xl md:text-6xl select-none text-center text-gradient pb-4`}>nuggets.com</h1>
          {/* <NoteCloud notes={latestNotes} userTags={userTags}></NoteCloud> */}
          <SearchBar></SearchBar>
        </div>
        {children}
      </div>
      {/* <div className='absolute bottom-4 right-8 text-xs text-amber-800'>
        Created by{' '}
        <a href='https://danielsantosdev.vercel.app/' className='underline'>
          Daniel Santos
        </a>{' '}
        (
        <a href='https://github.com/dsantos747/nuggets-notes' className='underline'>
          Github
        </a>
        )
      </div> */}
    </main>
  );
}
