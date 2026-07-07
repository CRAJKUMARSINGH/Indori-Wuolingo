import React from 'react';
import { Redirect } from 'wouter';
import { useGetUser, useGetUserStats, getGetUserQueryKey, getGetUserStatsQueryKey } from '@workspace/api-client-react';
import { useStore } from '@/store';
import { Flame, Star, Award, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function Profile() {
  const userId = useStore((state) => state.userId);

  const { data: user, isLoading: loadingUser } = useGetUser(userId!, { query: { enabled: !!userId, queryKey: getGetUserQueryKey(userId!) } });
  const { data: stats, isLoading: loadingStats } = useGetUserStats(userId!, { query: { enabled: !!userId, queryKey: getGetUserStatsQueryKey(userId!) } });

  if (!userId) return <Redirect to="/" />;

  if (loadingUser || loadingStats) {
    return <div className="p-8 text-xl font-bold animate-pulse text-center">Loading profile...</div>;
  }

  if (!user || !stats) return null;

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto space-y-10">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
        <div className="w-32 h-32 bg-primary text-white rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-playful border-[3px] border-border rotate-3">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 space-y-2">
          <h1 className="text-4xl font-black">{user.name}</h1>
          <p className="text-muted-foreground font-medium text-lg">
            Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-playful p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
            <Flame size={28} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{user.streak}</div>
            <div className="text-sm font-bold text-muted-foreground">Day Streak</div>
          </div>
        </div>
        <div className="card-playful p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
            <Star size={28} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{user.xp}</div>
            <div className="text-sm font-bold text-muted-foreground">Total XP</div>
          </div>
        </div>
      </div>

      {/* Language Progress */}
      <div>
        <h2 className="text-2xl font-black mb-6">Languages</h2>
        <div className="space-y-4">
          {stats.languageProgress.length === 0 ? (
            <div className="text-muted-foreground font-medium p-4 border-2 border-dashed rounded-2xl">
              No languages started yet.
            </div>
          ) : (
            stats.languageProgress.map((lang) => {
              const percentage = Math.round((lang.completedLessons / lang.totalLessons) * 100) || 0;
              return (
                <div key={lang.languageId} className="card-playful p-6 flex flex-col md:flex-row items-center gap-6">
                  <div className="text-6xl">{lang.flagEmoji}</div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{lang.languageName}</h3>
                        <div className="text-sm text-muted-foreground">{lang.nativeName}</div>
                      </div>
                      <div className="font-black text-primary">{percentage}%</div>
                    </div>
                    <div className="w-full h-4 bg-muted rounded-full overflow-hidden border-2 border-border/10">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="mt-2 text-sm font-bold text-muted-foreground text-right">
                      {lang.completedLessons} / {lang.totalLessons} lessons
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Achievements / Badges */}
      <div>
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
          <Award className="text-accent" /> Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.badges.map((badge) => (
            <div 
              key={badge.id} 
              className={cn(
                "p-6 rounded-3xl border-2 flex flex-col items-center text-center transition-all",
                badge.unlocked 
                  ? "bg-card border-border shadow-playful-sm" 
                  : "bg-muted/30 border-muted text-muted-foreground opacity-70 grayscale"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white border-4 border-white shadow-sm",
                badge.unlocked ? "bg-accent" : "bg-muted-foreground"
              )}>
                <Shield size={32} />
              </div>
              <h4 className="font-black text-lg mb-1">{badge.name}</h4>
              <p className="text-sm font-medium">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
