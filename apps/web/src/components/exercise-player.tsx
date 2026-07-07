import { useState } from 'react';
import { useLocation } from 'wouter';
import { Exercise, useRecordMistake, useMasterExercise } from '@workspace/api-client-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, Heart, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExercisePlayerProps {
  exercises: Exercise[];
  lessonId?: string;
  onComplete: (correctCount: number, totalCount: number) => void;
  isReviewMode?: boolean;
}

/** Stable MatchPair shape — mirrors packages/curriculum/src/types.ts */
interface MatchPair {
  id: string;
  left: string;
  right: string;
}

/**
 * Parse pairs from the stable {id, left, right} JSON contract.
 * Falls back to the legacy [[left, right]] tuple format for old data.
 */
function parseMatchPairs(exercise: Exercise): MatchPair[] {
  try {
    const parsed = JSON.parse(exercise.correctAnswer);
    // New contract: [{id, left, right}, ...]
    if (
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      typeof parsed[0] === 'object' &&
      'left' in parsed[0] &&
      'right' in parsed[0]
    ) {
      return parsed as MatchPair[];
    }
    // Legacy contract: [[left, right], ...]
    if (Array.isArray(parsed) && parsed.every((p) => Array.isArray(p) && p.length === 2)) {
      return (parsed as string[][]).map(([l, r], i) => ({ id: String(i), left: l, right: r }));
    }
  } catch {
    /* fall through to options-based fallback */
  }

  // Last resort: split options array in half
  const half = Math.floor(exercise.options.length / 2);
  const left = exercise.options.slice(0, half);
  const right = exercise.options.slice(half);
  return left.map((l, i) => ({ id: String(i), left: l, right: right[i] ?? '' }));
}

export function ExercisePlayer({ exercises, onComplete, isReviewMode }: ExercisePlayerProps) {
  const userId = useStore((state) => state.userId);
  const [_, setLocation] = useLocation();

  const [currentIndex, setCurrentIndex] = useState(0);
  // Soft hearts: display + deduct on wrong answers, but no fail-at-zero (infinite retries).
  // strictHearts can be wired later when hearts are persisted on the user profile.
  const [hearts, setHearts] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [mistakes, setMistakes] = useState<Set<number>>(new Set());

  const [selectedPairId, setSelectedPairId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [matchSide, setMatchSide] = useState<'left' | 'right' | null>(null);

  const recordMistake = useRecordMistake();
  const masterExercise = useMasterExercise();

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex + (isChecking && isCorrect ? 1 : 0)) / exercises.length) * 100 : 0;

  if (!currentExercise) return null;

  const registerCorrect = () => {
    setIsCorrect(true);
    if (!mistakes.has(currentExercise.id)) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
    if (isReviewMode && userId) {
      masterExercise.mutate({ exerciseId: currentExercise.id, data: { userId } });
    }
  };

  const registerIncorrect = () => {
    setIsCorrect(false);
    if (!isReviewMode) {
      setHearts((prev) => Math.max(0, prev - 1));
    }
    setMistakes((prev) => new Set(prev).add(currentExercise.id));
    if (userId) {
      recordMistake.mutate({ exerciseId: currentExercise.id, data: { userId } });
    }
  };

  const handleSelectOption = (option: string) => {
    if (isChecking) return;
    setSelectedAnswer(option);
  };

  const handleSelectMatchItem = (pairId: string, side: 'left' | 'right') => {
    if (isChecking || matchedIds.has(pairId)) return;

    if (selectedPairId === null) {
      setSelectedPairId(pairId);
      setMatchSide(side);
      return;
    }

    // Tapped the same side — swap selection
    if (matchSide === side) {
      setSelectedPairId(pairId);
      setMatchSide(side);
      return;
    }

    // Tapped the opposite side — check if it's a valid pair
    const isMatch = selectedPairId === pairId;

    if (isMatch) {
      const next = new Set(matchedIds).add(pairId);
      setMatchedIds(next);
      setSelectedPairId(null);
      setMatchSide(null);

      const pairs = parseMatchPairs(currentExercise);
      if (next.size === pairs.length) {
        setIsChecking(true);
        registerCorrect();
      }
    } else {
      registerIncorrect();
      setSelectedPairId(null);
      setMatchSide(null);
    }
  };

  const handleCheck = () => {
    if (!selectedAnswer) return;
    setIsChecking(true);

    if (selectedAnswer === currentExercise.correctAnswer) {
      registerCorrect();
    } else {
      registerIncorrect();
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsChecking(false);
      setIsCorrect(null);
      setSelectedPairId(null);
      setMatchedIds(new Set());
      setMatchSide(null);
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
            {currentExercise.nativeScript && (
              <div className="text-8xl font-serif text-primary py-4">{currentExercise.nativeScript}</div>
            )}
            <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
              {currentExercise.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isChecking}
                  className={cn(
                    'h-24 flex items-center justify-center text-2xl font-mono font-bold rounded-3xl border-4 transition-all duration-200',
                    selectedAnswer === opt
                      ? 'border-primary bg-primary/10 text-primary scale-105 shadow-md'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-muted text-foreground',
                    isChecking && opt === currentExercise.correctAnswer && 'border-green-500 bg-green-50 text-green-600',
                    isChecking &&
                      selectedAnswer === opt &&
                      opt !== currentExercise.correctAnswer &&
                      'border-destructive bg-destructive/10 text-destructive',
                  )}
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
            {currentExercise.type === 'fill_blank' && (
              <Badge variant="secondary" className="text-sm uppercase tracking-wider">
                Fill the blank
              </Badge>
            )}
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
                  className={cn(
                    'p-6 text-xl font-medium rounded-2xl border-2 transition-all duration-200 text-left',
                    selectedAnswer === opt
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-muted',
                    isChecking && opt === currentExercise.correctAnswer && 'border-green-500 bg-green-50 text-green-600',
                    isChecking &&
                      selectedAnswer === opt &&
                      opt !== currentExercise.correctAnswer &&
                      'border-destructive bg-destructive/10 text-destructive',
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      case 'match_pairs': {
        const pairs = parseMatchPairs(currentExercise);
        // Right column is sorted alphabetically so it doesn't give away order
        const rightOptions = [...pairs].sort((a, b) => a.right.localeCompare(b.right));
        return (
          <section className="mx-auto w-full max-w-3xl">
            <div className="mb-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
              Match it
            </div>
            <h2 className="mb-6 text-center text-2xl font-bold">{currentExercise.prompt}</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Left column — fixed order */}
              <div className="space-y-3">
                {pairs.map((pair) => {
                  const isMatched = matchedIds.has(pair.id);
                  const isSelected = selectedPairId === pair.id && matchSide === 'left';
                  return (
                    <button
                      key={pair.id}
                      disabled={isMatched || isChecking}
                      onClick={() => handleSelectMatchItem(pair.id, 'left')}
                      className={cn(
                        'h-16 w-full rounded-lg border-2 px-4 text-left text-lg font-semibold transition-all',
                        isSelected && 'border-emerald-600 bg-emerald-50 scale-105',
                        isMatched && 'opacity-30 pointer-events-none',
                        !isSelected && !isMatched && 'border-border bg-card hover:border-primary/40',
                      )}
                    >
                      {pair.left}
                    </button>
                  );
                })}
              </div>
              {/* Right column — shuffled */}
              <div className="space-y-3">
                {rightOptions.map((pair) => {
                  const isMatched = matchedIds.has(pair.id);
                  const isSelected = selectedPairId === pair.id && matchSide === 'right';
                  return (
                    <button
                      key={pair.id}
                      disabled={isMatched || isChecking}
                      onClick={() => handleSelectMatchItem(pair.id, 'right')}
                      className={cn(
                        'h-16 w-full rounded-lg border-2 px-4 text-left text-lg font-semibold transition-all',
                        isSelected && 'border-emerald-600 bg-emerald-50 scale-105',
                        isMatched && 'opacity-30 pointer-events-none',
                        !isSelected && !isMatched && 'border-border bg-card hover:border-primary/40',
                      )}
                    >
                      {pair.right}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      default:
        return <div>Unsupported exercise type: {currentExercise.type}</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50 overflow-hidden">
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

        {!isReviewMode && (
          <div className="flex items-center gap-2 text-destructive font-bold text-xl">
            <Heart className="w-6 h-6 fill-destructive" />
            <span>{hearts}</span>
          </div>
        )}
        {isReviewMode && <div className="w-16" />}
      </header>

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

      <AnimatePresence>
        {isChecking && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className={cn(
              'fixed bottom-0 left-0 right-0 p-6 md:p-8 border-t-2 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 z-50',
              isCorrect ? 'bg-green-100 border-green-200 text-green-800' : 'bg-red-100 border-red-200 text-red-800',
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn('p-2 rounded-full', isCorrect ? 'bg-green-200' : 'bg-red-200')}>
                {isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{isCorrect ? 'Excellent!' : 'Not quite right.'}</h3>
                {!isCorrect && currentExercise.type !== 'match_pairs' && (
                  <p className="text-lg opacity-90 mt-1">
                    Correct answer: <span className="font-bold">{currentExercise.correctAnswer}</span>
                  </p>
                )}
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleNext}
              className={cn(
                'w-full sm:w-auto h-14 text-xl px-12 text-white shadow-md active:scale-95 transition-transform',
                isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700',
              )}
            >
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

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
