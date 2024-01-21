import { caprasimo } from './fonts';

export default function Info() {
  return (
    <div className='pt-6 w-max max-w-[70vw]'>
      <p className='text-start'>
        Ever needed to just jot something down quickly? Without worrying about where it was, and if you&apos;d be able to find it
        afterwards?
      </p>
      <div className='h-2 min-[320px]:h-4 md:h-6'></div>
      <p>
        nuggets.com <span>leverages the power of AI*</span> to handle the organisation of your notes for you. When you want to recall what
        you&apos;ve written, simply search for the topic and nuggets.com will show you all you have written on it - your{' '}
        <span className={`${caprasimo.className} text-lg`}>nuggets</span>.
      </p>
      <p className='text-right text-xs'>* AI integration coming soon.</p>
    </div>
  );
}
