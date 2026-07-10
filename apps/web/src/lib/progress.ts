import { useEffect, useState, useCallback } from "react";
import type { LangCode } from "@/data/languages";
import type { UnitKey } from "@/data/languages";

export interface ProgressState {
  currentLang: LangCode;
  xp: number;
  streak: number;
  lastDay: string;
  progress: Record<string, Partial<Record<UnitKey, number>>>;
  reviewPile: { lang: LangCode; native: string; roman: string; meaning: string }[];
}

const KEY = "indilingo.v2";

const initial: ProgressState = {
  currentLang: "ta",
  xp: 0,
  streak: 0,
  lastDay: "",
  progress: {},
  reviewPile: [],
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function read(): ProgressState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

function write(s: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent("indilingo:update"));
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
    const onUpdate = () => setState(read());
    window.addEventListener("indilingo:update", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("indilingo:update", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const update = useCallback((mut: (s: ProgressState) => ProgressState) => {
    const next = mut(read());
    write(next);
    setState(next);
  }, []);

  const setLanguage = useCallback((code: LangCode) => {
    update((s) => ({ ...s, currentLang: code }));
  }, [update]);

  const addXp = useCallback((amount: number) => {
    update((s) => {
      const t = today();
      const isNewDay = s.lastDay !== t;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streak = !s.lastDay
        ? 1
        : s.lastDay === t
          ? s.streak
          : s.lastDay === yesterday
            ? s.streak + 1
            : 1;
      return { ...s, xp: s.xp + amount, streak, lastDay: isNewDay ? t : s.lastDay };
    });
  }, [update]);

  const completeLesson = useCallback(
    (lang: LangCode, unit: UnitKey, gainedXp: number,
      newReviewItems: ProgressState["reviewPile"]) => {
      update((s) => {
        const langProg = { ...(s.progress[lang] ?? {}) };
        langProg[unit] = (langProg[unit] ?? 0) + 1;
        const t = today();
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const streak = !s.lastDay
          ? 1
          : s.lastDay === t
            ? Math.max(s.streak, 1)
            : s.lastDay === yesterday
              ? s.streak + 1
              : 1;
        const existing = new Set(s.reviewPile.map((r) => `${r.lang}:${r.native}`));
        const merged = [
          ...s.reviewPile,
          ...newReviewItems.filter((r) => !existing.has(`${r.lang}:${r.native}`)),
        ].slice(-200);
        return {
          ...s,
          xp: s.xp + gainedXp,
          streak,
          lastDay: t,
          progress: { ...s.progress, [lang]: langProg },
          reviewPile: merged,
        };
      });
    }, [update]);

  const reset = useCallback(() => {
    write(initial);
    setState(initial);
  }, []);

  return { state, hydrated, setLanguage, addXp, completeLesson, reset };
}

export function unitProgressPct(
  state: ProgressState, lang: LangCode, unit: UnitKey, lessonsTotal: number,
): number {
  const done = state.progress[lang]?.[unit] ?? 0;
  return Math.min(100, Math.round((done / lessonsTotal) * 100));
}
