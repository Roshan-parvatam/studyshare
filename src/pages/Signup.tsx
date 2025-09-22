import { Header } from '@/components/layout/Header';
import { SignupForm } from '@/components/auth/SignupForm';

export default function Signup() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
        <SignupForm />
      </div>
    </div>
  );
}