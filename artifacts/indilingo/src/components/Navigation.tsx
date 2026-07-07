import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, BookOpen, Trophy, User, LibraryBig } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const [location] = useLocation();

  // Don't show navigation on onboarding, language selection, or active lesson
  if (location === '/' || location === '/languages' || location.startsWith('/lesson/')) {
    return null;
  }

  const navItems = [
    { href: '/learn', icon: Home, label: 'Learn' },
    { href: '/review', icon: LibraryBig, label: 'Review' },
    { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r-2 border-border bg-card fixed top-0 left-0 h-full py-8 px-6 z-50">
        <div className="mb-12 px-2">
          <Link href="/learn" className="font-display font-black text-3xl text-primary tracking-tight flex items-center gap-2">
            <span className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center border-2 border-border shadow-playful-sm">IL</span>
            IndiLingo
          </Link>
        </div>
        
        <nav className="flex-1 flex flex-col gap-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 rounded-2xl font-bold font-display text-lg transition-all border-2",
                  isActive 
                    ? "bg-secondary/10 border-secondary text-secondary shadow-playful-sm" 
                    : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive ? "text-secondary" : "")} strokeWidth={2.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border pb-safe z-50 px-2 py-3 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all",
                isActive ? "text-secondary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "w-12 h-8 rounded-xl flex items-center justify-center transition-all",
                isActive ? "bg-secondary/15 border-2 border-secondary" : "border-2 border-transparent"
              )}>
                <Icon className="w-6 h-6" strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className="text-[10px] font-bold mt-1 tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
