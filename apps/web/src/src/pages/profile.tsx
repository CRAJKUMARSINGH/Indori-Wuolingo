import { useGetUser, useGetUserStats, getGetUserQueryKey, getGetUserStatsQueryKey } from '@workspace/api-client-react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Flame, Heart, Zap, Award, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
  const userId = useStore(state => state.userId);
  
  const { data: user, isLoading: isLoadingUser } = useGetUser(userId || '', { 
    query: { enabled: !!userId, queryKey: getGetUserQueryKey(userId || '') }
  });
  
  const { data: stats, isLoading: isLoadingStats } = useGetUserStats(userId || '', { 
    query: { enabled: !!userId, queryKey: getGetUserStatsQueryKey(userId || '') }
  });

  const isLoading = isLoadingUser || isLoadingStats;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!user || !stats) {
    return (
      <div className="text-center p-12">
        <p className="text-muted-foreground">Unable to load profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="p-8 border-border bg-white shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold font-serif">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">{user.name}</h1>
            <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
              Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 border-border shadow-sm">
          <Zap className="w-8 h-8 text-yellow-500 mb-2" />
          <h3 className="text-2xl font-bold font-mono">{user.xp}</h3>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total XP</p>
        </Card>
        
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 border-border shadow-sm">
          <Flame className={`w-8 h-8 mb-2 ${user.streak > 0 ? 'text-secondary' : 'text-muted-foreground'}`} />
          <h3 className="text-2xl font-bold font-mono">{user.streak}</h3>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Day Streak</p>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 border-border shadow-sm">
          <Heart className="w-8 h-8 text-destructive mb-2" />
          <h3 className="text-2xl font-bold font-mono">{user.hearts}</h3>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Hearts</p>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 border-border shadow-sm">
          <BookOpen className="w-8 h-8 text-primary mb-2" />
          <h3 className="text-2xl font-bold font-mono">{stats.totalLessonsCompleted}</h3>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Lessons</p>
        </Card>
      </div>

      {/* Language Progress */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold">Languages</h2>
        {stats.languageProgress.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground border-dashed border-2">
            You haven't started any languages yet. Visit the Home page to choose one!
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.languageProgress.map((lang, idx) => (
              <motion.div key={lang.languageId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className="p-5 border-border shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">{lang.languageName}</h3>
                    <span className="text-sm font-mono font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                      {lang.lessonsCompleted} / {lang.totalLessons}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${lang.totalLessons > 0 ? (lang.lessonsCompleted / lang.totalLessons) * 100 : 0}%` }}
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold">Achievements</h2>
        <Card className="p-6 border-border shadow-sm">
          {stats.badges.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Keep learning to earn your first badge!</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {stats.badges.map((badge, idx) => (
                <Badge key={idx} variant="secondary" className="px-4 py-2 text-sm font-medium bg-accent/10 text-accent hover:bg-accent/20 border-accent/20">
                  <Award className="w-4 h-4 mr-2" />
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
