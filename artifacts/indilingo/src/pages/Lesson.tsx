import React, { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useGetLesson, useCompleteLesson, getGetLessonQueryKey } from '@workspace/api-client-react';
import { useStore } from '@/store';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { useQueryClient } from '@tanstack/react-query';
import { ExercisePlayer } from '@/components/exercise-player';

export function Lesson() {
  const [, params] = useRoute('/lesson/:lessonId');
  const [, setLocation] = useLocation();
  const userId = useStore((state) => state.userId);
  const selectedLanguageId = useStore((state) => state.selectedLanguageId);
  const queryClient = useQueryClient();

  const lessonId = params?.lessonId ? parseInt(params.lessonId, 10) : 0;
  
  const { data: lesson, isLoading } = useGetLesson(lessonId, { 
    query: { enabled: !!lessonId, queryKey: getGetLessonQueryKey(lessonId) } 
  });
  
  const completeLesson = useCompleteLesson();

  const [isFinished, setIsFinished] = useState(false);
  const [completionResult, setCompletionResult] = useState<any>(null);
  const [finalCorrectCount, setFinalCorrectCount] = useState(0);

  const totalExercises = lesson?.exercises.length || 0;

  const handleComplete = (correctCount: number, totalCount: number) => {
    setFinalCorrectCount(correctCount);
    setIsFinished(true);
    completeLesson.mutate(
      { lessonId, data: { userId: userId!, correctCount } },
      {
        onSuccess: (res) => {
          setCompletionResult(res);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF1B6B', '#FF9E1B', '#45CAFF', '#00D16B']
          });
          queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
          queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'languages', selectedLanguageId, 'units'] });
        }
      }
    );
  };

  if (isLoading || !lesson) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-background text-2xl font-bold">Loading...</div>;
  }

  if (isFinished) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl font-black text-primary mb-8 animate-bounce">Lesson Complete!</h1>
        
        {completionResult ? (
          <div className="bg-card border-[3px] border-border shadow-playful rounded-3xl p-8 max-w-sm w-full space-y-6">
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map((star) => (
                <Star 
                  key={star} 
                  className={cn(
                    "w-12 h-12", 
                    star <= completionResult.stars ? "fill-accent text-accent animate-in zoom-in spin-in-12" : "fill-muted text-muted"
                  )} 
                  style={{ animationDelay: `${star * 150}ms` }}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 rounded-2xl p-4 border-2 border-primary/20">
                <div className="text-primary font-bold mb-1">XP Earned</div>
                <div className="text-3xl font-black text-primary">+{completionResult.xpEarned}</div>
              </div>
              <div className="bg-secondary/10 rounded-2xl p-4 border-2 border-secondary/20">
                <div className="text-secondary font-bold mb-1">Accuracy</div>
                <div className="text-3xl font-black text-secondary">
                  {Math.round((finalCorrectCount / totalExercises) * 100)}%
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setLocation('/learn')}
              className="w-full btn-playful bg-primary text-white py-4 mt-4 text-xl"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="animate-pulse flex gap-2">
            <div className="w-4 h-4 rounded-full bg-primary" />
            <div className="w-4 h-4 rounded-full bg-primary" />
            <div className="w-4 h-4 rounded-full bg-primary" />
          </div>
        )}
      </div>
    );
  }

  return (
    <ExercisePlayer 
      exercises={lesson.exercises} 
      lessonId={lessonId} 
      onComplete={handleComplete} 
      isReviewMode={false} 
    />
  );
}
