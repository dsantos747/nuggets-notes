'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';

type Props = {
  readonly modalContentComponent: React.ReactNode;
  readonly hasBlur?: boolean;
  readonly children: React.ReactNode;
};

export default function Modal({ modalContentComponent, hasBlur = true, children }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const modalDivRef = useRef<HTMLDivElement>(null);
  const openDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!modalDivRef.current?.contains(event.target as Node) && !openDivRef.current?.contains(event.target as Node)) {
        setModalOpen(false);
      }
    };
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalOpen(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [modalDivRef]);

  return (
    <div
      ref={openDivRef}
      className='cursor-pointer'
      onClick={() => {
        setModalOpen(!modalOpen);
      }}>
      {children}
      {modalOpen && (
        <div
          className={`fixed z-50 left-0 top-0 transform cursor-default w-screen h-screen ${
            hasBlur ? 'backdrop-blur-sm' : ''
          } transition-opacity duration-700 ease-in-out`}>
          <div
            ref={modalDivRef}
            onClick={(event) => {
              event.stopPropagation(); // THIS IS EXPERIMENTAL, TO PREVENT MODAL CLOSING ON CLICK.
            }}
            className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2  p-8 rounded-2xl bg-white drop-shadow-2xl'>
            <button
              className='absolute right-5 top-5'
              onClick={() => {
                setModalOpen(!modalOpen);
              }}>
              <XMarkIcon className='h-7 w-7 text-gray-500 hover:text-orange-500 hover:scale-110 transition-all duration-150' />
            </button>
            {modalContentComponent}
          </div>
        </div>
      )}
    </div>
  );
}
