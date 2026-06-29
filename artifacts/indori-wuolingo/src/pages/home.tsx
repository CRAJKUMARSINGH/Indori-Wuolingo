import { useGetStatsOverview, useListProgress, useGetLeaderboard, useGetUser, getGetStatsOverviewQueryKey, getListProgressQueryKey, getGetLeaderboardQueryKey, getGetUserQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Flame, Trophy, Play, Star, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: user, isLoading: userLoading } = useGetUser(1, { query: { enabled: true, queryKey: getGetUserQueryKey(1) } });
  const { data: progress, isLoading: progressLoading } = useListProgress({ userId: 1 }, { query: { enabled: true, queryKey: getListProgressQueryKey({ userId: 1 }) } });
  const { data: stats, isLoading: statsLoading } = useGetStatsOverview({ query: { enabled: true, queryKey: getGetStatsOverviewQueryKey() } });
  const { data: leaderboard, isLoading: lbLoading } = useGetLeaderboard({ query: { enabled: true, queryKey: getGetLeaderboardQueryKey() } });

  const isLoading = userLoading || progressLoading || statsLoading || lbLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  const completedCount = (progress && Array.isArray(progress) ? progress.filter(p => p.completed).length : 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-display font-bold text-foreground">
          Ram Ram, {user?.displayName?.split(' ')[0] || 'Bhai'}! 👋
        </h1>
        <p className="text-lg text-muted-foreground font-medium">Ready to learn some proper Indori today?</p>
      </header>

      {/* Hero CTA */}
      <Card className="bg-primary border-primary-border shadow-md overflow-hidden relative border-2 border-b-4">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-32 h-32 text-primary-foreground" />
        </div>
        <CardContent className="p-6 sm:p-8 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-primary-foreground">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-primary-foreground/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>Unit 1, Lesson {completedCount + 1}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold">Bhiya, continue your lesson!</h2>
            <p className="text-primary-foreground/80 font-medium">Learn how to order Poha Jalebi like a local.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/learn" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 rounded-xl font-bold text-lg shadow-sm border-2 border-b-4 border-transparent hover:-translate-y-1 transition-transform">
                <Play className="w-5 h-5 mr-2 fill-current" /> Let's go!
              </Button>
            </Link>
            <Link href="/onboarding/welcome" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-xl border-white/30 bg-transparent font-bold text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                Revisit onboarding
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Streak & Stats */}
        <div className="space-y-6">
          <h3 className="font-display text-xl font-bold flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" /> Your Progress
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-2 shadow-sm rounded-2xl hover-elevate">
              <CardContent className="p-5 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{user?.streak}</p>
                  <p className="text-sm font-medium text-muted-foreground">Day Streak</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 shadow-sm rounded-2xl hover-elevate">
              <CardContent className="p-5 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary fill-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{user?.xp}</p>
                  <p className="text-sm font-medium text-muted-foreground">Total XP</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 shadow-sm rounded-2xl">
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-bold text-foreground">Completed Lessons</p>
                  <p className="text-sm text-muted-foreground">Keep it up, ek number!</p>
                </div>
                <div className="text-2xl font-display font-bold text-primary">{completedCount}</div>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min((completedCount / 10) * 100, 100)}%` }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mini Leaderboard & Platform Stats */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Top Indoris
            </h3>
            <Link href="/leaderboard">
              <Button variant="ghost" size="sm" className="font-bold text-primary">View All</Button>
            </Link>
          </div>
          
          <Card className="border-2 shadow-sm rounded-2xl">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {leaderboard?.slice(0, 3).map((entry, i) => (
                  <div key={entry.userId} className="p-4 flex items-center gap-4">
                    <div className="w-8 font-display font-bold text-center text-muted-foreground">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {entry.displayName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{entry.displayName}</p>
                      <p className="text-xs font-medium text-muted-foreground">{entry.xp} XP</p>
                    </div>
                    {entry.userId === 1 && (
                      <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">You</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 text-xs font-medium text-muted-foreground justify-center">
            <span>{stats?.totalUsers} learners</span>
            <span>•</span>
            <span>{stats?.totalCompletions} lessons finished</span>
          </div>
        </div>
      </div>
    </div>
  );
}
