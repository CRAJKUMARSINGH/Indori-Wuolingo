import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useStore, store } from '@/store';
import { getLessonById } from '@/data/curriculum';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) { return twMerge(clsx(inputs)); }

interface MatchedPair { left: string; right: string }

export default function LessonPlayer() {
  const [, setLocation] = useLocation();
  const { lessonId } = useParams();
  const state = useStore();
  const languageId = state.selectedLanguageId;
  const lesson = languageId && lessonId ? getLessonById(languageId, lessonId) : null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{correct: boolean}[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime] = useState(Date.now());

  // MULTIPLE_CHOICE state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // WORD_ORDER state
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [poolWords, setPoolWords] = useState<string[]>([]);

  // FILL_BLANK state
  const [fillInput, setFillInput] = useState('');

  // MATCH_PAIRS state
  const [matchedPairs, setMatchedPairs] = useState<MatchedPair[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [shakeRight, setShakeRight] = useState<string | null>(null);

  if (!lesson || !languageId) {
    return <div className="p-8 text-center text-muted-foreground">Lesson not found.</div>;
  }

  const exercise = lesson.exercises[currentIndex];
  const isMultipleChoice = exercise?.type === 'MULTIPLE_CHOICE';
  const isWordOrder = exercise?.type === 'WORD_ORDER';
  const isFillBlank = exercise?.type === 'FILL_BLANK';
  const isMatchPairs = exercise?.type === 'MATCH_PAIRS';

  useEffect(() => {
    if (isWordOrder) {
      setPoolWords([...(exercise.words ?? [])].sort(() => Math.random() - 0.5));
      setPlacedWords([]);
    }
    if (isMatchPairs) {
      setMatchedPairs([]);
      setSelectedLeft(null);
      setShakeRight(null);
    }
    setSelectedAnswer(null);
    setFillInput('');
    setShowFeedback(false);
  }, [currentIndex]);

  const isCorrect = answers[currentIndex]?.correct;

  // MATCH_PAIRS inline logic
  const pairs = exercise?.pairs ?? [];
  const matchedLefts = matchedPairs.map(p => p.left);
  const matchedRights = matchedPairs.map(p => p.right);
  const allPairsMatched = pairs.length > 0 && matchedPairs.length === pairs.length;

  const handleLeftClick = (left: string) => {
    if (showFeedback || matchedLefts.includes(left)) return;
    setSelectedLeft(left);
  };

  const handleRightClick = (right: string) => {
    if (showFeedback || !selectedLeft || matchedRights.includes(right)) return;
    const correctPair = pairs.find(p => p.left === selectedLeft);
    if (correctPair?.right === right) {
      setMatchedPairs(prev => [...prev, { left: selectedLeft, right }]);
      setSelectedLeft(null);
    } else {
      setShakeRight(right);
      setTimeout(() => { setShakeRight(null); setSelectedLeft(null); }, 600);
    }
  };

  const handleCheck = () => {
    if (showFeedback) {
      if (currentIndex < lesson.exercises.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        const correctCount = answers.filter(a => a.correct).length;
        const total = lesson.exercises.length;
        const result = store.completeLesson(lesson.id, languageId, correctCount, total, Date.now() - startTime);
        sessionStorage.setItem('indilingo_last_result', JSON.stringify({
          lessonId: lesson.id, xpEarned: result.xpEarned, stars: result.stars,
          correctAnswers: correctCount, totalAnswers: total
        }));
        setLocation('/complete');
      }
      return;
    }

    let isAnsCorrect = false;
    if (isMultipleChoice) isAnsCorrect = selectedAnswer === (exercise.correctIndex ?? -1);
    else if (isWordOrder) isAnsCorrect = placedWords.join(' ') === (exercise.correctSentence ?? '');
    else if (isFillBlank) isAnsCorrect = fillInput.trim().toLowerCase() === (exercise.blankAnswer ?? '').toLowerCase();
    else if (isMatchPairs) isAnsCorrect = allPairsMatched; // always true by UI enforcement

    setAnswers([...answers, { correct: isAnsCorrect }]);
    setShowFeedback(true);
  };

  const handleQuit = () => {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) setLocation('/learn');
  };

  const isCheckDisabled = !showFeedback && (
    (isMultipleChoice && selectedAnswer === null) ||
    (isWordOrder && placedWords.length === 0) ||
    (isFillBlank && fillInput.trim() === '') ||
    (isMatchPairs && !allPairsMatched)
  );

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col max-w-md w-full mx-auto relative overflow-hidden">
      {/* Progress bar */}
      <div className="px-4 py-4 flex items-center gap-4">
        <button onClick={handleQuit} className="text-muted-foreground hover:text-foreground"><X size={28} /></button>
        <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${(currentIndex / lesson.exercises.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 pt-2 pb-32">
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }} transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} className="flex-1 flex flex-col">

            {/* ── MULTIPLE CHOICE ── */}
            {isMultipleChoice && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-3xl font-['Bricolage_Grotesque'] font-bold text-foreground mb-2">{exercise.prompt}</h2>
                {exercise.promptScript && (
                  <div className="script-devanagari text-6xl text-primary font-bold my-4 leading-tight py-4 text-center">{exercise.promptScript}</div>
                )}
                {exercise.promptTranslit && (
                  <div className="text-lg italic text-muted-foreground text-center mb-4">{exercise.promptTranslit}</div>
                )}
                {exercise.hint && (
                  <div className="text-sm font-medium text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border inline-block self-start mb-6">
                    💡 {exercise.hint}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-3 mt-auto">
                  {(exercise.options ?? []).map((opt: string, i: number) => {
                    const isSelected = selectedAnswer === i;
                    const isShowingCorrect = showFeedback && (exercise.correctIndex ?? -1) === i;
                    const isShowingWrong = showFeedback && isSelected && !isCorrect;
                    return (
                      <button key={i} disabled={showFeedback} onClick={() => setSelectedAnswer(i)}
                        className={cn("p-4 text-left rounded-2xl border-2 font-semibold text-lg transition-all flex items-center justify-between",
                          !showFeedback && isSelected ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-muted/50 text-foreground",
                          isShowingCorrect && "border-green-500 bg-green-50 text-green-700",
                          isShowingWrong && "border-red-500 bg-red-50 text-red-700")}>
                        {opt}
                        {isShowingCorrect && <Check size={20} className="text-green-600" />}
                        {isShowingWrong && <X size={20} className="text-red-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── WORD ORDER ── */}
            {isWordOrder && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-['Bricolage_Grotesque'] font-bold text-foreground mb-8">{exercise.instruction ?? ''}</h2>
                <div className="min-h-[100px] border-b-2 border-border border-dashed flex flex-wrap gap-2 pb-4 mb-8 content-start">
                  {placedWords.map((word, i) => (
                    <button key={`placed-${i}`} disabled={showFeedback}
                      onClick={() => { setPlacedWords(placedWords.filter((_, idx) => idx !== i)); setPoolWords([...poolWords, word]); }}
                      className="px-4 py-2 bg-card border-2 border-border rounded-xl font-semibold shadow-[0_2px_0_hsl(var(--border))] active:translate-y-[2px] active:shadow-none text-foreground text-lg">
                      {word}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {poolWords.map((word, i) => (
                    <button key={`pool-${i}`} disabled={showFeedback}
                      onClick={() => { setPoolWords(poolWords.filter((_, idx) => idx !== i)); setPlacedWords([...placedWords, word]); }}
                      className="px-4 py-2 bg-card border-2 border-border rounded-xl font-semibold shadow-[0_2px_0_hsl(var(--border))] active:translate-y-[2px] active:shadow-none text-foreground text-lg">
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── FILL IN THE BLANK ── */}
            {isFillBlank && (
              <div className="flex-1 flex flex-col gap-6">
                <h2 className="text-2xl font-['Bricolage_Grotesque'] font-bold text-foreground">{exercise.instruction ?? 'Fill in the blank'}</h2>
                {exercise.promptSentence && (
                  <div className="text-2xl font-medium text-foreground bg-muted/40 rounded-2xl p-5 text-center leading-relaxed border-2 border-border">
                    {exercise.promptSentence.replace('___', '___________')}
                  </div>
                )}
                {exercise.hint && (
                  <div className="text-sm font-medium text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border inline-block self-start">
                    💡 {exercise.hint}
                  </div>
                )}
                <input
                  type="text"
                  value={fillInput}
                  onChange={e => setFillInput(e.target.value)}
                  disabled={showFeedback}
                  placeholder="Type your answer…"
                  className={cn(
                    "w-full px-5 py-4 text-xl font-semibold rounded-2xl border-2 outline-none transition-all bg-card",
                    showFeedback && isCorrect ? "border-green-500 bg-green-50 text-green-700"
                    : showFeedback && !isCorrect ? "border-red-500 bg-red-50 text-red-700"
                    : "border-border focus:border-primary"
                  )}
                  onKeyDown={e => { if (e.key === 'Enter' && !isCheckDisabled) handleCheck(); }}
                />
                {showFeedback && !isCorrect && (
                  <div className="text-lg font-semibold text-red-700">
                    Correct answer: <span className="font-bold">{exercise.blankAnswer}</span>
                  </div>
                )}
              </div>
            )}

            {/* ── MATCH PAIRS ── */}
            {isMatchPairs && (
              <div className="flex-1 flex flex-col gap-4">
                <h2 className="text-2xl font-['Bricolage_Grotesque'] font-bold text-foreground">{exercise.instruction ?? 'Match the pairs'}</h2>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {/* Left column */}
                  <div className="flex flex-col gap-3">
                    {pairs.map(pair => {
                      const isMatched = matchedLefts.includes(pair.left);
                      const isSelected = selectedLeft === pair.left;
                      return (
                        <button
                          key={pair.left}
                          disabled={showFeedback || isMatched}
                          onClick={() => handleLeftClick(pair.left)}
                          className={cn(
                            "py-3 px-3 rounded-2xl border-2 font-bold text-base transition-all text-center",
                            isMatched ? "border-green-400 bg-green-50 text-green-700" :
                            isSelected ? "border-primary bg-primary/10 text-primary" :
                            "border-border bg-card hover:bg-muted/50 text-foreground"
                          )}>
                          {isMatched && <Check size={14} className="inline mr-1 text-green-600" />}
                          {pair.left}
                        </button>
                      );
                    })}
                  </div>
                  {/* Right column — shuffled */}
                  <div className="flex flex-col gap-3">
                    {[...pairs].sort((a, b) => a.right.localeCompare(b.right)).map(pair => {
                      const isMatched = matchedRights.includes(pair.right);
                      const isShaking = shakeRight === pair.right;
                      return (
                        <motion.button
                          key={pair.right}
                          disabled={showFeedback || isMatched}
                          onClick={() => handleRightClick(pair.right)}
                          animate={isShaking ? { x: [-6, 6, -6, 6, 0] } : {}}
                          transition={{ duration: 0.4 }}
                          className={cn(
                            "py-3 px-3 rounded-2xl border-2 font-bold text-base transition-all text-center",
                            isMatched ? "border-green-400 bg-green-50 text-green-700" :
                            isShaking ? "border-red-400 bg-red-50 text-red-700" :
                            "border-border bg-card hover:bg-muted/50 text-foreground"
                          )}>
                          {isMatched && <Check size={14} className="inline mr-1 text-green-600" />}
                          {pair.right}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                {allPairsMatched && !showFeedback && (
                  <div className="flex items-center gap-2 text-green-700 font-semibold text-lg">
                    <Check size={20} /> All pairs matched!
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom action bar */}
      <div className={cn("absolute bottom-0 left-0 right-0 p-6 border-t-2 bg-background z-50 transition-colors",
        showFeedback && isCorrect && "bg-green-100 border-green-200",
        showFeedback && !isCorrect && "bg-red-100 border-red-200",
        !showFeedback && "border-border")}>
        {showFeedback && (
          <div className="mb-4 flex items-start gap-3">
            <div className={cn("p-2 rounded-full", isCorrect ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700")}>
              {isCorrect ? <Check size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <h3 className={cn("font-bold text-xl", isCorrect ? "text-green-800" : "text-red-800")}>
                {isCorrect ? "Excellent!" : "Correct solution:"}
              </h3>
              {!isCorrect && (
                <p className="text-red-700 font-medium text-lg mt-1">
                  {isMultipleChoice ? (exercise.options ?? [])[exercise.correctIndex ?? 0]
                  : isWordOrder ? (exercise.correctSentence ?? '')
                  : isFillBlank ? (exercise.blankAnswer ?? '')
                  : ''}
                </p>
              )}
            </div>
          </div>
        )}
        <button onClick={handleCheck}
          disabled={isCheckDisabled}
          className={cn("w-full py-4 rounded-2xl font-bold text-xl shadow-[0_4px_0_rgba(0,0,0,0.15)] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed",
            !showFeedback ? "bg-primary text-primary-foreground border-2 border-primary/20"
            : isCorrect ? "bg-green-500 text-white border-2 border-green-600"
            : "bg-red-500 text-white border-2 border-red-600")}>
          {!showFeedback ? "Check" : "Continue"}
        </button>
      </div>
    </div>
  );
}
