import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BADGES, BadgeId, curriculum, getAllLessons } from "@/data/curriculum";

export interface ProgressData {
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  completedLessons: string[];
  earnedBadges: BadgeId[];
  wordErrors: Record<string, number>;
  totalMinutesStudied: number;
}

const DEFAULT_PROGRESS: ProgressData = {
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  completedLessons: [],
  earnedBadges: [],
  wordErrors: {},
  totalMinutesStudied: 0,
};

interface ProgressContextValue {
  progress: ProgressData;
  completeLesson: (lessonId: string, xpEarned: number, errors: Record<string, number>) => Promise<BadgeId[]>;
  getCurrentLessonId: () => string | null;
  isLessonComplete: (id: string) => boolean;
  isLessonAvailable: (id: string) => boolean;
  getUnitProgress: (unitId: string) => number;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const STORAGE_KEY = "@wuolingo_progress";

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgressState] = useState<ProgressData>(DEFAULT_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProgressState(JSON.parse(stored));
        }
      } catch {}
      setIsLoading(false);
    })();
  }, []);

  const saveProgress = async (p: ProgressData) => {
    setProgressState(p);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {}
  };

  const completeLesson = async (
    lessonId: string,
    xpEarned: number,
    errors: Record<string, number>
  ): Promise<BadgeId[]> => {
    const today = getTodayString();
    const prev = progress;

    const alreadyComplete = prev.completedLessons.includes(lessonId);
    const completedLessons = alreadyComplete
      ? prev.completedLessons
      : [...prev.completedLessons, lessonId];

    const newXp = alreadyComplete ? prev.xp : prev.xp + xpEarned;

    let newStreak = prev.streak;
    let lastStudyDate = prev.lastStudyDate;
    if (!alreadyComplete) {
      if (prev.lastStudyDate === null) {
        newStreak = 1;
      } else {
        const lastDate = new Date(prev.lastStudyDate);
        const todayDate = new Date(today);
        const diff = Math.round(
          (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diff === 0) {
          newStreak = prev.streak;
        } else if (diff === 1) {
          newStreak = prev.streak + 1;
        } else {
          newStreak = 1;
        }
      }
      lastStudyDate = today;
    }

    const wordErrors = { ...prev.wordErrors };
    Object.entries(errors).forEach(([word, count]) => {
      wordErrors[word] = (wordErrors[word] ?? 0) + count;
    });

    const newBadges: BadgeId[] = [];
    const earnedBadges = [...prev.earnedBadges];

    const checkBadge = (id: BadgeId, condition: boolean) => {
      if (condition && !earnedBadges.includes(id)) {
        earnedBadges.push(id);
        newBadges.push(id);
      }
    };

    checkBadge("first_lesson", completedLessons.length >= 1);
    checkBadge("streak_3", newStreak >= 3);
    checkBadge("streak_7", newStreak >= 7);
    checkBadge("xp_50", newXp >= 50);
    checkBadge("xp_100", newXp >= 100);

    const unit1Lessons = curriculum[0].lessons.map((l) => l.id);
    const unit2Lessons = curriculum[1].lessons.map((l) => l.id);
    const unit3Lessons = curriculum[2].lessons.map((l) => l.id);

    checkBadge("unit1_complete", unit1Lessons.every((id) => completedLessons.includes(id)));
    checkBadge("unit2_complete", unit2Lessons.every((id) => completedLessons.includes(id)));
    checkBadge("unit3_complete", unit3Lessons.every((id) => completedLessons.includes(id)));

    const updated: ProgressData = {
      ...prev,
      xp: newXp,
      streak: newStreak,
      lastStudyDate,
      completedLessons,
      earnedBadges,
      wordErrors,
      totalMinutesStudied: prev.totalMinutesStudied + 3,
    };

    await saveProgress(updated);
    return newBadges;
  };

  const isLessonComplete = (id: string) => progress.completedLessons.includes(id);

  const isLessonAvailable = (id: string): boolean => {
    const all = getAllLessons();
    const idx = all.findIndex((l) => l.id === id);
    if (idx === 0) return true;
    if (idx === -1) return false;
    return progress.completedLessons.includes(all[idx - 1].id);
  };

  const getCurrentLessonId = (): string | null => {
    const all = getAllLessons();
    const next = all.find((l) => !progress.completedLessons.includes(l.id));
    return next?.id ?? null;
  };

  const getUnitProgress = (unitId: string): number => {
    const unit = curriculum.find((u) => u.id === unitId);
    if (!unit) return 0;
    const completed = unit.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
    return completed / unit.lessons.length;
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        completeLesson,
        getCurrentLessonId,
        isLessonComplete,
        isLessonAvailable,
        getUnitProgress,
        isLoading,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
