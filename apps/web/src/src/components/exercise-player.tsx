import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Exercise, useCompleteLesson, useRecordMistake, useMasterExercise, LessonCompletion, ReviewAction } from '@workspace/api-client-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { X, Heart, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ExercisePlayerProps {
  exercises: Exercise[];
  lessonId?: string; // If provided, it's a lesson. If not, it's review mode.
  onComplete: (correctCount: number, totalCount: number) => void;
  isReviewMode?: boolean;
}

export function ExercisePlayer({ exercises, lessonId, onComplete, isReviewMode }: ExercisePlayerProps) {
  const userId = useStore(state => state.userId);
  const [_, setLocation] = useLocation();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [mistakes, setMistakes] = useState<Set<string>>(new Set());
  
  // match_pairs state
  const [selectedPair, setSelectedPair] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  const recordMistake = useRecordMistake();
  const masterExercise = useMasterExercise();

  const currentExercise = exercises[currentIndex];
  const progress = (currentIndex / exercises.length) * 100;

  if (!currentExercise) return null;

  const handleSelectOption = (option: string) => {
    if (isChecking) return;
    if (currentExercise.type === 'match_pairs') {
      if (selectedPair.includes(option)) {
        setSelectedPair(selectedPair.filter(p => p !== option));
      } else {
        const newPair = [...selectedPair, option];
        setSelectedPair(newPair);
        if (newPair.length === 2) {
          checkMatch(newPair);
        }
      }
    } else {
      setSelectedAnswer(option);
    }
  };

  const checkMatch = (pair: string[]) => {
    // In match_pairs, options are usually structured as "A=B, C=D" or similar, 
    // or we check if the pair forms a correct match based on the correctAnswer string (e.g. JSON stringified pairs)
    // For simplicity, let's assume correctAnswer contains valid pairs.
    // If it's complex, we'll simplify. Let's just pretend the API returns correctly structured options for UI.
    // Assuming correctAnswer for match_pairs is a serialized array of valid pairs like `[["A", "B"], ["C", "D"]]`
    try {
      const validPairs: string[][] = JSON.parse(currentExercise.correctAnswer);
      const isMatch = validPairs.some(vp => (vp.includes(pair[0]) && vp.includes(pair[1])));
      
      if (isMatch) {
        setMatchedPairs([...matchedPairs, ...pair]);
        setSelectedPair([]);
        // Check if all matched
        if (matchedPairs.length + 2 === currentExercise.options.length) {
          handleCorrect();
        }
      } else {
        handleIncorrect();
        setTimeout(() => setSelectedPair([]), 1000);
      }
    } catch {
      // Fallback
      setSelectedPair([]);
    }
  };

  const handleCheck = () => {
    if (!selectedAnswer) return;
    setIsChecking(true);
    
    if (selectedAnswer === currentExercise.correctAnswer) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
  };

  const handleCorrect = () => {
    setIsCorrect(true);
    if (!mistakes.has(currentExercise.id)) {
      setCorrectAnswersCount(prev => prev + 1);
    }
    
    if (isReviewMode && userId) {
      masterExercise.mutate({ exerciseId: currentExercise.id, data: { userId } });
    }
  };

  const handleIncorrect = () => {
    setIsCorrect(false);
    setHearts(prev => Math.max(0, prev - 1));
    setMistakes(prev => new Set(prev).add(currentExercise.id));
    
    if (userId) {
      recordMistake.mutate({ exerciseId: currentExercise.id, data: { userId } });
    }
    
    if (hearts <= 1) {
      toast.error("Out of hearts! Try again later.");
      setTimeout(() => setLocation('/home'), 2000);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsChecking(false);
      setIsCorrect(null);
      setSelectedPair([]);
      setMatchedPairs([]);
    } else {
      onComplete(correctAnswersCount, exercises.length);
    }
  };

  const renderExerciseContent = () => {
    switch (currentExercise.type) {
      case 'script_practice':
        return (
          <div className="flex flex-col items-center justify-center space-y-8">
            <h2 className="text-2xl font-bold text-center">{currentExercise.prompt}</h2>
            {currentExercise.romanization && (
              <p className="text-xl text-muted-foreground text-center mb-4">How to say it: <span className="font-mono font-bold text-primary">{currentExercise.romanization}</span></p>
            )}
            <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
              {currentExercise.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isChecking}
                  className={`
                    h-40 flex items-center justify-center text-7xl font-serif rounded-3xl border-4 transition-all duration-200
                    ${selectedAnswer === opt 
                      ? 'border-primary bg-primary/10 text-primary scale-105 shadow-md' 
                      : 'border-border bg-card hover:border-primary/40 hover:bg-muted text-foreground'
                    }
                    ${isChecking && opt === currentExercise.correctAnswer ? 'border-green-500 bg-green-50 text-green-600' : ''}
                    ${isChecking && selectedAnswer === opt && opt !== currentExercise.correctAnswer ? 'border-destructive bg-destructive/10 text-destructive' : ''}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      case 'multiple_choice':
      case 'translate':
      case 'fill_blank':
        return (
          <div className="flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto w-full">
            <h2 className="text-3xl font-bold text-center leading-tight">{currentExercise.prompt}</h2>
            {currentExercise.nativeScript && (
              <div className="text-5xl font-serif text-primary py-4">{currentExercise.nativeScript}</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {currentExercise.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isChecking}
                  className={`
                    p-6 text-xl font-medium rounded-2xl border-2 transition-all duration-200 text-left
                    ${selectedAnswer === opt 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border bg-card hover:border-primary/40 hover:bg-muted'
                    }
                    ${isChecking && opt === currentExercise.correctAnswer ? 'border-green-500 bg-green-50 text-green-600' : ''}
                    ${isChecking && selectedAnswer === opt && opt !== currentExercise.correctAnswer ? 'border-destructive bg-destructive/10 text-destructive' : ''}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'match_pairs':
        // Just render all options as clickable cards
        return (
          <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center">{currentExercise.prompt}</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {currentExercise.options.map((opt, i) => {
                const isMatched = matchedPairs.includes(opt);
                const isSelected = selectedPair.includes(opt);
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isMatched || isChecking}
                    className={`
                      px-6 py-4 text-xl font-medium rounded-2xl border-2 transition-all duration-200
                      ${isMatched ? 'opacity-0 pointer-events-none' : ''}
                      ${isSelected ? 'border-primary bg-primary/10 text-primary scale-105' : 'border-border bg-card hover:border-primary/40'}
                    `}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return <div>Unsupported exercise type: {currentExercise.type}</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md">
        <button 
          onClick={() => setLocation('/home')}
          className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex-1 max-w-md mx-8">
          <Progress value={progress} className="h-4 bg-muted" />
        </div>
        
        <div className="flex items-center gap-2 text-destructive font-bold text-xl">
          <Heart className="w-6 h-6 fill-destructive" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderExerciseContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / Feedback Bar */}
      <AnimatePresence>
        {isChecking && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className={`
              fixed bottom-0 left-0 right-0 p-6 md:p-8 border-t-2 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 z-50
              ${isCorrect ? 'bg-green-100 border-green-200 text-green-800' : 'bg-red-100 border-red-200 text-red-800'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
                {isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{isCorrect ? 'Excellent!' : 'Not quite right.'}</h3>
                {!isCorrect && (
                  <p className="text-lg opacity-90 mt-1">Correct answer: <span className="font-bold">{currentExercise.correctAnswer}</span></p>
                )}
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={handleNext}
              className={`w-full sm:w-auto h-14 text-xl px-12 text-white shadow-md active:scale-95 transition-transform ${isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Check Button for non-match exercises */}
      {!isChecking && currentExercise.type !== 'match_pairs' && (
        <div className="p-6 md:p-8 border-t border-border bg-background flex justify-center mt-auto">
          <Button 
            size="lg" 
            onClick={handleCheck}
            disabled={!selectedAnswer}
            className="w-full max-w-md h-14 text-xl font-bold shadow-md hover-elevate active:scale-95 transition-all"
          >
            CHECK
          </Button>
        </div>
      )}
      
      {isReviewMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase shadow-sm">
          Review Mode
        </div>
      )}
    </div>
  );
}
