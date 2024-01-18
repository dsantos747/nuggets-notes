import { signOut } from '@/auth';

export default function AuthLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <main className='flex items-center justify-center min-h-screen bg-amber-400'>
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
      <div className='relative mx-auto flex w-full flex-col space-y-2.5 p-4 md:-mt-32'>{children}</div>
    </main>
  );
}
