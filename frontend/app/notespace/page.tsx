import { signOut, auth } from '@/auth';
import { fetchLatestNotes } from '../lib/data';
import { NoteWithTags } from '../lib/types';

type Props = {};

async function NotespacePage({}: Props) {
  const authStatus = await auth();
  let latestNotes;
  if (typeof authStatus?.user?.id === 'string') {
    /**
     * NOTE: During development, substitute this with a dummy array of notes, to save on Neon postgres compute time.
     */
    latestNotes = await fetchLatestNotes(5, authStatus.user.id);
  }

  return (
    <div>
      <p>Hello, {authStatus?.user?.name ?? 'Guest'}!</p>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}>
        <button type='submit'>Sign Out</button>
      </form>
      {latestNotes?.map((note: NoteWithTags) => {
        return (
          <div key={note.id} className='p-4 bg-white bg-opacity-30 w-max border-2 border-solid border-white rounded-md max-w-64 scale-75'>
            <h3>{note.title}</h3>
            <p>{note.text}</p>
            {note.tags.map((tag: string, id: number) => {
              return <span key={id}>{tag}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default NotespacePage;
