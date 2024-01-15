'use client';

import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';

type Props = {
  readonly icon: string;
  readonly children: React.ReactNode;
};

export default function Modal({ icon, children }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleOutSideClick = (event: MouseEvent) => {
      if (!divRef.current?.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
        setModalOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutSideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutSideClick);
    };
  }, [divRef]);

  return (
    <div>
      <button
        ref={buttonRef}
        className='absolute top-5 left-5'
        onClick={() => {
          setModalOpen(!modalOpen);
        }}>
        {icon === 'question' && <QuestionMarkCircleIcon className='h-7 w-7 text-orange-900 hover:text-black' />}
      </button>
      {modalOpen && (
        <div className='absolute z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen backdrop-blur-sm transition-opacity duration-700 ease-in-out'>
          <div
            ref={divRef}
            className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 py-12 px-8 max-w-5xl rounded-2xl bg-white drop-shadow-2xl'>
            <button
              className='absolute right-5 top-5'
              onClick={() => {
                setModalOpen(!modalOpen);
              }}>
              <XMarkIcon className='h-7 w-7 text-gray-500 hover:text-orange-500 hover:scale-110 transition-all duration-150' />
            </button>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
