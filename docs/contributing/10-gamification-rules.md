# 10 · Gamification Rules

The rules that govern XP, streaks, hearts, and badges. Do not change these without discussing it first — they are core to the user experience and changing them affects all existing users.

---

## Why these rules matter

The gamification layer is the primary retention mechanism. Streak logic, heart regeneration, and XP rewards directly affect:
- Whether users return daily
- Whether they feel rewarded for progress
- Whether losing a streak feels fair or frustrating

Any change to these rules should be treated as a product decision, not just a code change.

---

## Hearts

**Current rules:**
- Users start with **5 hearts** (max)
- Each wrong answer costs **1 heart**
- Completing a lesson restores **+1 heart** (capped at max)
- Running out of hearts during a lesson ends the session immediately
- Hearts are NOT time-regenerated in the MVP (no "come back in 4 hours")

**Where this lives:**
```
AppContext.tsx → completeLesson()
lesson/[lessonId].tsx → handleAnswer() → setHearts()
```

**Do not change without discussion:**
- The max hearts count
- The heart cost per wrong answer
- The restore amount on lesson complete

**Safe to experiment:**
- Adding time-based regeneration (after MVP, with user research)
- Adding a "heart refill" purchasable item (monetization phase)

---

## XP (Experience Points)

**Current rules:**
- XP is earned only on lesson **completion** (not per exercise)
- The XP reward per lesson is set in `curriculum.ts → lesson.xpReward`
- XP is cumulative and never decreases
- **Weekly XP** is tracked separately (`weeklyXp`) for the leaderboard
- Weekly XP resets Sunday midnight (tracked via `weeklyXpResetDate`)
- Repeating a completed lesson still awards full XP

**XP reward guidelines:**

| Lesson type | XP |
|---|---|
| Introductory | 10 |
| Standard | 15 |
| Challenging | 20 |
| Review | 10 |

**Where this lives:**
```
AppContext.tsx → completeLesson() → newXp, newWeeklyXp
curriculum.ts → lesson.xpReward
```

**Do not change without discussion:**
- Reducing XP retroactively for existing lessons (breaks user expectations)
- Making XP decrease on wrong answers (punishing, not motivating)

---

## Streaks

**Current rules:**
- Streak is the count of **consecutive days** the user studied
- Studying increments the streak by +1 only when the previous study date was **yesterday**
- If the user studied today already, the streak does not increment again
- If the last study date was 2+ days ago, the streak resets to **1** (not 0 — completing a lesson today starts a new streak)
- Streaks are checked and updated inside `completeLesson()`

**Where this lives:**
```
AppContext.tsx → checkAndUpdateStreak()
AppContext.tsx → completeLesson() → newStreak
```

**The exact logic:**
```typescript
const wasStudiedToday = prev.lastStudyDate === today;
const newStreak = wasStudiedToday
  ? prev.streak                    // already studied today — no change
  : prev.lastStudyDate === yesterday
    ? prev.streak + 1              // studied yesterday — increment
    : 1;                           // gap of 2+ days — reset to 1
```

**Do not change without discussion:**
- The "reset on missed day" rule — this is the core Duolingo mechanic
- Setting `newStreak = 0` instead of `1` when resetting — this is unnecessarily punishing

**Safe to experiment:**
- Streak freeze / shield item (monetization)
- Weekend warrior bonus (studied both Saturday and Sunday)
- Streak recovery after one missed day with a "streak repair" mechanic

---

## Badges

**Current rules:**
- Badges are computed after every `completeLesson()` call
- Badges are permanent — they cannot be unearned
- Three types of badge conditions: `lessonsRequired`, `xpRequired`, `streakRequired`
- A badge is awarded when its threshold is met or exceeded

**Current badges:**

| ID | Title | Condition |
|---|---|---|
| `first_lesson` | First Step | 1 lesson completed |
| `streak_3` | 3-Day Streak | streak ≥ 3 |
| `xp_50` | XP Hunter | xp ≥ 50 |
| `unit1_complete` | Foundation Builder | 4 lessons completed |
| `xp_100` | Century Club | xp ≥ 100 |
| `streak_7` | Week Warrior | streak ≥ 7 |

**Where this lives:**
```
curriculum.ts → BADGES
AppContext.tsx → computeBadges()
```

**Badge design rules:**
- Every badge threshold should be reachable within normal play
- Space milestones so there is always a badge within 2–3 sessions reach
- Add a new badge for any major new feature (first audio lesson, first speaking exercise, etc.)
- Never remove a badge — users may have earned it

---

## Lesson unlock logic

**Current rules:**
- First lesson of Unit 1 is always unlocked
- Each subsequent lesson unlocks when the previous lesson in the same unit is completed
- A unit's second lesson (and beyond) unlocks only when the previous lesson is done
- An entire unit unlocks only when all lessons of the previous unit are completed

**Where this lives:**
```
AppContext.tsx → useUnlockedLessons()
```

**Do not change without discussion:**
- The sequential lock logic — it controls pacing and is intentional
- The "complete previous unit" requirement — this is how the curriculum is structured

---

## Changing gamification values

If you want to change a threshold, reward, or rule:

1. Open a GitHub Issue with the proposed change and the reason
2. Tag it `product-decision` — it needs discussion before any PR
3. Include: current value, proposed value, expected user impact, any data supporting the change
4. Get sign-off from at least 2 contributors before implementing
5. Document the change in this file as part of the PR
