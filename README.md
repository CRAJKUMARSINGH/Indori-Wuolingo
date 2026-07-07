# Indori-Wuolingo

**Learn Indian languages through Hindi and English, one playful lesson at a time.**

Indori-Wuolingo is a unified, mobile-first language learning platform synthesized from 13 public prototype repositories: `Indori-Wuolingo` plus `Indore01` through `Indore12`. The merged product teaches Hindi-first and English-knowing learners across Beginner, Intermediate, and Expert paths, with script practice, translation, matching, review, XP, streaks, stars, hearts, and offline-ready PWA support.

The app name can be shortened to **IndiLingo** in product surfaces while the repository keeps **Indori-Wuolingo** for continuity.

## Why this exists

India has extraordinary language diversity, but many learners need a bridge that starts from what they already know: Hindi, English, or both. Indori-Wuolingo turns that bridge into a gamified learning path for Indian regional languages, beginning with script confidence and growing into vocabulary, phrases, listening, speaking, and community content.

## Learner paths

| Path | Designed for | Experience |
|---|---|---|
| Beginner | Learners new to the script and language | Script-first units, romanization, slow feedback, soft hearts, everyday phrases |
| Intermediate | Learners who know basics but need fluency | Mixed exercise types, review queue, stronger grammar patterns, streak goals |
| Expert | Heritage speakers, exam learners, and advanced users | Dense practice, strict mode option, content packs, leaderboard, deeper cultural modules |

## Core features

- 15-language curriculum foundation: Hindi, Marathi, Bengali, Gujarati, Tamil, Telugu, Punjabi, Malayalam, Kannada, Odia, Assamese, Urdu, Kashmiri, Nepali, Sindhi
- Script-first learning for languages with unfamiliar writing systems
- Unified `ExercisePlayer` for lesson and review modes
- Five exercise types: `script_practice`, `multiple_choice`, `translate`, `fill_blank`, `match_pairs`
- Fixed two-column "Match it" UI with stable pair alignment
- XP, streaks, stars, soft hearts, badges, and leaderboard foundations
- Mistake tracking and spaced repetition review queue
- PWA shell for offline launch and cached seed lessons
- Expo-ready mobile architecture and Vite web/admin targets
- Replit-friendly project structure and deployment notes

## Technical architecture

```txt
/
|-- apps/
|   |-- web/              # Vite React learner app
|   |-- mobile/           # Expo React Native app
|   |-- admin/            # Vite React admin/content app
|-- packages/
|   |-- api/              # Express/Fastify routes, OpenAPI handlers
|   |-- api-client/       # generated React Query client
|   |-- curriculum/       # language, unit, lesson, exercise seed data
|   |-- db/               # Drizzle schema and migrations
|   |-- exercise-player/  # shared player state and exercise components
|   |-- ui/               # shared components/tokens
|   |-- config/           # TS, ESLint, Tailwind presets
|-- tests/
|   |-- robotic/          # 21 users x 15 languages x all lessons
|   |-- e2e/              # Playwright flows
|-- docs/
|-- scripts/
```

## Quick start: Replit

1. Import the GitHub repo into Replit.
2. Use Node 20+ and pnpm.
3. Run:

```bash
pnpm install
pnpm db:push
pnpm seed
pnpm dev
```

Recommended Replit run command:

```bash
pnpm dev --filter @indori/web
```

## Quick start: local

```bash
corepack enable
pnpm install
pnpm typecheck
pnpm test
pnpm dev
```

Optional mobile:

```bash
pnpm --filter @indori/mobile start
```

## PWA support

The Vite web app should install `vite-plugin-pwa` and cache:

- app shell
- core icons and manifest
- seed curriculum JSON
- last successful lesson API responses

The MVP offline mode validates seed lessons locally. Real API mode remains optional for QA and production.

## Hearts policy

The MVP uses **soft hearts**. Wrong answers decrement a displayed heart count and record mistakes, but learners can continue with infinite retries. Strict hearts can be enabled later for premium challenges, exams, or classroom-controlled sessions.

## Robotic QA

The robotic suite simulates:

- 21 user personas
- 15 languages
- every seeded lesson
- all exercise types
- offline seed mode by default
- optional real API mode with `ROBOTIC_REAL_API=1`

```bash
pnpm test:robotic
pnpm test:robotic -- --language hindi --persona beginner-01
ROBOTIC_REAL_API=1 pnpm test:robotic
```

## Contribution highlights

- `Indore10` contributes the strongest web player, 15-language seed direction, script-first model, and five exercise types.
- `Indore09` contributes earlier expanded exercise and mobile/native ideas.
- `Indori-Wuolingo` contributes umbrella docs, deployment configs, and contributor process.
- `Indore03`/`Indore04` contribute contributor docs and gamification guidance.
- `Indore08` contributes offline/gamified state concepts.

## Indore10 migration

Use `Indore10` as the main code donor. Copy its Vite app, API server, DB schema, OpenAPI packages, generated clients, and seed script into the unified workspace, then patch `match_pairs`, soft hearts, PWA behavior, and curriculum extraction.

See:

- `INDORE10_MIGRATION_GUIDE.md`
- `INDORE10_COPY_PLAN.ps1`
- `APPLY_TO_UPDATED_REPO.md`

## Call to action

This project is ready for contributors who care about Indian languages, education, accessibility, curriculum design, and delightful learning software. Start with `docs/contributing`, pick one language or one exercise type, and help make the learning path deeper.
