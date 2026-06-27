# Contributor Guide — Indori-Wuolingo

> **Indori-Wuolingo** is a Duolingo-style mobile app for learning Indian languages.  
> First track: **English → Hindi**. Built with Expo SDK 54, React Native, TypeScript, and pnpm workspaces.

Welcome. This folder contains everything you need to contribute — from setting up your machine to getting your name in the contributors list.

---

## Guide index

| File | What it covers |
|---|---|
| [01-getting-started.md](./01-getting-started.md) | Install tools, clone, run the app locally |
| [02-project-structure.md](./02-project-structure.md) | Repo map, key files, how everything connects |
| [03-how-to-contribute.md](./03-how-to-contribute.md) | Step-by-step: issue → branch → PR → merge |
| [04-branching-strategy.md](./04-branching-strategy.md) | Branch naming, trunk-based flow, merge policy |
| [05-commit-conventions.md](./05-commit-conventions.md) | Commit format, examples, what to avoid |
| [06-pull-request-guide.md](./06-pull-request-guide.md) | PR template, size rules, review checklist |
| [07-adding-content.md](./07-adding-content.md) | Add lessons, units, badges to `curriculum.ts` |
| [08-adding-exercise-types.md](./08-adding-exercise-types.md) | Extend the exercise engine with new types |
| [09-adding-languages.md](./09-adding-languages.md) | Add a new Indian language track |
| [10-gamification-rules.md](./10-gamification-rules.md) | Hearts, XP, streaks, badges — don't break these |
| [11-code-style.md](./11-code-style.md) | TypeScript conventions, component patterns |
| [12-testing-checklist.md](./12-testing-checklist.md) | Manual test steps before every PR |
| [13-roles-and-responsibilities.md](./13-roles-and-responsibilities.md) | The 3-role model, how to get added as a contributor |
| [14-audit-and-merge-process.md](./14-audit-and-merge-process.md) | How every branch is audited, CI-gated, reviewed, and merged into `main` |

---

## TL;DR for new contributors

```bash
git clone <repo-url>
pnpm install
pnpm --filter @workspace/indori-wuolingo run dev
# scan the QR with Expo Go or open http://localhost:20532
```

Then read [01-getting-started.md](./01-getting-started.md) and [03-how-to-contribute.md](./03-how-to-contribute.md).

---

## Quick links

- **App entry point:** `artifacts/indori-wuolingo/`
- **All lesson content:** `artifacts/indori-wuolingo/data/curriculum.ts`
- **Global state:** `artifacts/indori-wuolingo/contexts/AppContext.tsx`
- **Exercise renderer:** `artifacts/indori-wuolingo/components/ExerciseView.tsx`
- **Deploy configs:** `vercel.json`, `netlify.toml` (both at project root)
