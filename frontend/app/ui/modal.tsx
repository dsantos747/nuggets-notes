'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';

type Props = {
  readonly modalContentComponent: React.ReactNode;
  readonly hasBlur?: boolean;
  readonly isWarning?: boolean;
  readonly children: React.ReactNode;
};

export default function Modal({ modalContentComponent, hasBlur = true, isWarning = false, children }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const modalDivRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (blurRef.current?.contains(event.target as Node) && !modalDivRef.current?.contains(event.target as Node) && modalOpen) {
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
      data-testid='openModalButton'
      className='cursor-pointer'
      onClick={() => {
        setModalOpen(!modalOpen);
      }}>
      {children}
      {modalOpen && (
        <div
          ref={blurRef}
          className={`fixed z-50 left-0 top-0 cursor-default w-full h-full ${
            hasBlur ? 'backdrop-blur-sm' : ''
          } transition-opacity duration-700 ease-in-out`}>
          <div
            data-testid='modalWindow'
            ref={modalDivRef}
            onClick={(event) => {
              event.stopPropagation(); // This prevents the modal closing on click bug.
            }}
            className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2  p-8 rounded-2xl bg-white drop-shadow-2xl ${
              isWarning ? ' shadow-[0_0_30px_-10px_rgba(239,68,68,1)]' : ''
            }`}>
            <button
              data-testid='closeModalButton'
              className='absolute right-5 top-5'
              onClick={() => {
                setModalOpen(!modalOpen);
              }}>
              <XMarkIcon className='h-7 w-7 text-gray-500 hover:text-orange-500 transition-all duration-150' />
            </button>
            {modalContentComponent}
          </div>
        </div>
      )}
    </div>
  );
}
