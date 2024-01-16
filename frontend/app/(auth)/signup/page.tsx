import { SignUpForm } from '@/app/ui/authForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignUpPage() {
  return (
    <div>
      <SignUpForm />
    </div>
  );
}
