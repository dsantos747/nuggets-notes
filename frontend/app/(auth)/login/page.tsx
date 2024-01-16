import { LoginForm } from '@/app/ui/authForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
