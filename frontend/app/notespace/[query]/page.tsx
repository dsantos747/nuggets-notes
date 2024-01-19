import { auth } from '@/auth';
import { fetchAllNotes, fetchUserTags } from '../../lib/data';
import { NoteWithTags, Tag } from '../../lib/types';
import { unstable_cache } from 'next/cache';
import NoteGrid from '@/app/ui/notespace/noteGrid';

async function NotespacePage() {
  const authStatus = await auth();
  let userNotes: NoteWithTags[] = [];
  let userTags: Tag[] = [];

  if (typeof authStatus?.user?.id === 'string') {
    // Cache incorporated to prevent db call on EVERY page reload
    const getCachedAllNotes = unstable_cache(async (id) => fetchAllNotes(id), undefined, { tags: ['userNotes'] });
    const getUserTags = unstable_cache(async (id) => fetchUserTags(id), undefined, { tags: ['userTags'] });

    userNotes = await getCachedAllNotes(authStatus.user.id);
    userTags = await getUserTags(authStatus.user.id);
  }

  return <NoteGrid userNotes={userNotes} userTags={userTags}></NoteGrid>;
}

export default NotespacePage;
