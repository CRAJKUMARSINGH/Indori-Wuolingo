import { useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Home, Map as MapIcon, Trophy, User, BarChart3, Flame, Star, Zap } from "lucide-react";
import { useGetUser, useCheckinUser, getGetUserQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const CURRENT_USER_ID = 1;

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const checkedIn = useRef(false);

  const { data: user, isLoading } = useGetUser(CURRENT_USER_ID, {
    query: { enabled: true, queryKey: getGetUserQueryKey(CURRENT_USER_ID) },
  });

  const { mutate: checkin } = useCheckinUser({
    mutation: {
      onSuccess: (result) => {
        queryClient.invalidateQueries({ queryKey: getGetUserQueryKey(CURRENT_USER_ID) });

        if (result.streakAction === "reset" && result.user.streak === 1) {
          toast({
            title: "Streak reset",
            description: "You missed a day — no worries, start again! Consistency builds fluency.",
          });
        } else if (result.streakAction === "continued" && result.milestoneReached) {
          const milestone = result.milestoneReached;
          const bonus = result.bonusXp;
          toast({
            title: milestone === 30
              ? `30-day streak — Ekdum Bindaas!`
              : `7-day streak — Kya Baat Hai!`,
            description: `You've kept it up for ${milestone} days straight. +${bonus} bonus XP awarded!`,
          });
        } else if (result.streakAction === "continued" && result.user.streak > 1) {
          toast({
            title: `Day ${result.user.streak} streak!`,
            description: `Ek dum regular — keep going!`,
          });
        }
      },
    },
  });

  useEffect(() => {
    if (checkedIn.current) return;
    checkedIn.current = true;
    checkin({ id: CURRENT_USER_ID });
  }, [checkin]);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/learn", icon: MapIcon, label: "Learn" },
    { href: "/leaderboard", icon: Trophy, label: "Rank" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/stats", icon: BarChart3, label: "Stats" },
  ];

  return (
    <div className="flex h-[100dvh] w-full bg-background text-foreground overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-xl">
            I
          </div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-primary">Wuolingo</h1>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className="block">
                <div
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all duration-200 border-2",
                    isActive
                      ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                      : "text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-lg">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          {isLoading ? (
            <Skeleton className="h-16 w-full rounded-2xl" />
          ) : user ? (
            <div className="flex items-center justify-between px-4 py-3 bg-muted rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-bold text-sm">{user.displayName || 'User'}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span>{user.xp || 0} XP</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-orange-500 font-bold">
                <Flame className="w-5 h-5 fill-current" />
                <span>{user.streak || 0}</span>
              </div>
            </div>
          ) : null}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-xl">
              I
            </div>
            <h1 className="font-display font-bold text-xl tracking-tight text-primary">Wuolingo</h1>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-yellow-600 font-bold">
                <Zap className="w-4 h-4" />
                <span className="text-sm">{user.xp || 0} XP</span>
              </div>
              <div className="flex items-center gap-1 text-orange-500 font-bold">
                <Flame className="w-5 h-5 fill-current" />
                <span>{user.streak || 0}</span>
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="max-w-4xl mx-auto w-full h-full p-4 md:p-8">
            {children}
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden absolute bottom-0 left-0 right-0 border-t border-border bg-card p-2 pb-safe flex items-center justify-around z-50">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className="block w-full">
                <div
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-bold">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
