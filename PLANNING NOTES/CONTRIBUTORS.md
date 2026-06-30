# Contributing to Indori-Wuolingo

> **Indori-Wuolingo** is a Duolingo-style mobile app for learning Indian languages.  
> The first track is **English → Hindi**. The codebase is built to expand to Marathi, Tamil, Bengali, Telugu, Kannada, and Gujarati without rebuilding the app.

---

## What this project is

A mobile-first language learning app that combines:
- short, repeatable lessons (under 5 minutes each)
- gamification — XP, streaks, hearts, badges, leaderboard
- spaced repetition review of weak words
- culturally localized vocabulary and exercises
- a content model designed to scale across Indian languages

Built with **Expo SDK 54** (React Native), **TypeScript**, and **pnpm workspaces**. No backend in the MVP — all progress is stored in **AsyncStorage** on-device.

---

## Repository map

```
artifacts/
  indori-wuolingo/         ← the Expo app (main product)
    app/
      index.tsx            ← entry: redirects to onboarding or tabs
      _layout.tsx          ← root layout, providers, font loading
      onboarding/          ← welcome → language + name → goals
      (tabs)/
        index.tsx          ← home screen: lesson path
        review.tsx         ← spaced repetition + practice tab
        leaderboard.tsx    ← weekly XP ranking
        profile.tsx        ← stats, badges, course progress
      lesson/
        [lessonId].tsx     ← lesson player: progress bar, hearts, exercises
        complete.tsx       ← post-lesson celebration screen
    components/
      ExerciseView.tsx     ← renders MULTIPLE_CHOICE and WORD_ORDER exercises
      ErrorBoundary.tsx    ← top-level error boundary
    contexts/
      AppContext.tsx        ← global state: profile, progress, streak, XP
                             persisted via AsyncStorage
    data/
      curriculum.ts        ← ALL lesson content: 5 units, 11 lessons, 66+ exercises
                             LEADERBOARD_MOCK, BADGES
    constants/
      colors.ts            ← design tokens (indigo primary, saffron accent)
    hooks/
      useColors.ts         ← reads color scheme, returns palette + radius
    assets/
      images/icon.png      ← app icon: गाना (Devanagari ह) on deep purple
  api-server/              ← Express API server (future backend)
  mockup-sandbox/          ← Vite canvas preview server
lib/                       ← shared TypeScript libraries
scripts/                   ← utility scripts
attached_assets/           ← product docs (implementation plan, pitch deck)
```

---

## Core architecture decisions

| Decision | Reason |
|---|---|
| AsyncStorage only (no backend) | Zero infra for MVP; validate retention before scaling |
| Content in `data/curriculum.ts` | Single source of truth; easy to review, diff, and extend |
| Exercise types as a union (`MULTIPLE_CHOICE \| WORD_ORDER`) | Add new types by extending the union + adding a renderer in `ExerciseView.tsx` |
| Expo Router v6 file-based routing | Typed routes, deep-link-ready, easy to extend with new screens |
| pnpm workspaces monorepo | Shared types between app and future API without duplication |
| `useColors()` hook over hardcoded values | Single palette swap for dark mode or new brand |

---

## Team roles (3-contributor model)

| Role | Focus |
|---|---|
| **Contributor 1 — Mobile/UI** | Screens, animations, ExerciseView, onboarding flow, design tokens |
| **Contributor 2 — Content/Data** | `curriculum.ts` — lessons, exercises, units, badges, mock data |
| **Contributor 3 — QA / Platform** | TypeScript checks, AsyncStorage edge cases, build pipeline, release tags |

Roles rotate. Everyone reviews code — not just writes it.

---

## Getting started locally

```bash
# 1. Clone the repo
git clone <repo-url>
cd indori-wuolingo

# 2. Install dependencies
pnpm install

# 3. Start the Expo dev server
pnpm --filter @workspace/indori-wuolingo run dev

# 4. Open on device
# Scan the QR code with Expo Go (Android) or Camera app (iOS)
# Web preview: http://localhost:20532
```

### Required tools

- Node.js 24+
- pnpm 9+
- Expo Go app (for physical device testing)

### Typecheck

```bash
# Full workspace typecheck
pnpm run typecheck

# App only
pnpm --filter @workspace/indori-wuolingo run typecheck
```

---

## Branch and commit conventions

### Branch naming

```
feature/short-description
fix/short-description
chore/short-description
docs/short-description
refactor/short-description
```

Examples:
- `feature/audio-exercise-type`
- `fix/streak-not-incrementing`
- `chore/update-expo-sdk`
- `docs/content-authoring-guide`

### Commit style (Conventional Commits)

```
feat: add LISTEN_AND_CHOOSE exercise type
fix: prevent hearts going negative on wrong answer
chore: bump expo-haptics to 15.1
docs: add content authoring guide to CONTRIBUTORS
refactor: split curriculum into per-unit files
```

### Merge policy

- **Squash and merge** for most work (keeps history clean)
- **Rebase and merge** if linear history matters for a specific PR
- **Never push directly to `main`**

---

## Pull Request rules

- One issue or one focused unit of work per PR
- Keep PRs small — large PRs slow reviews and create conflicts
- Open a draft PR early for visibility, even before it's ready
- After significant updates, re-request review

### PR description template

```md
## What changed
-

## Why
-

## How I tested it
- [ ] Tested on iOS (Expo Go)
- [ ] Tested on Android (Expo Go)
- [ ] Tested on web (localhost:20532)
- [ ] Ran `pnpm run typecheck` — no errors

## Screenshots or notes
-
```

### Review rules

- At least **1 approval** required before merge
- **2 approvals** for changes to `AppContext.tsx`, `curriculum.ts`, or `_layout.tsx` (shared-core)
- Reviewer comments should be direct and specific
- Do not self-merge changes that affect shared state or navigation

---

## How to add a new exercise type

1. **Define the type** in `data/curriculum.ts`:
   ```typescript
   export interface ListenAndChooseExercise {
     id: string;
     type: 'LISTEN_AND_CHOOSE';
     audioUrl: string;
     options: string[];
     correctIndex: number;
   }
   // Add to the Exercise union:
   export type Exercise = MultipleChoiceExercise | WordOrderExercise | ListenAndChooseExercise;
   ```

2. **Add a renderer** in `components/ExerciseView.tsx`:
   ```typescript
   // Add a new component and add a branch in the switch/if block
   if (exercise.type === 'LISTEN_AND_CHOOSE') {
     return <ListenAndChooseView exercise={exercise} onAnswer={onAnswer} />;
   }
   ```

3. **Add exercises to lessons** in `data/curriculum.ts` using the new type.

4. **Typecheck** — `pnpm run typecheck` must pass before opening a PR.

---

## How to add new lessons or units

All lesson content lives in `artifacts/indori-wuolingo/data/curriculum.ts`.

### Adding a lesson to an existing unit

```typescript
{
  id: 'u1l5',                    // unit1, lesson5 — keep IDs sequential
  title: 'Colors',               // English title
  titleHindi: 'रंग',              // Devanagari
  iconName: 'color-palette',     // Ionicons name
  xpReward: 15,                  // XP given on first completion
  exercises: [
    {
      id: 'u1l5e1',
      type: 'MULTIPLE_CHOICE',
      prompt: 'Laal',
      promptScript: 'लाल',
      promptTranslit: 'Laal',
      options: ['Red', 'Blue', 'Green', 'Yellow'],
      correctIndex: 0,
    },
    // ...more exercises
  ],
}
```

### Adding a new unit

```typescript
{
  id: 'unit6',
  title: 'Health',
  titleHindi: 'स्वास्थ्य',
  description: 'Body, illness, and wellness phrases',
  color: '#7C3AED',              // unique color per unit
  lessons: [ /* ... */ ],
}
```

### Content rules

- Each lesson should have **5–8 exercises** (keeps sessions under 5 minutes)
- Mix `MULTIPLE_CHOICE` and `WORD_ORDER` types per lesson
- Include `promptScript` (Devanagari) and `promptTranslit` (romanization) where relevant
- Exercise IDs must be globally unique: `u{unit}l{lesson}e{exercise}` format
- Add a `hint` field on `MULTIPLE_CHOICE` exercises for cultural or grammatical context

---

## How to add a new language track

The content model is already separated from app logic. To add a new language (e.g. Marathi):

1. Create `data/curriculum-marathi.ts` with the same shape as `curriculum.ts`
2. Add `'marathi'` to the language selector in `app/onboarding/language.tsx` (remove `comingSoon: true`)
3. Update `AppContext.tsx` to load the correct curriculum based on `userProfile.targetLanguage`
4. Add color tokens for new unit colors if needed in `constants/colors.ts`

---

## Gamification rules (don't break these)

| Rule | Where it lives |
|---|---|
| Hearts max = 5; restore +1 on lesson complete | `AppContext.tsx → completeLesson` |
| Streak increments only if studied on consecutive days | `AppContext.tsx → checkAndUpdateStreak` |
| Badge conditions (XP thresholds, lessons required, streak) | `data/curriculum.ts → BADGES` + `AppContext.tsx → computeBadges` |
| Weekly XP resets Sunday midnight | `AppContext.tsx` (weekly XP key tracked with `weeklyXpResetDate`) |
| First lesson in each unit unlocked when previous unit complete | `AppContext.tsx → useUnlockedLessons` |

---

## Branch protection (recommended GitHub settings)

Protect `main` with:
- ✅ Require pull request before merging
- ✅ Require at least 1 approval
- ✅ Require status checks to pass (typecheck CI)
- ✅ No direct pushes
- ✅ Delete head branches after merge

---

## Things to avoid

- Direct pushes to `main`
- Huge PRs with unrelated changes
- Hardcoded colors or font sizes (use `useColors()` and `Inter_*` fonts)
- Adding console.log in production code (use `req.log` in server routes)
- Changing exercise IDs in existing lessons (breaks progress tracking)
- Publishing new lessons without running `pnpm run typecheck`
- Keeping local work without a draft PR open for more than 2 days

---

## What was built (MVP status as of v0.1)

| Feature | Status |
|---|---|
| Onboarding (welcome → language → goals) | ✅ Done |
| 5 units, 11 lessons, 66+ exercises | ✅ Done |
| MULTIPLE_CHOICE exercise type | ✅ Done |
| WORD_ORDER exercise type | ✅ Done |
| Hearts, XP, streaks | ✅ Done |
| Badge system | ✅ Done |
| Lesson path with lock/unlock | ✅ Done |
| Lesson complete celebration screen | ✅ Done |
| Spaced repetition review tab | ✅ Done |
| Leaderboard (mock data) | ✅ Done |
| Profile + progress dashboard | ✅ Done |
| AsyncStorage persistence | ✅ Done |
| Audio / listen exercise type | ⬜ Not started |
| Push notifications | ⬜ Not started |
| Real leaderboard (backend) | ⬜ Not started |
| Marathi / Tamil tracks | ⬜ Not started |
| Script tracing exercises | ⬜ Not started |
| Admin content console | ⬜ Not started |

---

## Product principles (from the implementation plan)

> These are the values every code and content change should be measured against.

- **Mobile first** — every core activity should feel fast and natural on a phone
- **Habit driven** — streaks, reminders, and rewards reinforce daily use
- **Beginner friendly** — lessons assume zero prior language knowledge
- **Localized** — examples use Indian names, places, food, and daily speech
- **Scalable** — content is modular so new languages add without rebuilding the app

---

## Success metrics (what we're optimizing for)

- **D1 / D7 / D30 retention** — do learners come back?
- Lessons completed per active user
- Streak continuation rate
- Percentage of users finishing Unit 1
- Average daily study minutes

---

*Questions? Open an issue. Decisions that affect the repo should be written in issues, not private chat.*
