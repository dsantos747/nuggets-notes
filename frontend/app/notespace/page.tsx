import { signOut, auth } from '@/auth';

type Props = {};

async function NotespacePage({}: Props) {
  const authStatus = await auth();

  return (
    <div>
      <p>This is the big notespace page. Make it look good!</p>
      {/* <WelcomeUser/> */}
      <p>Hello, {authStatus?.user?.name ?? 'Guest'}!</p>
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
