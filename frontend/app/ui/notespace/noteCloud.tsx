import { NoteWithTags } from '@/app/lib/types';
import Modal from '../modal';
import NoteForm from '../note/noteForm';
import DeleteNote from '../note/deleteNoteButton';

type Props = {
  notes: NoteWithTags[];
};

export default function NoteCloud({ notes }: Props) {
  const divPositions = [
    { top: '10%', left: '0%' },
    { top: '38%', left: '8%' },
    { top: '76%', left: '12%' },
    { top: '8%', left: '80%' },
    { top: '14%', left: '17%' },
    { top: '73%', left: '34%' },
    { top: '30%', left: '68%' },
    { top: '52%', left: '3%' },
    { top: '77%', left: '58%' },
    { top: '56%', left: '72%' },
  ];
  //   const divPositions = Array.from({ length: notes.length }, () => ({
  //     top: `${Math.random() * 100}%`,
  //     left: `${Math.random() * 100}%`,
  //   }));

  return (
    <div className='fixed pointer-events-none top-0 left-0 w-screen h-screen'>
      {notes?.map((note: NoteWithTags, i: number) => {
        return (
          <div className='pointer-events-auto absolute' style={{ top: divPositions[i].top, left: divPositions[i].left }} key={note.id}>
            <Modal
              modalContentComponent={
                <div>
                  <NoteForm noteState={note}></NoteForm>
                  <DeleteNote noteId={note.id}></DeleteNote>
                </div>
              }>
              <div className='p-4 absolute bg-white bg-opacity-30 w-max border-2 border-solid border-white rounded-md max-w-64 scale-75'>
                <h3 className='select-none'>{note.title}</h3>
                <p className='select-none'>{note.text}</p>
                {note.tags.map((tag: string, id: number) => {
                  return (
                    <span key={id} className='px-2 select-none'>
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
  );
}
