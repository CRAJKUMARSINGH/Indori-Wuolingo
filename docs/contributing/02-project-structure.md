# 02 · Project Structure

A map of the repository and the role each file and folder plays.

---

## Monorepo overview

```
indori-wuolingo/                ← repository root
├── artifacts/                  ← deployable applications
│   ├── indori-wuolingo/        ← the Expo mobile + web app  ← main product
│   ├── api-server/             ← Express API server (future backend)
│   └── mockup-sandbox/         ← Vite canvas component preview server
├── lib/                        ← shared TypeScript libraries
├── scripts/                    ← repo-level utility scripts
├── docs/
│   └── contributing/           ← you are here
├── attached_assets/            ← product docs, pitch deck, implementation plan
├── vercel.json                 ← Vercel deployment config
├── netlify.toml                ← Netlify deployment config
├── CONTRIBUTORS.md             ← top-level contributor guide
├── pnpm-workspace.yaml         ← workspace package discovery
└── package.json                ← root dev tooling (TypeScript, ESLint, etc.)
```

---

## The Expo app — `artifacts/indori-wuolingo/`

This is the main product. Everything users see and do lives here.

```
artifacts/indori-wuolingo/
├── app/                        ← all screens (Expo Router file-based routing)
│   ├── index.tsx               ← entry: redirects to onboarding OR tabs
│   ├── _layout.tsx             ← root layout: providers, fonts, navigation stacks
│   ├── onboarding/
│   │   ├── _layout.tsx         ← stack with gesture disabled (can't swipe back)
│   │   ├── welcome.tsx         ← screen 1: app intro + "Get Started"
│   │   ├── language.tsx        ← screen 2: pick language + enter name
│   │   └── goals.tsx           ← screen 3: daily goal + proficiency → complete onboarding
│   ├── (tabs)/
│   │   ├── _layout.tsx         ← tab bar (NativeTabs on iOS 26, ClassicTabs otherwise)
│   │   ├── index.tsx           ← Home: lesson path, streak/XP header, daily goal card
│   │   ├── review.tsx          ← Practice: weak words + spaced repetition
│   │   ├── leaderboard.tsx     ← Weekly XP ranking with podium
│   │   └── profile.tsx         ← Stats, badges, course progress, reset
│   └── lesson/
│       ├── _layout.tsx         ← stack, no header, gesture disabled in lesson
│       ├── [lessonId].tsx      ← lesson player: progress bar, hearts, exercises
│       └── complete.tsx        ← celebration screen with XP animation
│
├── components/
│   ├── ExerciseView.tsx        ← renders MULTIPLE_CHOICE and WORD_ORDER exercises
│   └── ErrorBoundary.tsx       ← top-level React error boundary
│
├── contexts/
│   └── AppContext.tsx          ← ALL global state (profile, progress, XP, streak)
│                                  persisted to AsyncStorage
│                                  exports: AppProvider, useAppContext, useUnlockedLessons
│
├── data/
│   └── curriculum.ts           ← SOURCE OF TRUTH for all lesson content
│                                  CURRICULUM: Unit[] — 5 units, 11 lessons, 66+ exercises
│                                  BADGES: Badge[]
│                                  LEADERBOARD_MOCK: LeaderboardEntry[]
│                                  getLessonById(), getUnitForLesson()
│
├── constants/
│   └── colors.ts               ← design tokens: primary indigo, saffron accent, etc.
│
├── hooks/
│   └── useColors.ts            ← reads device color scheme, returns full palette + radius
│
├── assets/
│   └── images/
│       └── icon.png            ← app icon (Devanagari ह on deep purple)
│
├── public/
│   └── _redirects              ← Netlify SPA fallback
│
├── app.json                    ← Expo app config (scheme, icon, web bundler)
├── package.json                ← app-level dependencies and scripts
└── tsconfig.json               ← TypeScript config (extends workspace base)
```

---

## Key data flows

### Onboarding → App

```
welcome.tsx
  └─→ language.tsx  (saves name to AsyncStorage key: iw_onboarding_name)
        └─→ goals.tsx  (reads name, calls completeOnboarding() in AppContext)
              └─→ /(tabs)/index.tsx
```

### Lesson flow

```
(tabs)/index.tsx  (lesson node tap)
  └─→ lesson/[lessonId].tsx  (loads exercises from curriculum.ts)
        └─→ ExerciseView.tsx  (per-exercise UI + onAnswer callback)
              └─→ lesson/complete.tsx  (calls completeLesson() in AppContext)
                    └─→ /(tabs)/index.tsx
```

### State persistence

```
AppContext.tsx
  ├─ reads from AsyncStorage on mount (iw_user_profile, iw_user_progress)
  ├─ writes on every completeLesson() call
  └─ exposes: userProfile, progress, completeOnboarding, completeLesson, resetOnboarding
```

---

## Source of truth files

If you need to understand how something works, start here:

| Question | File to read |
|---|---|
| What lessons exist? | `data/curriculum.ts` |
| How is XP calculated? | `contexts/AppContext.tsx → completeLesson` |
| How are lessons unlocked? | `contexts/AppContext.tsx → useUnlockedLessons` |
| What colors are in the design? | `constants/colors.ts` |
| How does an exercise render? | `components/ExerciseView.tsx` |
| What routes exist? | `app/` folder structure |
