import React, { useState } from 'react';
import { useLocation, Redirect } from 'wouter';
import { useStore } from '@/store';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { AppShell } from '@/components/AppShell';
import { TopBar } from '@/components/TopBar';
import { getLanguage } from '@/data/languages';
import { useProgress } from '@/lib/progress';
import type { Exercise } from '@/lib/lessons';

export function Review() {
  const [, setLocation] = useLocation();
  const userId = useStore((state) => state.userId);
  const { state, hydrated } = useProgress();
  const lang = getLanguage(state.currentLang);

  const [idx, setIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const reviewQueue = state.reviewPile.filter(item => item.lang === lang.code);

  if (!userId) return <Redirect to="/" />;

  if (!hydrated) {
    return <div className="p-8 text-xl font-bold animate-pulse text-center">Loading your review queue...</div>;
  }

  if (reviewQueue.length === 0) {
    return (
      <AppShell>
        <TopBar lang={lang} streak={state.streak} xp={state.xp} />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
          <div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mb-6">
            <Check className="w-12 h-12" strokeWidth={4} />
          </div>
          <h1 className="text-3xl font-display font-black mb-2">All caught up!</h1>
          <p className="text-muted-foreground text-lg mb-8">Nothing to review right now. Come back later!</p>
          <button 
            onClick={() => setLocation('/learn')}
            className="btn-playful bg-primary text-primary-foreground px-8 py-3 text-lg"
          >
            Learn New Lessons
          </button>
        </div>
      </AppShell>
    );
  }

  const currentItem = reviewQueue[idx];

  const handleComplete = () => {
    if (idx < reviewQueue.length - 1) {
      setIdx(idx + 1);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#00D16B', '#FF1B6B']
      });
    }
  };

  if (isFinished) {
    return (
      <AppShell>
        <TopBar lang={lang} streak={state.streak} xp={state.xp} />
        <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-display font-black text-success mb-4">Review Session Complete!</h1>
          <p className="text-xl text-muted-foreground font-medium mb-8">Your memory is getting stronger.</p>
          <button 
            onClick={() => setLocation('/learn')}
            className="btn-playful bg-primary text-primary-foreground px-10 py-4 text-xl"
          >
            Back to Path
          </button>
        </div>
      </AppShell>
    );
  }

  // Convert review item to exercise format
  const exercise: Exercise = {
    kind: "match-glyph",
    prompt: currentItem.native,
    promptFont: lang.fontFamily,
    sub: currentItem.roman,
    correct: currentItem.meaning,
    options: [currentItem.meaning, "Option 2", "Option 3", "Option 4"], // Would need better distractor generation
  };

  return (
    <AppShell>
      <TopBar lang={lang} streak={state.streak} xp={state.xp} />
      <div className="px-5 pt-10 pb-32">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Review {idx + 1} of {reviewQueue.length}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(((reviewQueue.length - idx - 1) / reviewQueue.length) * 100)}% remaining
          </span>
        </div>
        
        <div className="bg-card rounded-[24px] p-8 ring-1 ring-border mb-6 text-center">
          <div className="text-5xl font-display mb-3 leading-tight" style={{ fontFamily: lang.fontFamily }}>
            {currentItem.native}
          </div>
          <div className="text-sm text-muted-foreground italic">{currentItem.roman}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {exercise.options.map((opt, i) => (
            <button
              key={i}
              onClick={handleComplete}
              className="rounded-2xl p-4 ring-2 ring-border bg-card hover:border-primary transition-all min-h-20 text-base font-medium"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
