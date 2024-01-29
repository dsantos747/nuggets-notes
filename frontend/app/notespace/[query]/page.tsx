import { auth } from '@/auth';
import { getCachedAllNotes, getUserTags } from '../../lib/data';
import { NoteWithTags, Tag } from '../../lib/types';
import NoteGrid from '@/app/ui/notespace/noteGrid';
import CreatedBy from '@/app/ui/createdBy';

async function NotespacePage() {
  const authStatus = await auth();
  let userNotes: NoteWithTags[] = [];
  let userTags: Tag[] = [];

  if (typeof authStatus?.user?.id === 'string') {
    // Cache incorporated to prevent db call on every page reload
    userNotes = await getCachedAllNotes(authStatus.user.id);
    userTags = await getUserTags(authStatus.user.id);
  }

  return (
    <div className='flex flex-col justify-between h-full'>
      <NoteGrid userNotes={userNotes} userTags={userTags}></NoteGrid>
      <div className='pointer-events-none z-10 w-full px-4 pb-4 pt-20 md:pt-12 text-right text-xs text-amber-800 bg-gradient-to-t from-amber-400 to-transparent'>
        <CreatedBy />
      </div>
    </div>
  );
}

export default NotespacePage;
