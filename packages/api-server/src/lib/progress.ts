/**
 * Pure gamification logic shared by the lesson-completion and user-stats routes.
 *
 * These functions contain no I/O so they can be unit-tested in isolation. The
 * Express handlers are responsible for the database reads/writes and simply
 * delegate the arithmetic here.
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Award stars based on the ratio of correct answers to total exercises. */
export function computeStars(correctCount: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  const ratio = correctCount / totalCount;
  if (ratio >= 1) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio > 0) return 1;
  return 0;
}

/** Clamp a client-reported correct count into the valid [0, total] range. */
export function clampCorrectCount(correctCount: number, total: number): number {
  return Math.min(Math.max(0, correctCount), Math.max(0, total));
}

export interface XpInput {
  /** Whether this is the learner's first completion of the lesson. */
  isFirstCompletion: boolean;
  /** Stars earned on this attempt. */
  stars: number;
  /** Best stars previously recorded (use -1 when there is no prior record). */
  prevStars: number;
  /** Full XP reward configured on the lesson. */
  xpReward: number;
}

/**
 * XP is idempotent: full reward on the first completion (halved if zero stars),
 * a small bonus only when a repeat attempt improves the star rating, otherwise
 * nothing.
 */
export function computeXpEarned({
  isFirstCompletion,
  stars,
  prevStars,
  xpReward,
}: XpInput): number {
  if (isFirstCompletion) {
    return stars > 0 ? xpReward : Math.round(xpReward / 2);
  }
  const isImprovedStars = stars > prevStars;
  return isImprovedStars ? Math.round(xpReward * 0.25) : 0;
}

export interface StreakInput {
  /** The learner's last active date as an ISO "YYYY-MM-DD" string, or null. */
  lastActiveDate: string | null;
  /** The learner's current streak. */
  streak: number;
  /** Today as an ISO "YYYY-MM-DD" string. */
  today: string;
}

/**
 * Streak rules: unchanged if already active today, incremented if active
 * exactly yesterday, otherwise reset to 1.
 */
export function computeStreak({
  lastActiveDate,
  streak,
  today,
}: StreakInput): number {
  if (lastActiveDate === today) return streak;

  const wasActiveYesterday = (() => {
    if (!lastActiveDate) return false;
    const diffDays = Math.round(
      (new Date(today).getTime() - new Date(lastActiveDate).getTime()) /
        MS_PER_DAY,
    );
    return diffDays === 1;
  })();

  return wasActiveYesterday ? streak + 1 : 1;
}

export interface BadgeInput {
  totalLessonsCompleted: number;
  xp: number;
  streak: number;
}

/** Derive the list of earned badges from a learner's aggregate stats. */
export function computeBadges({
  totalLessonsCompleted,
  xp,
  streak,
}: BadgeInput): string[] {
  const badges: string[] = [];
  if (totalLessonsCompleted >= 1) badges.push("First Steps");
  if (xp >= 100) badges.push("Century Club");
  if (streak >= 7) badges.push("On Fire");
  if (xp >= 500) badges.push("Rocket Learner");
  if (xp >= 1000) badges.push("Champion");
  return badges;
}
