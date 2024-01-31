import { auth, signOut } from '@/auth';
import SearchBar from '../ui/notespace/search';
import { caprasimo } from '../ui/fonts';
import Link from 'next/link';
import { CogIcon } from '@heroicons/react/24/outline';

export default async function NotespaceLayout({ children }: { readonly children: React.ReactNode }) {
  const authStatus = await auth();

  return (
    <main className='flex justify-center min-h-screen bg-amber-400'>
      <Link href='/settings' className='absolute left-6 top-4 z-10'>
        <CogIcon className='h-6 w-6 hover:text-orange-800 transition-colors duration-100'></CogIcon>
      </Link>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
        className='absolute right-6 top-4 z-10 '>
        <button data-testId='signOutButton' type='submit' className='hover:text-orange-800 transition-colors duration-100'>
          Sign Out
        </button>
      </form>
      <div className='relative flex w-full flex-col space-y-4'>
        <div className='mx-auto max-w-lg pt-10 md:pt-16'>
          <p className='select-none'>Hello, {authStatus?.user?.name ?? 'Guest'}!</p>
          <h1 className={`${caprasimo.className} text-4xl md:text-6xl select-none text-center text-gradient pb-4`}>nugget notes</h1>
          <SearchBar></SearchBar>
        </div>
        {children}
      </div>
    </main>
  );
}
