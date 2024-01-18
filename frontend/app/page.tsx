import { LoginForm } from './ui/authForm';
import { caprasimo } from './ui/fonts';
import Modal from './ui/modal';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import Info from './ui/info';

export default function Home() {
  return (
    <main className='home-splash flex min-h-screen flex-col lg:flex-row items-center lg:justify-between px-20 md:px-28 lg:px-40 xl:px-48 py-16 lg:py-24 gap-4 lg:gap-16'>
      <div className='max-w-4xl'>
        <h1 className={`${caprasimo.className} text-4xl lg:text-6xl text-amber-700`}>nuggets.com</h1>
        <h3 className='my-4'>
          The place to store all those golden <span className={`${caprasimo.className} text-lg`}>nuggets</span> of information.
        </h3>
        <Modal modalContentComponent={<Info></Info>}>
          <QuestionMarkCircleIcon className='absolute top-8 left-8 h-7 w-7 text-orange-900 hover:text-black'></QuestionMarkCircleIcon>
        </Modal>
      </div>
      <div className=''>
        <LoginForm />
      </div>
    </main>
  );
}
