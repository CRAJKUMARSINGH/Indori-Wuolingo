# Contributing to Indori-Wuolingo

Welcome to the team. This guide is written for all three contributors working remotely and asynchronously. Read it once, refer back as needed.

---

## Who does what

| Role | Responsibilities |
|---|---|
| Contributor 1 — Frontend & UI | Screens, components, navigation, animations, onboarding flows |
| Contributor 2 — Content & Logic | Curriculum data, exercise types, progress logic, context/state |
| Contributor 3 — QA, Infra & Releases | Bug fixes, dependency updates, testing, release tagging, CI |

These roles are guidelines, not strict boundaries. Anyone can open a bug fix or review any PR. The important rule is that no one self-merges their own significant changes.

---

## Getting started

### Prerequisites

- Node.js 24 or later
- pnpm 10 or later (`npm install -g pnpm`)
- Expo Go app on your phone (iOS or Android) for live testing

### First-time setup

```bash
git clone <repo-url>
cd indori-wuolingo
pnpm install
```

### Running the app locally

```bash
pnpm --filter @workspace/indori-wuolingo run dev
```

Scan the QR code in the terminal with Expo Go to open on your phone.

For web preview:

```bash
# The dev server also serves a web build at localhost
# Open your browser at the URL printed in the terminal
```

### Running the API server (if needed)

```bash
pnpm --filter @workspace/api-server run dev
```

---

## Before you start any work

1. Check the issue board for open and assigned issues.
2. If no issue exists for your planned change, create one and briefly describe the problem or feature.
3. Assign the issue to yourself.
4. Create a branch from `main`.

---

## Branch naming

Use one of these patterns:

```
feature/short-description
fix/short-description
content/short-description
chore/short-description
docs/short-description
```

Examples:

```
feature/speaking-exercise
fix/streak-not-resetting
content/unit4-food-lessons
chore/upgrade-expo-sdk
docs/contributing-guide
```

---

## Commit style

Each commit should have one clear purpose. Use this format:

```
type: short description
```

Types:

| Type | When to use |
|---|---|
| `feat` | New feature or screen |
| `fix` | Bug fix |
| `content` | New or updated lesson content in curriculum.ts |
| `refactor` | Code cleanup with no behavior change |
| `chore` | Dependency updates, build config |
| `docs` | Documentation only |
| `test` | Tests only |

Examples:

```
feat: add speaking exercise type to lesson runner
fix: prevent XP doubling when lesson is replayed
content: add unit 4 food and drink lessons
chore: upgrade expo-router to latest
docs: add review and merge guide
```

---

## Content changes (curriculum.ts)

All lesson content lives in `artifacts/indori-wuolingo/data/curriculum.ts`. This is the single source of truth for units, lessons, and exercises.

When adding or editing content:

- Follow the existing `Unit`, `Lesson`, and `Exercise` type structure exactly.
- Include all required fields: `id`, `type`, `question`, `options`, `correct`.
- Use unique IDs following the existing pattern (e.g. `u4l1e1` for Unit 4, Lesson 1, Exercise 1).
- Add a `hint` field for exercises where context helps the learner.
- Test the lesson in the app before opening a PR. Run through every exercise manually.
- Use correct Devanagari script for all Hindi text. Verify with a native speaker or reference dictionary when unsure.

---

## Local checks before opening a PR

Run these commands before pushing:

```bash
# Type check the full workspace
pnpm run typecheck

# Check only the mobile app
pnpm --filter @workspace/indori-wuolingo run typecheck

# Check only the API server
pnpm --filter @workspace/api-server run typecheck
```

Also manually test any screen or flow you changed on at least one device (phone preferred, web acceptable for logic-only changes).

---

## Opening a Pull Request

1. Push your branch to GitHub.
2. Open a PR against `main`.
3. Use the PR template in `contrib/pull_request_template.md`.
4. Request review from at least one other contributor.
5. Do not merge your own PR.

Keep PRs focused. One issue per PR. If you have two unrelated changes, open two PRs.

---

## What makes a good PR

- Solves exactly one issue
- Has a clear title that describes the change
- Explains why the change was needed, not just what changed
- Notes how you tested it
- Stays small when possible — prefer 200 changed lines over 2000

---

## After your PR is merged

- Close the linked issue.
- Delete your branch.
- Pull the latest `main` before starting your next change.

```bash
git checkout main
git pull origin main
```

---

## Communication

Since the team works remotely and asynchronously:

- Write decisions in GitHub issues or PR comments, not in private chat. This keeps context visible to everyone.
- If you are blocked, comment on the issue and tag the relevant contributor.
- If you find a bug that is not yours to fix, open an issue and label it clearly.
- Do not leave PRs open for more than 3 days without a response. If a review is delayed, ping in the team chat.

---

## What to avoid

- Direct pushes to `main`
- Self-merging significant changes
- PRs that mix multiple unrelated changes
- Leaving broken code on a branch for more than a day without flagging it
- Silent changes to shared files like `curriculum.ts` without an explanation

---

## Questions

If something in this guide is unclear, open a GitHub issue with the label `docs` and describe what needs clarification.
