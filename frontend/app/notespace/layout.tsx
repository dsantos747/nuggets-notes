import { caprasimo } from '../ui/fonts';

export default function AuthLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <main className='flex items-center justify-center min-h-screen bg-amber-400'>
      {/* md:h-screen */}
      <div className='relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32'>{children}</div>
    </main>
  );
}
