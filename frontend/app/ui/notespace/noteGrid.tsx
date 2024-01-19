'use client';

import { NoteWithTags, Tag } from '@/app/lib/types';
import Modal from '../modal';
import NoteForm from '../note/noteForm';
import { useParams } from 'next/navigation';
import Image from 'next/image';

type Props = {
  readonly userNotes: NoteWithTags[];
  readonly userTags: Tag[];
};

export default function NoteGrid({ userNotes, userTags }: Props) {
  const params = useParams<{ query: string }>();
  const searchTags = params.query.toLowerCase().split('%20');
  let empty = false;

  let notes = userNotes.filter((note) => {
    return note.tags.some((tag) => searchTags.includes(tag.toLowerCase()));
  });

  if (notes.length == 0) {
    empty = true;
  }

  return (
    <div>
      <div className='relative text-center px-4 lg:px-16 gap-4 grid grid-cols-1 min-[600px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {notes?.map((note: NoteWithTags) => {
          return (
            <div className='pointer-events-auto mx-auto my-auto' key={note.id}>
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
        <div className='flex justify-center py-18 overflow-hidden'>
          <div className='text-center'>
            <div id='tumblebounce' className='pt-52'>
              <div id='tumbleweed'>
                <Image src={'/tumbleweed.png'} alt='Tumbleweed' height={70} width={70} id='tumble' className='opacity-50'></Image>
              </div>
            </div>
            <p className='py-6 text-amber-900 text-sm'>There&apos;s nothing here...</p>
          </div>
        </div>
      )}
    </div>
  );
}

{
  /* <a href="https://www.freepik.com/icon/tumbleweed_1171279">Icon by Freepik</a> */
}
