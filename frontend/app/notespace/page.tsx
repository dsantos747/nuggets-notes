import { signOut } from '@/auth';

type Props = {};

function NotespacePage({}: Props) {
  return (
    <div>
      This is the big notespace page. Make it look good!
      <form
        action={async () => {
          'use server';
          await signOut();
        }}>
        <button type='submit'>Sign Out</button>
      </form>
    </div>
  );
}

export default NotespacePage;
