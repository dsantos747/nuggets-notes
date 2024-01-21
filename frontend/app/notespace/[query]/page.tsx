import { auth } from '@/auth';
import { fetchAllNotes, fetchUserTags, getCachedAllNotes, getUserTags } from '../../lib/data';
import { NoteWithTags, Tag } from '../../lib/types';
import { unstable_cache } from 'next/cache';
import NoteGrid from '@/app/ui/notespace/noteGrid';

async function NotespacePage() {
  const authStatus = await auth();
  let userNotes: NoteWithTags[] = [];
  let userTags: Tag[] = [];

  if (typeof authStatus?.user?.id === 'string') {
    // Cache incorporated to prevent db call on EVERY page reload

    userNotes = await getCachedAllNotes(authStatus.user.id);
    userTags = await getUserTags(authStatus.user.id);
  }

  return (
    <div className='flex flex-col justify-between h-full'>
      <NoteGrid userNotes={userNotes} userTags={userTags}></NoteGrid>
      <div className='pointer-events-none z-10 w-full px-4 pb-4 pt-20 md:pt-12 text-right text-xs text-amber-800 bg-gradient-to-t from-amber-400 to-transparent'>
        Created by{' '}
        <a href='https://danielsantosdev.vercel.app/' className='underline pointer-events-auto'>
          Daniel Santos
        </a>{' '}
        (
        <a href='https://github.com/dsantos747/nuggets-notes' className='underline pointer-events-auto'>
          Github
        </a>
        )
      </div>
    </div>
  );
}

export default NotespacePage;
