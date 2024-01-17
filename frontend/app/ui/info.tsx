import { caprasimo } from './fonts';

type Props = {};

export default function Info({}: Props) {
  return (
    <div>
      <p>
        Ever needed to just jot something down quickly? Without worrying about where it was, and if you'd be able to find it afterwards?
      </p>
      <p>
        nuggets.com <span>leverages the power of AI</span> to handle the organisation of your notes for you. When you want to recall what
        you've written, simply search for the topic and nuggets.com will show you all you have written on it - your{' '}
        <span className={`${caprasimo.className} text-lg`}>nuggets</span>.
      </p>
    </div>
  );
}
