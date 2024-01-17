import { caprasimo } from '../ui/fonts';

export default function AuthLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <main className='flex items-center justify-center min-h-screen'>
      {/* auth-bg     - this class removed for now because the animation is a cpu killer */}
      <div className='relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32'>
        <div className='flex h-20 w-full items-end rounded-lg bg-amber-500 px-3 pt-3 md:h-36'>
          <div className={`${caprasimo.className} w-32 text-white text-5xl md:w-36`}>nuggets</div>
        </div>
        {children}
      </div>
    </main>
  );
}
