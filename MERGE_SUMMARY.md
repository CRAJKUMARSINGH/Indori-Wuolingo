# Indori-Wuolingo Unified Merge Summary

## Executive summary

The 13 public repositories are best treated as one evolving product family, not as competing implementations. The final product should keep the recognizable umbrella name **Indori-Wuolingo** for the repository and public story, while using **IndiLingo** as the shorter app/product name inside UI. If a stronger final name is wanted later, use **BhashaPath** for a more enterprise-safe brand; for now, Indori-Wuolingo has the most continuity.

The recommended baseline is:

- **Primary repo shell:** `Indori-Wuolingo`
- **Best runnable web/product donor:** `Indore10/artifacts/indilingo`
- **Best exercise/curriculum donor:** `Indore10`, with `Indore09` as the bridge for earlier exercise expansion
- **Best native/mobile donor:** `Indore09/artifacts/indori-wuolingo/artifacts/indori-wuolingo`
- **Best contributor/process docs:** `Indori-Wuolingo/docs/contributing`, `Indore03`, and `Indore04`
- **Best PWA/deployment direction:** primary `Indori-Wuolingo` plus Netlify/Vercel configs from later repos

## What I inspected

Local clones were created under `work/repos` for:

- `Indori-Wuolingo`
- `Indore01` through `Indore12`

High-signal files:

- `Indore10/artifacts/indilingo/src/components/exercise-player.tsx`
- `Indore10/scripts/src/seed-indilingo.ts`
- `Indore10/lib/db/src/schema/*`
- `Indore10/README.md`
- `Indore10/replit.md`
- `Indore12/artifacts/indilingo/public/indori-repo-merger.html`
- `Indori-Wuolingo/docs/contributing/*`
- `Indori-Wuolingo/PLANNING NOTES/*`

## Merge decisions

| Area | Decision | Source repos |
|---|---|---|
| Workspace | pnpm monorepo with shared TypeScript config | all later repos |
| Web app | Vite + React + Tailwind + Framer Motion | Indore10 |
| Mobile app | Expo app using shared curriculum/client packages | Indore09 native artifacts |
| API | Express/OpenAPI-first API with generated React Query client and Zod schemas | Indori-Wuolingo, Indore10 |
| DB | Drizzle schema for users, languages, units, lessons, exercises, progress, mistakes | Indore10 |
| Curriculum | Extract seed data into shared package and keep DB seeding as adapter | Indore10 |
| Exercise player | One shared player across lesson and review modes | Indore10, corrected here |
| match_pairs | Two-column UI with stable pair IDs and deterministic validation | Indore09/10 specs, corrected here |
| Hearts | MVP soft hearts: track mistakes and display hearts, but do not block progress | explicit handoff requirement |
| PWA | Add `vite-plugin-pwa` with offline shell and seed-data cache | handoff requirement |
| Robotic QA | 21 personas x 15 languages x all lessons, offline by default with optional API mode | handoff requirement |

## Critical fix: match_pairs seed/player alignment

Problem found in the donor player: `match_pairs` currently treats all options as a single shuffled bag and checks JSON `correctAnswer` by inclusion. That allows wrong alignments when duplicate strings exist and does not render the required polished two-column "Match it" UI.

Unified contract:

```ts
type MatchPairsExercise = {
  type: "match_pairs";
  prompt: string;
  pairs: Array<{
    id: string;
    left: string;
    right: string;
  }>;
  options: string[];       // legacy fallback only
  correctAnswer: string;   // JSON.stringify(pairs) for generated clients
};
```

Player rule:

- Render `left` and `right` arrays in two columns.
- Shuffle only the right column, not the pair identity.
- Match by stable `pair.id`, not text inclusion.
- Consider the exercise complete when all `pair.id`s are matched.
- Keep failures local to the exercise in soft-hearts mode.

## Soft hearts decision

For MVP, hearts are **soft**:

- Wrong answers decrement the displayed session heart count down to 0.
- Wrong answers still record mistakes for review.
- A learner with 0 hearts can continue the lesson.
- Strict mode later can flip `strictHearts: true` to block or pause lessons.

This preserves flow for early content validation and robotic QA. It also avoids punishing beginners while the seed content is still being normalized.

## Deliverables in this output bundle

- `README.md` - investor/contributor-ready project README
- `landing-page.html` - deployable responsive landing page
- `PRODUCTION_SKELETON.md` - workspace, code contracts, PWA, and test skeleton
- `INDORE10_MIGRATION_GUIDE.md` - exact Indore10 donor migration guide
- `INDORE10_COPY_PLAN.ps1` - editable PowerShell copy plan for staging Indore10 into the final repo
- `APPLY_TO_UPDATED_REPO.md` - commands tailored to the current updated local `Indori-Wuolingo` clone
- `ACTION_PLAN_52_WEEKS.md` - detailed year roadmap
- `docs/SOFT_HEARTS.md` - current and future hearts behavior
- `docs/ROBOTIC_TEST_SUITE.md` - full robotic QA plan and sample output
