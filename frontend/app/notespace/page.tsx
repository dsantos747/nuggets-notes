import { auth } from '@/auth';
import { getCachedAllNotes, getUserTags } from '../lib/data';
import { NoteWithTags, Tag } from '../lib/types';
import NoteForm from '../ui/note/noteForm';
import Modal from '../ui/modal';
import { caprasimo } from '../ui/fonts';
import NoteGrid from '../ui/notespace/noteGrid';
// import NoteCloud from '../ui/notespace/noteCloud';

async function NotespacePage() {
  const authStatus = await auth();
  let userNotes: NoteWithTags[] = [];
  let latestNotes: NoteWithTags[] = [];
  let userTags: Tag[] = [];
  const numberOfNotes = 20;

  if (typeof authStatus?.user?.id === 'string') {
    // Cache incorporated to prevent db call on EVERY page reload

    userNotes = await getCachedAllNotes(authStatus.user.id);
    userTags = await getUserTags(authStatus.user.id);
    latestNotes = userNotes.slice(0, numberOfNotes);
  }

  /**
   * Commented code is for NoteCloud layout, which for now is unused.
   */
  return (
    <div className='relative text-center w-full flex flex-col items-center justify-between h-full'>
      {/* <div className='hidden md:block'>
        <NoteCloud userNotes={latestNotes} userTags={userTags}></NoteCloud>
      </div> */}

      {/* <Modal modalContentComponent={<NoteForm userTags={userTags}></NoteForm>}>
        <div className='flex gap-2 items-center justify-center select-none bg-amber-300 rounded-full w-32 md:w-auto md:h-24 md:aspect-square hover:opacity-75 transition-all duration-150'>
          <span className={`${caprasimo.className} relative z-auto plus-gradient text-3xl md:text-6xl `}>+</span>
          <span className='md:hidden'>Add note</span>
        </div>
      </Modal> */}

      {/* <div className='md:hidden mt-6 -mb-12'>
        <NoteGrid userNotes={latestNotes} userTags={userTags}></NoteGrid>
      </div> */}
      <div className='flex flex-col items-center -mb-12'>
        <Modal modalContentComponent={<NoteForm userTags={userTags}></NoteForm>}>
          <div className='flex gap-2 items-center justify-center select-none bg-amber-300 rounded-full w-32 md:w-auto md:h-24 md:aspect-square hover:opacity-75 transition-all duration-150'>
            <span className={`${caprasimo.className} relative z-auto plus-gradient text-3xl md:text-6xl `}>+</span>
            <span className='md:hidden'>Add note</span>
          </div>
        </Modal>

        <div className='my-6 '>
          <NoteGrid userNotes={latestNotes} userTags={userTags}></NoteGrid>
        </div>
        <div className='text-amber-900 text-sm mt-6'>Displaying your {numberOfNotes} most recent notes. Use the search to find more.</div>
      </div>

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
