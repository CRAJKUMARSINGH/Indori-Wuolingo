import { Link, useLocation } from 'wouter';
import type { ReactNode } from 'react';

function TabIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? "var(--primary)" : "currentColor";
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  
  if (name === "learn") return (
    <svg {...common}><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /></svg>
  );
  if (name === "review") return (
    <svg {...common}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>
  );
  if (name === "ranks") return (
    <svg {...common}><rect x="3" y="13" width="4" height="8" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="4" width="4" height="17" rx="1" /></svg>
  );
  
  return (
    <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
  );
}

function Tab({ to, name, label }: { to: string; name: string; label: string }) {
  const [pathname] = useLocation();
  const active = pathname === to || (to !== "/" && pathname.startsWith(to));
  
  return (
    <Link to={to} className={`flex flex-col items-center gap-1.5 ${active ? "text-primary" : "text-muted-foreground"}`}>
      <TabIcon name={name} active={active} />
      <span className="text-[10px] font-semibold uppercase tracking-tighter">{label}</span>
    </Link>
  );
}

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className={`max-w-[430px] mx-auto ${hideNav ? "pb-8" : "pb-28"}`}>{children}</main>
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border pb-6 pt-3">
          <div className="max-w-[430px] mx-auto px-8 flex justify-between items-center">
            <Tab to="/learn" name="learn" label="Learn" />
            <Tab to="/review" name="review" label="Review" />
            <Tab to="/leaderboard" name="ranks" label="Ranks" />
            <Tab to="/profile" name="profile" label="Profile" />
          </div>
        </nav>
      )}
    </div>
  );
}
