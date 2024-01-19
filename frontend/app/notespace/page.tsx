import { auth } from '@/auth';
import { fetchLatestNotes, fetchUserTags } from '../lib/data';
import { NoteWithTags, Tag } from '../lib/types';
import NoteForm from '../ui/note/noteForm';
import { unstable_cache } from 'next/cache';
import Modal from '../ui/modal';
import NoteCloud from '../ui/notespace/noteCloud';
import { caprasimo } from '../ui/fonts';

async function NotespacePage() {
  const authStatus = await auth();
  let latestNotes: NoteWithTags[] = [];
  let userTags: Tag[] = [];
  const numberOfNotes = 10;

  if (typeof authStatus?.user?.id === 'string') {
    // Cache incorporated to prevent db call on EVERY page reload
    const getCachedLatestNotes = unstable_cache(async (n, id) => fetchLatestNotes(n, id), undefined, { tags: ['userNotes'] });
    const getUserTags = unstable_cache(async (id) => fetchUserTags(id), undefined, { tags: ['userTags'] });

    latestNotes = await getCachedLatestNotes(numberOfNotes, authStatus.user.id);
    userTags = await getUserTags(authStatus.user.id);
  }

  return (
    <div className='relative text-center mx-auto'>
      <NoteCloud notes={latestNotes} userTags={userTags}></NoteCloud>
      <Modal modalContentComponent={<NoteForm userTags={userTags}></NoteForm>}>
        <div className='flex items-center justify-center bg-amber-300 rounded-full h-24 w-24 hover:opacity-75 transition-all duration-150'>
          <p className={`${caprasimo.className} plus-gradient text-8xl`}>+</p>
        </div>
      </Modal>
    </div>
  );
}

export default NotespacePage;
