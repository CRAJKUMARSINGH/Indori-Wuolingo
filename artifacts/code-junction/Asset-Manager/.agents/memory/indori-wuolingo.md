---
name: Indori-Wuolingo app architecture
description: Key decisions for the Indian language learning Expo app — content model, persistence, workflow name, AsyncStorage keys
---

## Decision: Frontend-only for MVP
All data lives in AsyncStorage. No backend routes needed until multi-device sync or social features are requested. Do NOT provision a database or backend for lesson delivery.

**Why:** Lesson engine is fully client-side, keeps app offline-capable, and avoids latency.

**How to apply:** When user asks for new lesson content, edit `artifacts/indori-wuolingo/data/curriculum.ts` only.

## Decision: curriculum.ts as single content source
All Unit/Lesson/Exercise data is typed and exported from one file. New languages = new Unit entries.

**Why:** Designed to scale to a backend CMS later. Changing this file auto-propagates to all screens.

## Workflow name
`artifacts/indori-wuolingo: expo` — use this exact string with `restart_workflow`.

## AsyncStorage keys
- `@wuolingo_user` — UserProfile (name, dailyGoalMinutes, onboardingComplete, etc.)
- `@wuolingo_progress` — ProgressData (xp, streak, completedLessons, earnedBadges, wordErrors)

## Color palette
- Primary (saffron): #FF6B35, Secondary (green): #138808, Accent (gold): #FFB830
- Unit colors: unit1=#FF6B35, unit2=#138808, unit3=#8A4FFF, unit4=#FFB830
- Background: #FFF9F0 (warm cream)
