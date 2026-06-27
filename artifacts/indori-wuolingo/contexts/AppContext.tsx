import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { BADGES, CURRICULUM } from '@/data/curriculum';

const STORAGE_KEY_PROFILE = 'iw_user_profile';
const STORAGE_KEY_PROGRESS = 'iw_user_progress';

export interface UserProfile {
  displayName: string;
  nativeLanguage: string;
  targetLanguage: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced';
  dailyGoalMinutes: number;
}

export interface WordStat {
  correct: number;
  incorrect: number;
  lastSeen: string;
}

export interface UserProgress {
  xp: number;
  streak: number;
  hearts: number;
  maxHearts: number;
  lastStudyDate: string | null;
  lastHeartRefill: string | null;
  completedLessons: string[];
  wordBank: Record<string, WordStat>;
  totalMinutesStudied: number;
  weeklyXp: number;
  weeklyXpResetDate: string | null;
  earnedBadgeIds: string[];
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  streak: 0,
  hearts: 5,
  maxHearts: 5,
  lastStudyDate: null,
  lastHeartRefill: null,
  completedLessons: [],
  wordBank: {},
  totalMinutesStudied: 0,
  weeklyXp: 0,
  weeklyXpResetDate: null,
  earnedBadgeIds: [],
};

interface AppContextValue {
  isLoading: boolean;
  isOnboarded: boolean;
  userProfile: UserProfile | null;
  progress: UserProgress;
  completeOnboarding: (profile: UserProfile) => Promise<void>;
  completeLesson: (lessonId: string, xpGained: number, wrongWordIds: string[]) => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function checkAndUpdateStreak(progress: UserProgress): UserProgress {
  const today = todayStr();
  if (!progress.lastStudyDate) return progress;
  const last = new Date(progress.lastStudyDate);
  const now = new Date(today);
  const diffDays = Math.round((now.getTime() - last.getTime()) / 86400000);
  if (diffDays === 1) return progress;
  if (diffDays > 1) return { ...progress, streak: 0 };
  return progress;
}

function computeBadges(progress: UserProgress): string[] {
  const earned = new Set(progress.earnedBadgeIds);
  for (const badge of BADGES) {
    if (badge.lessonsRequired > 0 && progress.completedLessons.length >= badge.lessonsRequired) {
      earned.add(badge.id);
    }
    if (badge.xpRequired > 0 && progress.xp >= badge.xpRequired) {
      earned.add(badge.id);
    }
    if ((badge as any).streakRequired > 0 && progress.streak >= (badge as any).streakRequired) {
      earned.add(badge.id);
    }
  }
  return Array.from(earned);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    async function load() {
      try {
        const [profileJson, progressJson] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_PROFILE),
          AsyncStorage.getItem(STORAGE_KEY_PROGRESS),
        ]);
        if (profileJson) setUserProfile(JSON.parse(profileJson));
        if (progressJson) {
          const loaded: UserProgress = JSON.parse(progressJson);
          setProgress(checkAndUpdateStreak(loaded));
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const completeOnboarding = useCallback(async (profile: UserProfile) => {
    setUserProfile(profile);
    await AsyncStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, []);

  const completeLesson = useCallback(async (lessonId: string, xpGained: number, wrongWordIds: string[]) => {
    setProgress(prev => {
      const today = todayStr();
      const wasStudiedToday = prev.lastStudyDate === today;
      const newStreak = wasStudiedToday
        ? prev.streak
        : prev.lastStudyDate === new Date(Date.now() - 86400000).toISOString().slice(0, 10)
          ? prev.streak + 1
          : 1;

      const newCompleted = prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId];

      const newWordBank = { ...prev.wordBank };
      for (const wid of wrongWordIds) {
        const existing = newWordBank[wid] ?? { correct: 0, incorrect: 0, lastSeen: today };
        newWordBank[wid] = { ...existing, incorrect: existing.incorrect + 1, lastSeen: today };
      }

      const newXp = prev.xp + xpGained;
      const newWeeklyXp = prev.weeklyXp + xpGained;
      const newHearts = Math.min(prev.maxHearts, prev.hearts + 1);

      const next: UserProgress = {
        ...prev,
        xp: newXp,
        weeklyXp: newWeeklyXp,
        streak: newStreak,
        hearts: newHearts,
        lastStudyDate: today,
        completedLessons: newCompleted,
        wordBank: newWordBank,
        totalMinutesStudied: prev.totalMinutesStudied + 5,
      };
      next.earnedBadgeIds = computeBadges(next);

      AsyncStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const resetOnboarding = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEY_PROFILE),
      AsyncStorage.removeItem(STORAGE_KEY_PROGRESS),
    ]);
    setUserProfile(null);
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return (
    <AppContext.Provider value={{
      isLoading,
      isOnboarded: !!userProfile,
      userProfile,
      progress,
      completeOnboarding,
      completeLesson,
      resetOnboarding,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export function useUnlockedLessons(): Set<string> {
  const { progress } = useAppContext();
  const unlocked = new Set<string>();

  for (let ui = 0; ui < CURRICULUM.length; ui++) {
    const unit = CURRICULUM[ui];
    const prevUnitDone = ui === 0 || CURRICULUM[ui - 1].lessons.every(l => progress.completedLessons.includes(l.id));
    if (!prevUnitDone) break;
    for (let li = 0; li < unit.lessons.length; li++) {
      const lesson = unit.lessons[li];
      const prevDone = li === 0 || progress.completedLessons.includes(unit.lessons[li - 1].id);
      if (prevDone) unlocked.add(lesson.id);
    }
  }

  if (unlocked.size === 0 && CURRICULUM[0]?.lessons[0]) {
    unlocked.add(CURRICULUM[0].lessons[0].id);
  }

  return unlocked;
}
