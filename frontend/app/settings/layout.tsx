import { signOut } from '@/auth';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default async function NotespaceLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <main className='flex justify-center min-h-screen bg-amber-400 '>
      <Link href='/notespace' className='absolute left-6 top-4 z-10 hover:text-orange-800 transition-colors duration-100'>
        <ArrowLeftIcon className='h-6 w-6'></ArrowLeftIcon>
      </Link>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
        className='absolute right-6 top-4 z-10 '>
        <button type='submit' className='hover:text-orange-800 transition-colors duration-100'>
          Sign Out
        </button>
      </form>
      <div className='relative mx-auto py-16'>{children}</div>
    </main>
  );
}
