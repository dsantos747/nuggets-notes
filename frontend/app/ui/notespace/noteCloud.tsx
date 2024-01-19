'use client';

import { NoteWithTags, Tag } from '@/app/lib/types';
import Modal from '../modal';
import NoteForm from '../note/noteForm';
import anime from 'animejs/lib/anime.es.js';

type Props = {
  readonly notes: NoteWithTags[];
  readonly userTags: Tag[];
};

export default function NoteCloud({ notes, userTags }: Props) {
  const divPositions = [
    { top: '10%', left: '0%' },
    { top: '38%', left: '8%' },
    { top: '76%', left: '12%' },
    { top: '8%', left: '80%' },
    { top: '14%', left: '17%' },
    { top: '53%', left: '34%' },
    { top: '30%', left: '68%' },
    { top: '52%', left: '3%' },
    { top: '77%', left: '58%' },
    { top: '56%', left: '72%' },
  ];

  /**
   * Anime problems:
   * - Transform overrides tailwind scale
   * - Animation sometimes stutters (may be related)
   */
  function randomValues() {
    anime({
      targets: '.anime-note',
      translateX: function () {
        return anime.random(0, 15);
      },
      translateY: function () {
        return anime.random(0, 15);
      },
      easing: 'linear',
      delay: anime.stagger(50),
      duration: 5000,
      complete: randomValues,
    });
  }

  // randomValues();

  // function randomNumInRanges(min: number, max: number) {
  //   const posChoice = Math.random() * (max - min) + min;

  //   const negMin = max * -1;
  //   const negMax = min * -1;
  //   const negChoice = Math.random() * (negMax - negMin) + negMin;

  //   return Math.random() < 0.5 ? posChoice : negChoice;
  // }

  // const divPositions = Array.from({ length: notes.length }, () => ({
  //   top: `${Math.random() * 75}%`,
  //   left: `${Math.random() * 75}%`,
  // }));

  return (
    <div className='fixed pointer-events-none top-0 left-0 w-screen h-screen'>
      {notes?.map((note: NoteWithTags, i: number) => {
        return (
          <div
            id='noteDiv'
            className='pointer-events-auto absolute'
            style={{ top: divPositions[i].top, left: divPositions[i].left }}
            key={note.id}>
            <Modal modalContentComponent={<NoteForm noteState={note} userTags={userTags}></NoteForm>}>
              <div
                id='noteBox'
                className=' anime-note p-4 absolute bg-white bg-opacity-30 w-max border-2 border-solid border-white rounded-md max-w-64 scale-75'>
                <h3 className='select-none font-semibold'>{note.title}</h3>
                <p className='select-none line-clamp-4'>{note.text}</p>
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
  );
}
