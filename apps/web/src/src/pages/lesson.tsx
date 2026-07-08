import { useGetLesson, useCompleteLesson, getGetUserQueryKey, getGetUserStatsQueryKey, getListUnitsForLanguageQueryKey, getGetLessonQueryKey } from '@workspace/api-client-react';
import { useLocation, useParams } from 'wouter';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { ExercisePlayer } from '@/components/exercise-player';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const userId = useStore(state => state.userId);
  const selectedLanguageId = useStore(state => state.selectedLanguageId);
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [result, setResult] = useState<{ xpEarned: number; stars: number } | null>(null);

  const { data: lesson, isLoading } = useGetLesson(lessonId || '', { 
    query: { enabled: !!lessonId, queryKey: getGetLessonQueryKey(lessonId || '') }
  });

  const completeLesson = useCompleteLesson();

  const handleComplete = (correctCount: number, totalCount: number) => {
    if (!userId || !lessonId) return;

    completeLesson.mutate(
      { 
        lessonId, 
        data: { userId, correctCount, totalCount } 
      },
      {
        onSuccess: (data) => {
          setResult({ xpEarned: data.xpEarned, stars: data.stars });
          
          // Invalidate caches to refresh stats and map
          queryClient.invalidateQueries({ queryKey: getGetUserQueryKey(userId) });
          queryClient.invalidateQueries({ queryKey: getGetUserStatsQueryKey(userId) });
          if (selectedLanguageId) {
             queryClient.invalidateQueries({ queryKey: getListUnitsForLanguageQueryKey(selectedLanguageId, userId) });
          }
        },
        onError: () => {
          toast.error("Failed to save progress. Please check your connection.");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="space-y-4 text-center">
          <Skeleton className="w-20 h-20 rounded-full mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (!lesson || !lesson.exercises || lesson.exercises.length === 0) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center text-center p-4 z-50">
        <h1 className="text-2xl font-bold mb-4">Lesson Unavailable</h1>
        <p className="text-muted-foreground mb-8">This lesson has no exercises yet.</p>
        <Button onClick={() => setLocation('/learn')}>Go Back</Button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-4 z-50 overflow-hidden">
        {/* Confetti or decorative bg here */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.6 }}
          className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md w-full"
        >
          <h1 className="text-5xl font-serif font-bold text-foreground">Lesson Complete!</h1>
          
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, rotate: -30 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.3 + (i * 0.2), type: "spring" }}
              >
                <Star className={`w-16 h-16 ${i < result.stars ? 'fill-yellow-400 text-yellow-500 drop-shadow-md' : 'fill-muted text-muted-foreground/30'}`} />
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-card border-2 border-border rounded-2xl p-6 w-full flex items-center justify-between shadow-lg"
          >
            <div className="text-left">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total XP</p>
              <p className="text-4xl font-mono font-bold text-primary">+{result.xpEarned}</p>
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="w-full pt-8"
          >
            <Button 
              size="lg" 
              onClick={() => setLocation('/learn')}
              className="w-full h-14 text-xl font-bold shadow-md hover-elevate active:scale-95"
            >
              CONTINUE
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return <ExercisePlayer exercises={lesson.exercises} lessonId={lesson.id} onComplete={handleComplete} />;
}
