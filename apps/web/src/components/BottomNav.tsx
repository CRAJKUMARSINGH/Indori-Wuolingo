import { Link, useLocation } from 'wouter';
import { BookOpen, Trophy, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function BottomNav() {
  const [location] = useLocation();

  const tabs = [
    { name: 'Learn', path: '/learn', icon: BookOpen },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t-2 border-border bg-card pb-safe z-50">
      <div className="flex h-[72px] max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = location.startsWith(tab.path);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.path}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />
              )}
              <Icon className={cn("w-7 h-7 mb-0.5 transition-all", isActive && "fill-primary/20 scale-110")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-bold uppercase tracking-wider">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
