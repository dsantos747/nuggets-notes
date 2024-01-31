import Modal from '../ui/modal';
import { caprasimo } from '../ui/fonts';
import { deleteAccount } from '../lib/actions';
import { signOut } from '@/auth';

export default function Settings() {
  return (
    <div className='min-w-52 sm:min-w-60 max-w-64 flex flex-col space-y-12 items-center'>
      <h1 className={`${caprasimo.className} w-full text-left text-3xl border-b-[1px] border-amber-700`}>Settings</h1>
      <Modal
        hasBlur={false}
        isWarning={true}
        modalContentComponent={
          <div className='max-w-64 px-4 text-center text-sm space-y-2'>
            <p>Are you sure? You will lose all your notes permanently.</p>
            <p>This action is final and cannot be undone!</p>
            <form
              action={async () => {
                'use server';
                await deleteAccount();
                await signOut();
              }}>
              <button
                data-testId='confirmDeleteAccountButton'
                type='submit'
                className='rounded-lg bg-red-500 items-center justify-center px-4 mt-4 h-10 mx-auto text-white disabled:bg-red-300'>
                Delete Account
              </button>
            </form>
          </div>
        }>
        <div data-testId='deleteAccountButton' className='text-white font-bold rounded-md px-4 py-2 bg-red-500 w-content'>
          Delete Account
        </div>
      </Modal>
    </div>
  );
}
