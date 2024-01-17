import { auth } from '@/auth';
import { fetchLatestNotes } from '../lib/data';
import { NoteWithTags } from '../lib/types';
import NoteForm from '../ui/note/noteForm';
import { unstable_cache } from 'next/cache';
import Modal from '../ui/modal';
import NoteCloud from '../ui/notespace/noteCloud';
import { PlusIcon } from '@heroicons/react/24/outline';

type Props = {};

async function NotespacePage({}: Props) {
  const authStatus = await auth();
  let latestNotes: NoteWithTags[] = [];
  const numberOfNotes = 10;

  if (typeof authStatus?.user?.id === 'string') {
    // Cache incorporated to prevent db call on EVERY page reload
    const getCachedLatestNotes = unstable_cache(async (n, id) => fetchLatestNotes(n, id), undefined, { tags: ['latestNotes'] });
    latestNotes = await getCachedLatestNotes(numberOfNotes, authStatus.user.id);
  }

  return (
    <div className='relative text-center'>
      <p>Hello, {authStatus?.user?.name ?? 'Guest'}!</p>
      <NoteCloud notes={latestNotes}></NoteCloud>
      {/* <SearchBar></SearchBar> */}
      <div>A nice big searchbar will go here</div>
      <Modal modalContentComponent={<NoteForm></NoteForm>}>
        <PlusIcon className='h-7 w-7 text-orange-900 hover:text-black'></PlusIcon>
      </Modal>
    </div>
  );
}

export default NotespacePage;
