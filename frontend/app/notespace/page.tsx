import { auth } from '@/auth';
import { fetchLatestNotes, fetchUserTags } from '../lib/data';
import { NoteWithTags, Tag } from '../lib/types';
import NoteForm from '../ui/note/noteForm';
import { unstable_cache } from 'next/cache';
import Modal from '../ui/modal';
import NoteCloud from '../ui/notespace/noteCloud';
import { PlusIcon } from '@heroicons/react/24/outline';
import { caprasimo } from '../ui/fonts';

async function NotespacePage() {
  const authStatus = await auth();
  let latestNotes: NoteWithTags[] = [];
  let userTags: Tag[] = [];
  const numberOfNotes = 10;

  if (typeof authStatus?.user?.id === 'string') {
    // Cache incorporated to prevent db call on EVERY page reload
    const getCachedLatestNotes = unstable_cache(async (n, id) => fetchLatestNotes(n, id), undefined, { tags: ['latestNotes'] });
    const getUserTags = unstable_cache(async (id) => fetchUserTags(id), undefined, { tags: ['userTags'] });

    latestNotes = await getCachedLatestNotes(numberOfNotes, authStatus.user.id);
    userTags = await getUserTags(authStatus.user.id);
  }

  return (
    <div className='relative text-center'>
      <p>Hello, {authStatus?.user?.name ?? 'Guest'}! Welcome to</p>
      <h1 className={`${caprasimo.className} text-6xl select-none text-center text-gradient pb-4`}>nuggets.com</h1>
      <NoteCloud notes={latestNotes} userTags={userTags}></NoteCloud>
      {/* <SearchBar></SearchBar> */}
      <div>A nice big searchbar will go here</div>
      <Modal modalContentComponent={<NoteForm userTags={userTags}></NoteForm>}>
        <div className='text-black hover:text-orange-800 transition-colors duration-150'>
          <PlusIcon className='mx-auto h-20 w-20'></PlusIcon>
          <p className='text-xs -mt-2'>Add Note</p>
        </div>
      </Modal>
    </div>
  );
}

export default NotespacePage;
