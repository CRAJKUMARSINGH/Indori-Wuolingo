# Web Routing Audit

## Active Netlify Web Routes

These routes are wired into the deployed Vite app in `src/App.tsx`.

| Route | Status | Notes |
| --- | --- | --- |
| `/` | live | Home page |
| `/learn` | live | Lesson map |
| `/lesson/:id` | live | Lesson detail |
| `/leaderboard` | live | Rank page |
| `/profile` | live | Profile page |
| `/stats` | live | Stats page |
| `/onboarding/welcome` | live | Added to web router |
| `/onboarding/language` | live | Added to web router |
| `/onboarding/goals` | live | Added to web router |

## Link Map

### Live Links In The Web App

| Source | Target | Status |
| --- | --- | --- |
| `src/components/layout/shell.tsx` | `/` | live |
| `src/components/layout/shell.tsx` | `/learn` | live |
| `src/components/layout/shell.tsx` | `/leaderboard` | live |
| `src/components/layout/shell.tsx` | `/profile` | live |
| `src/components/layout/shell.tsx` | `/stats` | live |
| `src/pages/home.tsx` | `/learn` | live |
| `src/pages/home.tsx` | `/leaderboard` | live |
| `src/pages/home.tsx` | `/onboarding/welcome` | live |
| `src/pages/profile.tsx` | `/onboarding/welcome` | live |
| `src/pages/onboarding/welcome.tsx` | `/` | live |
| `src/pages/onboarding/welcome.tsx` | `/learn` | live |
| `src/pages/onboarding/welcome.tsx` | `/onboarding/language` | live |
| `src/pages/onboarding/language.tsx` | `/onboarding/welcome` | live |
| `src/pages/onboarding/language.tsx` | `/onboarding/goals` | live |
| `src/pages/onboarding/goals.tsx` | `/onboarding/language` | live |
| `src/pages/onboarding/goals.tsx` | `/learn` | live |
| `src/pages/learn.tsx` | `/lesson/:id` | live |

### Unreachable In The Current Netlify Build

These paths exist only in the Expo Router tree under `app/`, so they are not served by the current Vite deployment.

| Source | Target | Status |
| --- | --- | --- |
| `app/index.tsx` | `/onboarding/welcome` | unreachable on Netlify |
| `app/index.tsx` | `/(tabs)` | unreachable on Netlify |
| `app/onboarding/welcome.tsx` | `/onboarding/language` | unreachable on Netlify |
| `app/onboarding/language.tsx` | `/onboarding/goals` | unreachable on Netlify |
| `app/onboarding/goals.tsx` | `/(tabs)` | unreachable on Netlify |
| `app/(tabs)/review.tsx` | `/(tabs)/` | unreachable on Netlify |
| `app/(tabs)/review.tsx` | `/lesson/:id` | unreachable on Netlify |
| `app/(tabs)/index.tsx` | `/lesson/:id` | unreachable on Netlify |
| `app/lesson/complete.tsx` | `/(tabs)/` | unreachable on Netlify |
| `app/lesson/complete.tsx` | `/lesson/:id` | unreachable on Netlify |

## Cleanup List

### Safe Delete Candidates

These files have no detected imports or references in the current repo scan.

- `hooks/useSpeech.ts`
- `components/KeyboardAwareScrollViewCompat.tsx`

### Needs Confirmation Before Delete

These files belong to the inactive Expo route tree. They are not part of the current Netlify build, but they may still matter if you plan to keep the mobile/Expo version.

- `app/_layout.tsx`
- `app/index.tsx`
- `app/+not-found.tsx`
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/index.tsx`
- `app/(tabs)/leaderboard.tsx`
- `app/(tabs)/profile.tsx`
- `app/(tabs)/review.tsx`
- `app/lesson/[lessonId].tsx`
- `app/lesson/complete.tsx`
- `app/onboarding/welcome.tsx`
- `app/onboarding/language.tsx`
- `app/onboarding/goals.tsx`

## Recommendation

- Keep the new web onboarding pages under `src/pages/onboarding`.
- Delete only the safe orphan files immediately if you want a low-risk cleanup.
- Delete the Expo `app/` tree only if you are sure you no longer need the mobile/Expo app.
