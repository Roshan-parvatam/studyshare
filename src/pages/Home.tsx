import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/landing/Hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
    </div>
  );
}