import { useGetReviewExercises, getGetReviewExercisesQueryKey } from '@workspace/api-client-react';
import { useStore } from '@/lib/store';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { ExercisePlayer } from '@/components/exercise-player';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Review() {
  const userId = useStore(state => state.userId);
  const [_, setLocation] = useLocation();
  const [isDone, setIsDone] = useState(false);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);

  const { data: exercises, isLoading } = useGetReviewExercises(userId || '', { 
    query: { enabled: !!userId, queryKey: getGetReviewExercisesQueryKey(userId || '') }
  });

  const handleComplete = (correctCount: number, totalCount: number) => {
    setSessionCorrectCount(correctCount);
    setIsDone(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="space-y-4 text-center">
          <Skeleton className="w-24 h-24 rounded-full mx-auto" />
          <Skeleton className="h-8 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  if (isDone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 px-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-32 h-32 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"
        >
          <PartyPopper className="w-16 h-16" />
        </motion.div>
        <h1 className="text-4xl font-serif font-bold text-foreground">Review Complete!</h1>
        <p className="text-xl text-muted-foreground">You mastered {sessionCorrectCount} exercises. Great job solidifying your knowledge.</p>
        <Button size="lg" onClick={() => setLocation('/home')} className="mt-8 px-8 h-14 text-lg">
          Back to Home
        </Button>
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
          <Sparkles className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-foreground">You're all caught up!</h1>
        <p className="text-xl text-muted-foreground max-w-md">There are no exercises queued for review right now. Keep learning new lessons to build your queue.</p>
        <Button size="lg" onClick={() => setLocation('/learn')} className="mt-4 px-8 h-12">
          Learn New Lessons
        </Button>
      </div>
    );
  }

  return (
    <ExercisePlayer 
      exercises={exercises} 
      onComplete={handleComplete} 
      isReviewMode={true} 
    />
  );
}
