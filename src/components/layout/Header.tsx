import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, BookOpen, Calendar, FileText, ClipboardList, Bell, Users } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = false; // This will come from auth context later

  const navItems = [
    { path: '/timetable', label: 'Timetable', icon: Calendar },
    { path: '/notes', label: 'Notes', icon: FileText },
    { path: '/assignments', label: 'Assignments', icon: ClipboardList },
    { path: '/reminders', label: 'Reminders', icon: Bell },
    { path: '/projects', label: 'Projects', icon: Users },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="hidden font-bold text-xl bg-gradient-hero bg-clip-text text-transparent sm:inline-block">
            Study Share
          </span>
        </Link>

        {/* Desktop Navigation */}
        {isAuthenticated && (
          <nav className="hidden md:flex mx-6 flex-1 items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActivePath(item.path) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="gradient" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                Profile
              </Button>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="inline-flex items-center justify-center rounded-md md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && isAuthenticated && (
        <nav className="md:hidden border-t">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                    isActivePath(item.path) ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}