import React, { useState, useEffect, useMemo } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useStore } from '@/store';
import { Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { AppShell } from '@/components/AppShell';
import { TopBar } from '@/components/TopBar';
import { getLanguage, type UnitKey } from '@/data/languages';
import { useProgress } from '@/lib/progress';
import { buildLesson, type Exercise, LESSONS_PER_UNIT } from '@/lib/lessons';

export function Lesson() {
  const [, params] = useRoute('/lesson/:unit');
  const [, setLocation] = useLocation();
  const userId = useStore((state) => state.userId);
  const { state, hydrated, completeLesson } = useProgress();
  const lang = getLanguage(state.currentLang);
  
  const unitKey = params?.unit as UnitKey;
  const lessonIndex = state.progress[lang.code]?.[unitKey] ?? 0;

  const exercises = useMemo(
    () => buildLesson(lang, unitKey, lessonIndex),
    [lang, unitKey, lessonIndex],
  );

  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongItems, setWrongItems] = useState<Exercise[]>([]);
  const [done, setDone] = useState(false);

  const total = exercises.length;
  const pct = Math.round((idx / total) * 100);

  useEffect(() => {
    if (!done || !hydrated) return;
    const gained = correctCount * 10;
    const reviewSeed: { lang: typeof lang.code; native: string; roman: string; meaning: string }[] = [];
    for (const w of lang.words.slice(0, 4)) {
      reviewSeed.push({ lang: lang.code, native: w.native, roman: w.roman, meaning: w.meaning });
    }
    completeLesson(lang.code, unitKey, gained, reviewSeed);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF1B6B', '#FF9E1B', '#45CAFF', '#00D16B']
    });
  }, [done, hydrated, lang, unitKey, correctCount, completeLesson]);

  const onExerciseDone = (isCorrect: boolean, ex: Exercise) => {
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setWrongItems((w) => [...w, ex]);
    if (idx + 1 >= total) setDone(true);
    else setIdx((i) => i + 1);
  };

  if (!unitKey) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-background text-2xl font-bold">Invalid lesson</div>;
  }

  if (done) {
    const stars = correctCount === total ? 3 : correctCount >= Math.ceil(total * 0.7) ? 2 : 1;
    return (
      <AppShell hideNav>
        <div className="px-6 pt-20 text-center">
          <div className="text-6xl mb-4 font-display" style={{ fontFamily: lang.fontFamily }}>
            {lang.greeting}
          </div>
          <h1 className="text-3xl font-display mb-2">Lesson complete</h1>
          <p className="text-muted-foreground mb-8">
            {correctCount}/{total} correct · +{correctCount * 10} XP
          </p>
          <div className="flex justify-center gap-2 mb-10">
            {[1, 2, 3].map((i) => (
              <svg key={i} width={40} height={40} viewBox="0 0 24 24" fill={i <= stars ? "var(--yellow-500)" : "var(--muted)"}>
                <path d="m12 2 2.6 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.4-1.1L12 2z" />
              </svg>
            ))}
          </div>
          <button
            onClick={() => setLocation('/learn')}
            className="block w-full bg-primary text-primary-foreground py-4 rounded-2xl font-medium tracking-wide hover:bg-primary/90 transition-colors mb-3"
          >
            Back to path
          </button>
          <button
            onClick={() => setLocation('/review')}
            className="block w-full bg-card ring-1 ring-border py-4 rounded-2xl font-medium tracking-wide hover:border-primary transition-all"
          >
            Review new words
          </button>
        </div>
      </AppShell>
    );
  }

  const ex = exercises[idx];

  return (
    <AppShell hideNav>
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md px-5 py-4 flex items-center gap-4 border-b border-border">
        <button onClick={() => setLocation('/learn')} aria-label="Exit lesson" className="text-muted-foreground hover:text-foreground">
          <X size={22} />
        </button>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden ring-1 ring-border">
          <div className="bg-primary h-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-semibold text-primary tabular-nums">{idx + 1}/{total}</span>
      </header>

      <ExerciseCard key={idx} exercise={ex} onDone={(ok) => onExerciseDone(ok, ex)} />

      {wrongItems.length > 0 && (
        <div className="fixed top-16 right-4 text-xs text-muted-foreground">
          {wrongItems.length} to retry
        </div>
      )}
    </AppShell>
  );
}

function ExerciseCard({ exercise, onDone }: { exercise: Exercise; onDone: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"ok" | "no" | null>(null);

  const check = (val: string, correct: string) => {
    if (picked !== null) return;
    setPicked(val);
    const ok = val === correct;
    setFeedback(ok ? "ok" : "no");
    setTimeout(() => onDone(ok), 900);
  };

  if (exercise.kind === "trace") {
    return <TraceExercise exercise={exercise} onDone={() => onDone(true)} />;
  }

  if (exercise.kind === "arrange") {
    return <ArrangeExercise exercise={exercise} onDone={onDone} />;
  }

  const prompt =
    exercise.kind === "match-glyph" ? exercise.prompt
      : exercise.kind === "listen-pick" ? exercise.native
      : exercise.text;
  const promptFont =
    exercise.kind === "match-glyph" ? exercise.promptFont
      : exercise.kind === "listen-pick" ? exercise.nativeFont
      : undefined;
  const sub = "sub" in exercise ? exercise.sub : undefined;
  const optionsFont =
    exercise.kind === "translate" ? exercise.optionsFont : undefined;
  const heading =
    exercise.kind === "match-glyph" ? "What does this mean?"
      : exercise.kind === "listen-pick" ? "Tap the meaning"
      : "Choose the correct answer";

  return (
    <div className="px-5 pt-10 pb-32">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">{heading}</span>
      <div className="bg-card rounded-[24px] p-8 ring-1 ring-border mb-6 text-center">
        <div className="text-5xl font-display mb-3 leading-tight break-words" style={promptFont ? { fontFamily: promptFont } : undefined}>
          {prompt}
        </div>
        {sub && <div className="text-sm text-muted-foreground italic">{sub}</div>}
        {exercise.kind === "listen-pick" && (
          <button
            aria-label="Play audio"
            onClick={() => speak(exercise.native)}
            className="mt-4 inline-flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-widest hover:text-foreground transition-colors"
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Listen
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {exercise.options.map((opt) => {
          const isPicked = picked === opt;
          const isCorrect = opt === exercise.correct;
          const state =
            picked === null ? "idle"
              : isPicked && isCorrect ? "ok"
              : isPicked && !isCorrect ? "no"
              : isCorrect ? "reveal"
              : "dim";
          const cls =
            state === "ok" ? "bg-yellow-500/20 ring-yellow-500 text-foreground"
              : state === "no" ? "bg-red-100 ring-red-400 text-foreground"
              : state === "reveal" ? "bg-yellow-500/10 ring-yellow-500/60"
              : state === "dim" ? "bg-card ring-border opacity-50"
              : "bg-card ring-border hover:border-primary hover:-translate-y-0.5";
          return (
            <button
              key={opt}
              onClick={() => check(opt, exercise.correct)}
              className={`rounded-2xl p-4 ring-2 transition-all min-h-20 text-base font-medium ${cls}`}
              style={optionsFont ? { fontFamily: optionsFont } : undefined}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {feedback && (
        <div className={`mt-6 text-center font-semibold ${feedback === "ok" ? "text-yellow-600" : "text-red-500"}`}>
          {feedback === "ok" ? "✓ Correct!" : `✗ Answer: ${exercise.correct}`}
        </div>
      )}
    </div>
  );
}

function TraceExercise({ exercise, onDone }: { exercise: Extract<Exercise, { kind: "trace" }>; onDone: () => void }) {
  const [traced, setTraced] = useState(false);
  return (
    <div className="px-5 pt-10 pb-32">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Meet this letter</span>
      <div className="bg-card rounded-[24px] p-8 ring-1 ring-border mb-6 text-center">
        <div
          className="text-[8rem] font-display leading-none mb-2"
          style={exercise.glyphFont ? { fontFamily: exercise.glyphFont } : undefined}
        >
          {exercise.glyph}
        </div>
        <div className="text-lg text-muted-foreground italic">"{exercise.roman}"</div>
      </div>
      <div className="bg-muted/50 rounded-[24px] ring-1 ring-border p-6 mb-6 min-h-48 flex items-center justify-center relative overflow-hidden">
        <span
          className="text-[10rem] font-display leading-none text-muted-foreground/30 select-none"
          style={exercise.glyphFont ? { fontFamily: exercise.glyphFont } : undefined}
        >
          {exercise.glyph}
        </span>
        {!traced && (
          <button
            onClick={() => setTraced(true)}
            className="absolute inset-0 flex items-center justify-center bg-background/0 hover:bg-background/30 transition-colors"
          >
            <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest">
              Tap to trace
            </span>
          </button>
        )}
        {traced && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="size-16 bg-yellow-500/30 rounded-full flex items-center justify-center animate-pulse">
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="var(--foreground)" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={onDone}
        disabled={!traced}
        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-medium tracking-wide hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Got it
      </button>
    </div>
  );
}

function ArrangeExercise({ exercise, onDone }: { exercise: Extract<Exercise, { kind: "arrange" }>; onDone: (correct: boolean) => void }) {
  const [chosen, setChosen] = useState<string[]>([]);
  const [checked, setChecked] = useState<"ok" | "no" | null>(null);
  
  function usedIndices(tokens: string[], picked: string[]): Set<number> {
    const used = new Set<number>();
    for (const p of picked) {
      for (let i = 0; i < tokens.length; i++) {
        if (!used.has(i) && tokens[i] === p) { used.add(i); break; }
      }
    }
    return used;
  }

  const doCheck = () => {
    const ok = chosen.join(" ") === exercise.correct.join(" ");
    setChecked(ok ? "ok" : "no");
    setTimeout(() => onDone(ok), 1100);
  };

  return (
    <div className="px-5 pt-10 pb-32">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
        Arrange to say "{exercise.meaning}"
      </span>
      <div className="min-h-24 bg-card rounded-[24px] p-4 ring-1 ring-border mb-4 flex flex-wrap gap-2 items-start">
        {chosen.length === 0 && <span className="text-sm text-muted-foreground italic self-center mx-auto">Tap words below</span>}
        {chosen.map((tok, i) => (
          <button
            key={`${tok}-${i}`}
            onClick={() => setChosen((c) => c.filter((_, idx) => idx !== i))}
            className="bg-primary text-primary-foreground px-3 py-2 rounded-xl text-lg"
            style={exercise.tokenFont ? { fontFamily: exercise.tokenFont } : undefined}
          >
            {tok}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {exercise.tokens.map((tok, i) => {
          const used = usedIndices(exercise.tokens, chosen).has(i);
          return (
            <button
              key={i}
              disabled={used}
              onClick={() => setChosen((c) => [...c, tok])}
              className={`px-3 py-2 rounded-xl text-lg ring-1 transition-all ${
                used ? "bg-muted ring-transparent text-muted-foreground" : "bg-card ring-border hover:border-primary"
              }`}
              style={exercise.tokenFont ? { fontFamily: exercise.tokenFont } : undefined}
            >
              {tok}
            </button>
          );
        })}
      </div>
      <button
        onClick={doCheck}
        disabled={chosen.length === 0 || checked !== null}
        className={`w-full py-4 rounded-2xl font-medium tracking-wide transition-colors ${
          checked === "ok" ? "bg-yellow-500 text-foreground"
            : checked === "no" ? "bg-red-500 text-white"
            : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
        }`}
      >
        {checked === "ok" ? "Correct!" : checked === "no" ? `Answer: ${exercise.correct.join(" ")}` : "Check"}
      </button>
    </div>
  );
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}
