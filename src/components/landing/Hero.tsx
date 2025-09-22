import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Calendar, FileText } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Smart Timetable',
      description: 'Organize your schedule efficiently',
    },
    {
      icon: FileText,
      title: 'Note Sharing',
      description: 'Share and collaborate on study materials',
    },
    {
      icon: Users,
      title: 'Group Projects',
      description: 'Coordinate with your team seamlessly',
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      <div className="container relative px-4 py-24 md:px-6 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full bg-secondary px-4 py-2">
            <BookOpen className="mr-2 h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Welcome to Study Share</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your Academic
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              Collaboration Hub
            </span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Streamline your studies, share knowledge, and succeed together. 
            The all-in-one platform designed for student success.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate('/signup')}
              className="group"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/features')}
            >
              Explore Features
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-xl border bg-card p-6 shadow-md transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}