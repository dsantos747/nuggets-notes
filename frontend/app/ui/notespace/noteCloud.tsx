'use client';

/**
 * THIS FILE IS TEMPORARILY UNUSED
 *
 * Creating a visually appealing notecloud poses many problems, what with excessive client rendering,
 * animation gpu tax, complex note positioning around other items on page, and more. Therefore, a simple
 * grid layout has been implemented in the meantime.
 */

import { NoteWithTags, Tag } from '@/app/lib/types';
import Modal from '../modal';
import NoteForm from '../note/noteForm';
// import anime from 'animejs/lib/anime.es.js';
// import { useEffect, useState } from 'react';

type Props = {
  readonly userNotes: NoteWithTags[];
  readonly userTags: Tag[];
};

export default function NoteCloud({ userNotes, userTags }: Props) {
  // const [noteCount, setNoteCount] = useState(Math.floor(window.innerWidth / 320) * 2);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setNoteCount(Math.floor(window.innerWidth / 320) * 2);
  //   };
  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  const divPositions = [
    { bottom: '36%', left: '25px' },
    { bottom: '35%', right: '320px' },
    { top: '37%', left: '54px' },
    { top: '38%', right: '335px' },
    { top: '10%', left: '12px' },
    { top: '8%', right: '260px' },
    { top: '34%', left: '270px' },
    { top: '46%', right: '585px' },
    { bottom: '33%', left: '310px' },
    { top: '14%', left: '17%' },
  ];

  /**
   * Anime problems:
   * - Transform overrides tailwind scale
   * - Animation sometimes stutters (may be related)
   */
  // function randomValues() {
  //   anime({
  //     targets: '.anime-note',
  //     translateX: function () {
  //       return anime.random(0, 15);
  //     },
  //     translateY: function () {
  //       return anime.random(0, 15);
  //     },
  //     easing: 'linear',
  //     // delay: anime.stagger(50),
  //     duration: 5000,
  //     complete: randomValues,
  //   });
  // }

  // randomValues();

  let noteCount = 10;
  let notes = userNotes.slice(0, noteCount);

  return (
    <div className='fixed pointer-events-none top-0 left-0 w-screen h-screen z-10'>
      {notes?.map((note: NoteWithTags, i: number) => {
        return (
          <div
            id='noteDiv'
            className='pointer-events-auto absolute'
            style={{
              [divPositions[i].top ? 'top' : 'bottom']: divPositions[i].top || divPositions[i].bottom,
              [divPositions[i].left ? 'left' : 'right']: divPositions[i].left || divPositions[i].right,
            }}
            key={note.id}>
            <Modal
              modalContentComponent={
                <div className='relative z-50'>
                  <NoteForm noteState={note} userTags={userTags}></NoteForm>
                </div>
              }>
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
