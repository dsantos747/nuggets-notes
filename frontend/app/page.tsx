import { LoginForm } from './ui/login-form';
import { caprasimo } from './ui/fonts';
import Link from 'next/link';
import Modal from './ui/modal';

export default function Home() {
  return (
    <main className='home-splash flex min-h-screen flex-col lg:flex-row items-center lg:justify-between px-20 md:px-28 lg:px-40 xl:px-48 py-24 gap-16'>
      <div className='max-w-4xl'>
        <h1 className={`${caprasimo.className} text-4xl lg:text-6xl text-amber-700`}>nuggets.com</h1>
        <h3 className='my-4'>
          The place to store all those golden <span className={`${caprasimo.className} text-lg`}>nuggets</span> of information.
        </h3>
        <div className='my-4 flex gap-2 justify-center md:hidden'>
          <Link className='button-1 bg-yellow-50 border-yellow-50 hover:border-amber-900 hover:border-opacity-75' href='/login'>
            Log In
          </Link>
          <Link className='button-1 text-white font-semibold bg-orange-600 border-orange-600 hover:border-orange-800' href='/signup'>
            Sign Up
          </Link>
        </div>
        <Modal icon='question'>
          <p>
            Ever needed to just jot something down quickly? Without worrying about where it was, and if you'd be able to find it afterwards?
          </p>
          <p>
            nuggets.com <span>leverages the power of AI</span> to handle the organisation of your notes for you. When you want to recall
            what you've written, simply search for the topic and nuggets.com will show you all you have written on it - your{' '}
            <span className={`${caprasimo.className} text-lg`}>nuggets</span>.
          </p>
        </Modal>
      </div>
      <div className='hidden md:block'>
        <LoginForm />
      </div>
    </main>
  );
}
