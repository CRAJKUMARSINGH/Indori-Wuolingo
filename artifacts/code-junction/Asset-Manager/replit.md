# Indori-Wuolingo

A mobile-first gamified Indian language learning app (English → Hindi), inspired by Duolingo, with short lessons, streaks, XP, script learning, and spaced repetition review.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo (React Native) with expo-router
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (not yet used by mobile app)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- State: AsyncStorage (local persistence), React Context

## Where things live

- `artifacts/indori-wuolingo/` — the Expo mobile app
- `artifacts/indori-wuolingo/data/curriculum.ts` — all lesson content (source of truth for exercises/units/lessons)
- `artifacts/indori-wuolingo/context/UserContext.tsx` — user profile & onboarding state
- `artifacts/indori-wuolingo/context/ProgressContext.tsx` — XP, streaks, completed lessons, badges
- `artifacts/indori-wuolingo/constants/colors.ts` — design tokens (saffron/green palette)
- `artifacts/indori-wuolingo/app/(tabs)/` — learn, practice, profile tabs
- `artifacts/indori-wuolingo/app/lesson/[id].tsx` — lesson exercise runner
- `artifacts/indori-wuolingo/app/lesson/complete.tsx` — lesson completion screen
- `artifacts/indori-wuolingo/app/onboarding.tsx` — 3-step onboarding flow
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Architecture decisions

- **Frontend-only MVP**: All persistence via AsyncStorage, no backend needed for v1. Add backend when multi-device sync or social features are needed.
- **curriculum.ts as content CMS**: All lesson/exercise data lives in a single typed file. Adding a new language = adding a new `Unit[]` export. Designed to be extracted to a backend CMS later.
- **Context for shared state**: `UserContext` + `ProgressContext` wrap the app in `_layout.tsx`. Both contexts persist to AsyncStorage on every change.
- **Color palette**: Saffron orange (#FF6B35) + forest green (#138808) — directly inspired by the Indian flag. Units use different accent colors to visually distinguish progress.
- **No backend for lessons**: Lesson engine is fully client-side. This avoids latency and keeps the app usable offline from day one.

## Product

- **Onboarding**: 3-step flow — welcome screen, name entry, daily goal selection (5/10/15/20 min/day)
- **Learn tab**: Duolingo-style vertical lesson path with saffron/green unit headers, locked/unlocked/completed states, XP chips per lesson
- **Lesson runner**: Exercise-by-exercise flow with 4-option MCQ, instant green/red feedback, haptic feedback, heart-loss on error, shake animation on wrong answer
- **Lesson complete**: Trophy/star screen with XP earned, hearts remaining, badge unlock notifications
- **Practice tab**: Quick 6-question vocabulary quiz (translate to Hindi) + vocabulary reference list + accuracy score
- **Profile tab**: Avatar, level + XP progress bar, 4 stat cards (lessons/streak/minutes/badges), achievement badges grid, daily goal display
- **Content**: 3 units (Namaste!, Numbers, Family), 7 lessons, 45+ exercises with Hindi Devanagari script

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do NOT restart the Expo workflow for code-only changes — Metro HMR handles it automatically. Only restart when adding packages or hitting a Metro error.
- The curriculum.ts file is the single source of truth for content. Updating lessons/exercises there automatically flows through to all screens.
- Workflow name for restart: `artifacts/indori-wuolingo: expo`
- AsyncStorage keys: `@wuolingo_user` (profile), `@wuolingo_progress` (XP/streak/badges)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `expo` skill for mobile development guidelines
