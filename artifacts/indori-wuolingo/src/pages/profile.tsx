import { useGetUser, useListProgress, getGetUserQueryKey, getListProgressQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Flame, Trophy, Calendar, MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Profile() {
  const { data: user, isLoading: userLoading } = useGetUser(1, { query: { enabled: true, queryKey: getGetUserQueryKey(1) } });
  const { data: progress, isLoading: progressLoading } = useListProgress({ userId: 1 }, { query: { enabled: true, queryKey: getListProgressQueryKey({ userId: 1 }) } });

  const isLoading = userLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    );
  }

  const completedLessons = progress?.filter(p => p.completed).length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      {/* Profile Header */}
      <Card className="border-2 shadow-sm rounded-2xl overflow-hidden relative">
        <div className="h-24 bg-primary/10 w-full absolute top-0 left-0" />
        <CardContent className="p-6 pt-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-4xl border-4 border-card shadow-md">
              {user?.displayName.charAt(0)}
            </div>
            <div className="flex-1 pb-1">
              <h1 className="text-3xl font-display font-bold text-foreground">{user?.displayName}</h1>
              <p className="text-muted-foreground font-medium">@{user?.username}</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium pb-2">
              <Calendar className="w-4 h-4" />
              Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-display font-bold mb-4 px-1 text-foreground">Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-2 shadow-sm rounded-2xl">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-orange-500">
                <Flame className="w-5 h-5 fill-current" />
                <span className="font-bold text-sm">Streak</span>
              </div>
              <p className="text-2xl font-bold">{user?.streak}</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 shadow-sm rounded-2xl">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold text-sm">Total XP</span>
              </div>
              <p className="text-2xl font-bold">{user?.xp}</p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm rounded-2xl">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-blue-500">
                <MapIcon className="w-5 h-5 fill-current" />
                <span className="font-bold text-sm">Lessons</span>
              </div>
              <p className="text-2xl font-bold">{completedLessons}</p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm rounded-2xl">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-5 h-5 fill-current" />
                <span className="font-bold text-sm">League</span>
              </div>
              <p className="text-lg font-bold">Indori Pro</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements / Badges placeholder */}
      <div>
        <h2 className="text-xl font-display font-bold mb-4 px-1 text-foreground">Achievements</h2>
        <Card className="border-2 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 text-center">
              <div className="space-y-2 opacity-100">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-2xl border-2 border-orange-200 flex items-center justify-center">
                  <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
                </div>
                <p className="font-bold text-sm leading-tight">3 Day Streak</p>
              </div>
              
              <div className="space-y-2 opacity-50 grayscale">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl border-2 border-blue-200 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="font-bold text-sm leading-tight">Sharpshooter</p>
              </div>

              <div className="space-y-2 opacity-50 grayscale">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-2xl border-2 border-purple-200 flex items-center justify-center">
                  <span className="text-2xl">👑</span>
                </div>
                <p className="font-bold text-sm leading-tight">First Place</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-display font-bold mb-4 px-1 text-foreground">Preferences</h2>
        <Card className="border-2 shadow-sm rounded-2xl">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-foreground">Onboarding setup</p>
              <p className="text-sm text-muted-foreground">
                Update your learner name, language choice, daily goal, and proficiency for the web app.
              </p>
            </div>
            <Link href="/onboarding/welcome">
              <Button className="rounded-xl font-bold">Open onboarding</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
