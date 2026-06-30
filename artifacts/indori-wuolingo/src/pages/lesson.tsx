import { useParams, useLocation } from "wouter";
import { useState as useReactState, useEffect as useReactEffect, useRef as useReactRef } from "react";
import { useGetLesson, useSubmitAnswer, useUpdateProgress, getGetLessonQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Check, XCircle, Heart, Star, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Lesson() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const lessonId = parseInt(id || "0", 10);
  
  const { data: lesson, isLoading } = useGetLesson(lessonId, { 
    query: { enabled: !!lessonId, queryKey: getGetLessonQueryKey(lessonId) } 
  });
  
  const submitAnswer = useSubmitAnswer();
  const updateProgress = useUpdateProgress();
  
  const [exerciseIndex, setExerciseIndex] = useReactState(0);
  const [selectedAnswer, setSelectedAnswer] = useReactState<string | null>(null);
  const [feedback, setFeedback] = useReactState<{correct: boolean, explanation: string, xpEarned: number} | null>(null);
  const [lessonComplete, setLessonComplete] = useReactState(false);
  const [totalXpEarned, setTotalXpEarned] = useReactState(0);
  
  const exercise = lesson?.exercises?.[exerciseIndex];
  const progressPercent = lesson?.exercises ? (exerciseIndex / lesson.exercises.length) * 100 : 0;

  const handleCheck = async () => {
    if (!exercise || !selectedAnswer || feedback) return;
    
    try {
      const result = await submitAnswer.mutateAsync({
        id: exercise.id,
        data: { answer: selectedAnswer, userId: 1 }
      });
      
      setFeedback({
        correct: result.correct,
        explanation: result.explanation,
        xpEarned: result.xpEarned
      });
      
      if (result.correct) {
        setTotalXpEarned(prev => prev + result.xpEarned);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = async () => {
    if (!lesson) return;
    
    if (exerciseIndex < lesson.exercises.length - 1) {
      setExerciseIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      // Complete lesson
      try {
        await updateProgress.mutateAsync({
          data: {
            userId: 1,
            lessonId,
            completed: true,
            xpEarned: totalXpEarned + lesson.xpReward
          }
        });
        setLessonComplete(true);
      } catch (err) {
        console.error(err);
        setLessonComplete(true); // show anyway for prototype
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col p-4">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 flex-1 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <Skeleton className="h-32 w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (lessonComplete) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background p-4 animate-in fade-in duration-500">
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto w-full">
          <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
            <Star className="w-16 h-16 text-primary-foreground fill-current" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold text-primary">Ek Number!</h1>
            <p className="text-xl text-muted-foreground font-medium">Lesson Completed</p>
          </div>
          
          <div className="flex gap-4 w-full pt-4">
            <div className="flex-1 bg-yellow-100 border-2 border-yellow-200 rounded-2xl p-4 flex flex-col items-center">
              <span className="text-sm font-bold text-yellow-600 mb-1">TOTAL XP</span>
              <span className="font-display text-2xl font-bold text-yellow-600">+{totalXpEarned + (lesson?.xpReward || 0)}</span>
            </div>
            <div className="flex-1 bg-green-100 border-2 border-green-200 rounded-2xl p-4 flex flex-col items-center">
              <span className="text-sm font-bold text-green-600 mb-1">ACCURACY</span>
              <span className="font-display text-2xl font-bold text-green-600">
                {Math.round((totalXpEarned / ((lesson?.exercises?.length || 1) * 10)) * 100)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="pt-6 pb-8 border-t border-border mt-auto max-w-md mx-auto w-full">
          <Button 
            className="w-full h-14 text-lg font-bold rounded-2xl border-b-4 bg-primary hover:bg-primary/90"
            onClick={() => setLocation("/learn")}
          >
            CONTINUE
          </Button>
        </div>
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="p-4 flex items-center gap-4 max-w-2xl mx-auto w-full">
        <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground" onClick={() => setLocation("/learn")}>
          <X className="w-6 h-6" />
        </Button>
        <Progress value={progressPercent} className="flex-1 h-4 bg-muted" />
        <div className="flex items-center gap-1 text-red-500 font-bold shrink-0">
          <Heart className="w-6 h-6 fill-current" />
          <span>5</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        <div className="animate-in slide-in-from-right-8 duration-300">
          <h2 className="text-2xl font-display font-bold mb-8 text-foreground">
            {exercise.type === 'translate' ? 'Translate this sentence' : 
             exercise.type === 'multiple_choice' ? 'Select the correct meaning' : 
             'Complete the phrase'}
          </h2>
          
          <div className="mb-8">
            <div className="inline-block bg-muted/50 p-4 rounded-2xl border-2 border-border">
              <p className="text-lg font-medium">{exercise.question}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exercise.options.map((option, i) => (
              <button
                key={i}
                disabled={!!feedback}
                onClick={() => setSelectedAnswer(option)}
                className={cn(
                  "p-4 text-left rounded-2xl border-2 border-b-4 transition-all duration-200 font-medium text-lg",
                  selectedAnswer === option 
                    ? "border-primary bg-primary/10 text-primary border-b-primary"
                    : "border-border bg-card hover:bg-muted text-foreground"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </main>

      <div className={cn(
        "border-t-2 p-4 pb-safe transition-colors duration-300",
        feedback 
          ? feedback.correct 
            ? "bg-green-100 border-green-200" 
            : "bg-red-100 border-red-200"
          : "bg-card border-border"
      )}>
        <div className="max-w-2xl mx-auto">
          {feedback && (
            <div className={cn(
              "mb-4 flex gap-4",
              feedback.correct ? "text-green-700" : "text-red-700"
            )}>
              <div className="mt-1">
                {feedback.correct ? (
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-700" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-700" strokeWidth={3} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 font-display">
                  {feedback.correct ? "Sahi Jawab!" : "Galat Bhiya!"}
                </h3>
                <p className="font-medium opacity-90">{feedback.explanation}</p>
                {feedback.correct && (
                  <p className="text-sm font-bold mt-2 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" /> +{feedback.xpEarned} XP
                  </p>
                )}
              </div>
            </div>
          )}
          
          <Button 
            className={cn(
              "w-full h-14 text-lg font-bold rounded-2xl border-b-4 transition-all",
              !selectedAnswer ? "bg-muted text-muted-foreground border-muted-border opacity-50 cursor-not-allowed hover:bg-muted" : "",
              selectedAnswer && !feedback ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary-border" : "",
              feedback?.correct ? "bg-green-600 hover:bg-green-700 text-white border-green-700" : "",
              feedback && !feedback.correct ? "bg-red-600 hover:bg-red-700 text-white border-red-700" : ""
            )}
            onClick={feedback ? handleNext : handleCheck}
            disabled={!selectedAnswer || submitAnswer.isPending}
          >
            {feedback ? "CONTINUE" : "CHECK"}
          </Button>
        </div>
      </div>
    </div>
  );
}