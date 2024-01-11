import { MiniLoginForm } from './ui/login-form';
import { caprasimo } from './ui/fonts';
import TestButton from './ui/dbTestButton';

export default function Home() {
  return (
    <main className='home-splash flex min-h-screen flex-col lg:flex-row items-center px-20 md:px-28 lg:px-40 xl:px-48 py-24 gap-16'>
      <div className='max-w-4xl'>
        <h1 className={`${caprasimo.className} absolute left-1/4 text-4xl lg:text-6xl text-amber-700`}>nuggets.com</h1>
        <div className='mt-20'>
          <h3>
            The place to store all those golden <span className={`${caprasimo.className} text-lg`}>nuggets</span> of information - the ones
            which are just too good to forget.
          </h3>
          <p>
            Ever needed to just jot something down quickly? Without worrying about where it was, and if you'd be able to find it afterwards?
          </p>
          <p>
            nuggets.com <span>leverages the power of AI</span> to handle the organisation of your notes for you. When you want to recall
            what you've written, simply search for the topic and nuggets.com will show you all you have written on it - your{' '}
            <span className={`${caprasimo.className} text-lg`}>nuggets</span>.
          </p>
        </div>
        {/* <TestButton></TestButton> */}
      </div>
      <div className='hidden md:block'>
        <MiniLoginForm />
      </div>
    </main>
  );
}
