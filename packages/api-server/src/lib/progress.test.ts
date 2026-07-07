import { describe, expect, it } from "vitest";
import {
  clampCorrectCount,
  computeBadges,
  computeStars,
  computeStreak,
  computeXpEarned,
} from "./progress.js";

describe("computeStars", () => {
  it("returns 0 when there are no exercises", () => {
    expect(computeStars(0, 0)).toBe(0);
    expect(computeStars(5, 0)).toBe(0);
    expect(computeStars(1, -1)).toBe(0);
  });

  it("awards 3 stars for a perfect score", () => {
    expect(computeStars(10, 10)).toBe(3);
  });

  it("awards 2 stars at or above the 70% threshold", () => {
    expect(computeStars(7, 10)).toBe(2);
    expect(computeStars(9, 10)).toBe(2);
  });

  it("awards 1 star for any correct answers below 70%", () => {
    expect(computeStars(1, 10)).toBe(1);
    expect(computeStars(6, 10)).toBe(1);
  });

  it("awards 0 stars when nothing is correct", () => {
    expect(computeStars(0, 10)).toBe(0);
  });
});

describe("clampCorrectCount", () => {
  it("clamps negatives to zero", () => {
    expect(clampCorrectCount(-5, 10)).toBe(0);
  });

  it("clamps values above the total down to the total", () => {
    expect(clampCorrectCount(99, 10)).toBe(10);
  });

  it("passes through valid in-range values", () => {
    expect(clampCorrectCount(4, 10)).toBe(4);
  });

  it("never returns more than a non-positive total", () => {
    expect(clampCorrectCount(5, 0)).toBe(0);
    expect(clampCorrectCount(5, -3)).toBe(0);
  });
});

describe("computeXpEarned", () => {
  it("awards the full reward on first completion with stars", () => {
    expect(
      computeXpEarned({ isFirstCompletion: true, stars: 3, prevStars: -1, xpReward: 100 }),
    ).toBe(100);
  });

  it("awards half the reward (rounded) on a first completion with zero stars", () => {
    expect(
      computeXpEarned({ isFirstCompletion: true, stars: 0, prevStars: -1, xpReward: 25 }),
    ).toBe(13);
  });

  it("awards a 25% bonus (rounded) when a replay improves the star rating", () => {
    expect(
      computeXpEarned({ isFirstCompletion: false, stars: 3, prevStars: 2, xpReward: 100 }),
    ).toBe(25);
  });

  it("awards nothing on a replay that does not improve stars", () => {
    expect(
      computeXpEarned({ isFirstCompletion: false, stars: 2, prevStars: 2, xpReward: 100 }),
    ).toBe(0);
    expect(
      computeXpEarned({ isFirstCompletion: false, stars: 1, prevStars: 3, xpReward: 100 }),
    ).toBe(0);
  });
});

describe("computeStreak", () => {
  it("starts a streak at 1 when there is no prior activity", () => {
    expect(computeStreak({ lastActiveDate: null, streak: 0, today: "2026-01-10" })).toBe(1);
  });

  it("leaves the streak unchanged when already active today", () => {
    expect(
      computeStreak({ lastActiveDate: "2026-01-10", streak: 5, today: "2026-01-10" }),
    ).toBe(5);
  });

  it("increments the streak when active exactly yesterday", () => {
    expect(
      computeStreak({ lastActiveDate: "2026-01-09", streak: 5, today: "2026-01-10" }),
    ).toBe(6);
  });

  it("resets the streak to 1 after a gap of more than one day", () => {
    expect(
      computeStreak({ lastActiveDate: "2026-01-07", streak: 5, today: "2026-01-10" }),
    ).toBe(1);
  });

  it("handles month boundaries when computing 'yesterday'", () => {
    expect(
      computeStreak({ lastActiveDate: "2026-01-31", streak: 2, today: "2026-02-01" }),
    ).toBe(3);
  });
});

describe("computeBadges", () => {
  it("returns no badges for a brand-new learner", () => {
    expect(computeBadges({ totalLessonsCompleted: 0, xp: 0, streak: 0 })).toEqual([]);
  });

  it("awards First Steps after the first lesson", () => {
    expect(computeBadges({ totalLessonsCompleted: 1, xp: 0, streak: 0 })).toEqual([
      "First Steps",
    ]);
  });

  it("awards On Fire once a 7-day streak is reached", () => {
    expect(computeBadges({ totalLessonsCompleted: 3, xp: 50, streak: 7 })).toContain(
      "On Fire",
    );
  });

  it("stacks XP milestone badges in ascending order", () => {
    expect(computeBadges({ totalLessonsCompleted: 20, xp: 1000, streak: 10 })).toEqual([
      "First Steps",
      "Century Club",
      "On Fire",
      "Rocket Learner",
      "Champion",
    ]);
  });

  it("omits higher milestones that have not been reached", () => {
    const badges = computeBadges({ totalLessonsCompleted: 5, xp: 100, streak: 1 });
    expect(badges).toContain("Century Club");
    expect(badges).not.toContain("Rocket Learner");
    expect(badges).not.toContain("Champion");
  });
});
