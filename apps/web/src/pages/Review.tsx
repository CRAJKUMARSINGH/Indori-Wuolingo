import React, { useState } from 'react';
import { useLocation, Redirect } from 'wouter';
import { useGetReviewQueue, getGetReviewQueueQueryKey } from '@workspace/api-client-react';
import { useStore } from '@/store';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { useQueryClient } from '@tanstack/react-query';
import { ExercisePlayer } from '@/components/exercise-player';

export function Review() {
  const [, setLocation] = useLocation();
  const userId = useStore((state) => state.userId);
  const queryClient = useQueryClient();

  const { data: queue, isLoading } = useGetReviewQueue(userId!, {
    query: { enabled: !!userId, queryKey: getGetReviewQueueQueryKey(userId!) }
  });

  const [isFinished, setIsFinished] = useState(false);

  if (!userId) return <Redirect to="/" />;

  if (isLoading) {
    return <div className="p-8 text-xl font-bold animate-pulse text-center">Loading your review queue...</div>;
  }

  if (!queue || queue.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mb-6">
          <Check className="w-12 h-12" strokeWidth={4} />
        </div>
        <h1 className="text-3xl font-black mb-2">All caught up!</h1>
        <p className="text-muted-foreground text-lg mb-8">Nothing to review right now. Come back later!</p>
        <button 
          onClick={() => setLocation('/learn')}
          className="btn-playful bg-primary text-white px-8 py-3 text-lg"
        >
          Learn New Lessons
        </button>
      </div>
    );
  }

  const handleComplete = () => {
    setIsFinished(true);
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#00D16B', '#FF1B6B']
    });
  };

  if (isFinished) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black text-success mb-4">Review Session Complete!</h1>
        <p className="text-xl text-muted-foreground font-medium mb-8">Your memory is getting stronger.</p>
        <button 
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'review'] });
            setLocation('/learn');
          }}
          className="btn-playful bg-primary text-white px-10 py-4 text-xl"
        >
          Back to Path
        </button>
      </div>
    );
  }

  return (
    <ExercisePlayer 
      exercises={queue}
      onComplete={handleComplete}
      isReviewMode={true}
    />
  );
}
