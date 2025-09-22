import { Header } from '@/components/layout/Header';
import { LoginForm } from '@/components/auth/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
        <LoginForm />
      </div>
    </div>
  );
}