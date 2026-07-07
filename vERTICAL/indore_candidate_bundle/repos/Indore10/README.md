# IndiLingo (Indore10)

**Learn 15 Indian regional languages — starting from the very first letter.**

IndiLingo is a Duolingo-style language-learning web app built for heritage learners and curious beginners. Unlike most Indian-language apps, it never assumes you can already read the script. Every language starts with interactive alphabet/script lessons before any vocabulary — so a complete beginner can go from knowing zero characters to reading simple words in their first session.

---

## Live Demo

> Deploy this project on Replit and the link appears here.

---

## Features

### 15 Indian Regional Languages

Each language includes its native name, script name, and a full learning path:

| Language | Native Name | Script |
|---|---|---|
| Hindi | हिन्दी | Devanagari |
| Marathi | मराठी | Devanagari |
| Bengali | বাংলা | Bengali Script |
| Gujarati | ગુજરાતી | Gujarati Script |
| Tamil | தமிழ் | Tamil Script |
| Telugu | తెలుగు | Telugu Script |
| Punjabi | ਪੰਜਾਬੀ | Gurmukhi |
| Malayalam | മലയാളം | Malayalam Script |
| Kannada | ಕನ್ನಡ | Kannada Script |
| Odia | ଓଡ଼ିଆ | Odia Script |
| Assamese | অসমীয়া | Assamese Script |
| Urdu | اردو | Nastaliq (Perso-Arabic) |
| Kashmiri | कॉशुर | Devanagari / Nastaliq |
| Nepali | नेपाली | Devanagari |
| Sindhi | سنڌي | Perso-Arabic / Devanagari |

---

### Script & Alphabet Lessons ("How to Spell")

Every language begins with a **Script & Alphabet** unit before any vocabulary content. Users learn to read and write the script through interactive exercises — no prior knowledge of the script is assumed.

- **Hindi**: 6 alphabet lessons covering all major vowels (अ आ इ ई उ ऊ ए ओ) and consonant groups (क ख ग घ / च छ ज झ / त थ द न / प म स र).
- **All other languages**: 2 alphabet lessons covering 8 key characters with romanized pronunciation guides.

#### Script Practice Exercise (new exercise type)
The `script_practice` exercise teaches one character at a time in two question modes:

1. **Romanization → Script**: Given the romanized pronunciation (e.g. *"ka — K sound"*), choose the correct native-script character from 4 options. Characters are displayed at extra-large size like a calligraphy card.
2. **Script → Romanization**: Given the native character (e.g. *"क"*), choose the correct romanized pronunciation from 4 options.

---

### Learning Path (4 Units per Language)

| Unit | Type | Contents |
|---|---|---|
| 1. Script & Alphabet | Script | Character recognition, romanization |
| 2. Greetings & Phrases | Phrases | Hello, thank you, yes/no, how are you |
| 3. Numbers | Vocabulary | 1–10 in native script with romanization |
| 4. Food & Daily Life | Vocabulary | Water, rice, bread, milk, tea, and more |

---

### 5 Exercise Types

| Type | Description |
|---|---|
| `script_practice` | Learn individual script characters with romanization hints |
| `multiple_choice` | Choose the correct translation from 4 options |
| `translate` | See a native word and pick the correct English meaning |
| `fill_blank` | Fill in the missing word in a sentence |
| `match_pairs` | Match words in two columns (2-column grid UI) |

---

### Gamification

- **XP (Experience Points)** — earned by completing lessons; full XP on first pass, 25% bonus for star improvements, zero on replays (server-enforced, not client-trusted)
- **Streak** — daily login streak tracked and displayed
- **Hearts** — 5 hearts per session; lose one on a wrong answer
- **Stars (0–3)** — awarded per lesson based on accuracy (100% = 3 stars, ≥70% = 2, >0% = 1)
- **Achievement Badges** — unlocked by milestones:
  - First Steps (complete 1 lesson)
  - Century Club (reach 100 XP)
  - On Fire (7-day streak)
  - Rocket Learner (reach 500 XP)
  - Champion (reach 1000 XP)

---

### Spaced-Repetition Review

When a learner answers incorrectly during a lesson, that exercise is queued for review. The **Review** tab resurfaces the top 10 missed exercises ordered by miss count and recency. Correctly answering in review removes it from the queue (mastered). This is the core mechanic from the Indore08 repo's review-memory concept.

---

### Leaderboard

- Podium display for top 3 learners (gold / silver / bronze tiers)
- Full ranked list below for positions 4–20
- Ranked by total XP

---

### Profile Page

- Name, XP, streak, hearts
- Per-language progress bars (lessons completed / total lessons)
- Achievement badge grid with locked/unlocked states

---

### No Login Required

Learners enter only their name on first visit. A profile is created automatically and the user ID is stored in the browser (Zustand + localStorage). No account, no password, no friction.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Routing | Wouter |
| State | Zustand (persisted to localStorage) |
| Data fetching | TanStack Query (React Query v5) |
| UI components | Radix UI primitives + shadcn/ui |
| Backend | Express 5 (Node.js 24) |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod v4 + drizzle-zod |
| API codegen | Orval (OpenAPI → React Query hooks + Zod schemas) |
| Build | esbuild (server), Vite (client) |
| Monorepo | pnpm workspaces, TypeScript 5.9 |

---

## Project Structure

```
indilingo/
├── artifacts/
│   ├── api-server/          # Express API server
│   │   └── src/routes/      # languages, units, lessons, users, leaderboard, review
│   └── indilingo/           # React + Vite frontend
│       └── src/
│           ├── pages/       # home, learn, lesson, leaderboard, profile, review, onboarding
│           ├── components/  # exercise-player, layout, ui/
│           └── lib/store.ts # Zustand store (userId, selectedLanguageId)
├── lib/
│   ├── api-spec/
│   │   └── openapi.yaml     # Single source of truth for all API contracts
│   ├── api-client-react/    # Generated React Query hooks (do not edit)
│   ├── api-zod/             # Generated Zod validation schemas (do not edit)
│   └── db/src/schema/       # Drizzle table definitions
│       ├── languages.ts     # 15 languages with scriptName, colorTheme
│       ├── units.ts         # unitType: script | vocabulary | phrases | conversation
│       ├── lessons.ts
│       ├── exercises.ts     # type enum includes script_practice; romanization + nativeScript fields
│       ├── users.ts
│       ├── lessonProgress.ts
│       └── exerciseMistakes.ts  # spaced-repetition queue
└── scripts/src/
    └── seed-indilingo.ts    # Seeds all 15 languages with alphabet + vocab content
```

---

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 10+
- PostgreSQL database (set `DATABASE_URL` env var)

### Install

```bash
pnpm install
```

### Push database schema

```bash
pnpm --filter @workspace/db run push
```

### Seed the database

```bash
pnpm --filter @workspace/scripts run seed-indilingo
```

This seeds all 15 languages with script/alphabet lessons, greetings, numbers, and food vocabulary. Safe to re-run (uses upsert).

### Run development servers

```bash
# API server (port set by PORT env var, proxied at /api)
pnpm --filter @workspace/api-server run dev

# Frontend (port set by PORT env var, proxied at /)
pnpm --filter @workspace/indilingo run dev
```

### Typecheck everything

```bash
pnpm run typecheck
```

### Regenerate API client after spec changes

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/healthz` | Health check |
| POST | `/api/users` | Create learner profile |
| GET | `/api/users/:userId` | Get user profile |
| GET | `/api/users/:userId/stats` | XP, streak, per-language progress, badges |
| GET | `/api/languages` | List all 15 languages |
| GET | `/api/languages/:langId/units/:userId` | Units with lessons and user progress |
| GET | `/api/lessons/:lessonId` | Lesson with exercises |
| POST | `/api/lessons/:lessonId/complete` | Submit results; awards XP idempotently |
| GET | `/api/leaderboard` | Top 20 learners by XP |
| POST | `/api/exercises/:exerciseId/mistake` | Record a missed exercise |
| POST | `/api/exercises/:exerciseId/master` | Remove exercise from review queue |
| GET | `/api/users/:userId/review` | Get top-10 spaced-repetition review queue |

**Note:** `POST /lessons/:lessonId/complete` is server-authoritative — it derives the exercise total from the database and awards XP idempotently (full XP on first completion, 25% bonus for star improvements, zero on replays).

---

## Design

- **Palette**: deep teal primary, saffron secondary, rangoli pink accent, terracotta destructive — inspired by Indian festival colors
- **Typography**: Fraunces serif for headings, Outfit sans-serif for UI
- **Animations**: Framer Motion staggered list entrances, XP burst on lesson completion, smooth page transitions
- **Layout**: Sidebar navigation on desktop, bottom tab bar on mobile

---

## Inspiration & Source Repos

This project synthesizes ideas from 10 public repos under the [CRAJKUMARSINGH](https://github.com/CRAJKUMARSINGH) organization:

| Repo | Idea borrowed |
|---|---|
| Indori-Wuolingo | Brand identity, umbrella concept |
| Indore02 | Backend/API contract patterns |
| Indore03 | Mobile lesson UX flow |
| Indore04 | Podium-style leaderboard |
| Indore07 | Web quality/analytics patterns |
| Indore08 | Offline state, spaced-repetition review concept, achievement badges |
| Indore09 | Expanded exercise types (fill_blank, match_pairs) |

---

## License

MIT


## Indore Series

This repo is part of the `Indore01` → `Indore12` public series. If you want the cleanest “candidate view”, pin:

- `Indore12` (final / deploy-ready)
- `Indori-Wuolingo` (original dialect product)
