'use client';

import { NoteWithTags, Tag } from '@/app/lib/types';
import Modal from '../modal';
import NoteForm from '../note/noteForm';
import { useParams, usePathname } from 'next/navigation';

type Props = {
  readonly userNotes: NoteWithTags[];
  readonly userTags: Tag[];
};

export default function NoteGrid({ userNotes, userTags }: Props) {
  const pathname = usePathname();
  let notes: NoteWithTags[] = [];
  let empty = false;
  const params = useParams<{ query: string }>();

  if (pathname === '/notespace') {
    notes = userNotes;
  } else {
    // If params.query has &, return only notes which include both those params
    let quotedPhrases: string[] = [];
    const quotedTerms = params.query.split('%22');

    const searchTags = params.query.toLowerCase().split('%20');

    const unQuotedTerms = searchTags.filter((tag) => !tag.startsWith('%22') || !tag.endsWith('%22'));

    if (unQuotedTerms.length > 0) {
      notes = userNotes.filter((note) => note.tags.some((tag) => unQuotedTerms.includes(tag.toLowerCase())));
    }

    if (quotedTerms.length > 1) {
      quotedPhrases = quotedTerms.filter((_, i) => i % 2 === 1).map((term) => term.replaceAll('%20', ' ').toLowerCase());
      notes = userNotes.filter((note) => note.tags.some((tag) => quotedPhrases.includes(tag.toLowerCase())));
    }

    if (searchTags.some((tag) => tag.includes('%26'))) {
      const andTerms = searchTags.map((term) => term.split('%26')).flat();
      notes = userNotes.filter((note) => andTerms.every((term) => note.tags.some((tag) => tag.toLowerCase().includes(term.toLowerCase()))));
    }
  }

  if (notes.length == 0) {
    empty = true;
  }

  return (
    <div>
      <div className='relative text-center px-4 lg:px-16 gap-4 grid grid-cols-1 min-[600px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {notes?.map((note: NoteWithTags) => {
          return (
            <div className='pointer-events-auto mx-auto my-auto max-w-96' key={note.id}>
              <Modal modalContentComponent={<NoteForm noteState={note} userTags={userTags}></NoteForm>}>
                <div className='p-4 bg-white bg-opacity-30 border-2 border-solid border-white rounded-md text-sm'>
                  <h3 className='select-none font-semibold text-left'>{note.title}</h3>
                  <p className='select-none text-6 line-clamp-6 text-left'>{note.text}</p>
                  {note.tags.map((tag: string, id: number) => {
                    return (
                      <span key={id} className='px-2 select-none font-semibold text-amber-900'>
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </Modal>
            </div>
          );
        })}
      </div>
      {empty && (
        <div className='flex justify-center overflow-hidden'>
          <div className='text-center select-none'>
            <p className='py-6 text-amber-900 text-sm'>There&apos;s nothing here...</p>
          </div>
        </div>
      )}
    </div>
  );
}
