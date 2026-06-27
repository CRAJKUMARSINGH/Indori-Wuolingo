# 14 · Branch Audit and Merge Process

How every contributor branch is inspected, validated, and merged into the root `main` branch of Indori-Wuolingo.

Nothing lands in `main` without passing this full gate. No exceptions.

---

## Overview — the full pipeline

```
Contributor branch
        │
        ▼
  ┌─────────────────────────────────┐
  │  1. Pre-merge self-audit        │  ← contributor's own responsibility
  │     (checklist before PR)       │
  └────────────────┬────────────────┘
                   │
                   ▼
  ┌─────────────────────────────────┐
  │  2. Automated CI checks         │  ← runs on every push to the PR
  │     (GitHub Actions)            │
  └────────────────┬────────────────┘
                   │
                   ▼
  ┌─────────────────────────────────┐
  │  3. Human code review           │  ← at least 1 reviewer (2 for core files)
  │     (GitHub PR review)          │
  └────────────────┬────────────────┘
                   │
                   ▼
  ┌─────────────────────────────────┐
  │  4. Maintainer merge audit      │  ← final gate before squash merge
  │     (final diff + smoke test)   │
  └────────────────┬────────────────┘
                   │
                   ▼
               main branch
```

---

## Stage 1 — Pre-merge self-audit (contributor)

Before the contributor opens a PR, they run through this checklist themselves. This is not optional — it is the contributor's commitment that the work is ready.

### TypeScript gate

```bash
pnpm run typecheck
```

**Zero errors required.** If this fails, the PR must not be opened. CI will reject it anyway, but fixing it before pushing saves review round-trips.

### Content integrity check (for curriculum changes)

If `data/curriculum.ts` was touched:

- [ ] All exercise IDs are globally unique — search the file for your new IDs to confirm
- [ ] `correctIndex` is tested manually — the right answer actually wins in-app
- [ ] `correctSentence` in every WORD_ORDER exercise exactly matches the `words` array joined in order
- [ ] Every `promptScript` Devanagari entry is correct (verified with a native speaker or dictionary)
- [ ] No exercise IDs were changed or deleted — only additions are safe

### State and persistence check (for AppContext changes)

If `contexts/AppContext.tsx` was touched:

- [ ] AsyncStorage keys were NOT renamed or deleted (renaming breaks existing users)
- [ ] No new AsyncStorage reads or writes were added outside of `AppContext.tsx`
- [ ] Gamification rule changes (XP amounts, streak logic, heart counts) are documented in the PR body and tagged `product-decision`
- [ ] `computeBadges()` still covers all badge types after your change

### Navigation check (for route/screen changes)

If any file under `app/` was touched:

- [ ] No `router.push` or `router.replace` calls use hardcoded `/(tabs)/` — use `/(tabs)` (note: no trailing slash)
- [ ] New routes are tested on web AND device — deep-link navigation, back gesture, tab switch all work
- [ ] No screen can be reached that leaves the user in a dead end (no back button, no tab visible)

### Clean code check

- [ ] No `console.log` statements
- [ ] No hardcoded colors — all colors from `useColors()`
- [ ] No hardcoded font weights — all fonts from Inter family
- [ ] No raw AsyncStorage calls outside AppContext
- [ ] No `as any` without a comment explaining why

---

## Stage 2 — Automated CI checks (GitHub Actions)

Every push to a PR branch triggers the CI workflow at `.github/workflows/ci.yml`.

### What CI runs

```yaml
steps:
  1. Checkout code
  2. Set up Node.js 20 with pnpm cache
  3. pnpm install --frozen-lockfile
  4. pnpm run typecheck              ← must pass (zero errors)
  5. pnpm --filter @workspace/indori-wuolingo run build:web   ← must succeed
```

### CI failure rules

| CI result | What happens |
|---|---|
| TypeScript errors | PR is blocked — cannot be merged until fixed |
| Web build failure | PR is blocked — cannot be merged until fixed |
| CI skipped (no config) | PR is blocked — CI must run and pass |

**A PR with failing CI cannot be merged by anyone — not even a maintainer.**

If CI is flaky (transient network error, cache miss), a maintainer can re-run the job. They cannot bypass it.

### How to read a CI failure

1. Click the red ✗ next to your commit on GitHub
2. Click "Details" to open the Actions log
3. Find the failing step — expand it to see the error
4. Fix the error locally, run `pnpm run typecheck` to confirm, push again

Common failures:

| Error in CI log | Fix |
|---|---|
| `TS2345` or any `TSxxxx` error | TypeScript type error — fix it in the flagged file |
| `Module not found` | Missing import or wrong path — check `@/` alias usage |
| `pnpm install` fails | Lock file out of sync — run `pnpm install` locally and commit `pnpm-lock.yaml` |
| `expo export` fails | Metro config issue — test `pnpm --filter @workspace/indori-wuolingo run build:web` locally |

---

## Stage 3 — Human code review

After CI passes, at least one other contributor reviews the PR. For core files, two reviews are required.

### Review threshold by file area

| Files changed | Reviews required |
|---|---|
| `app/` screens, `components/` | 1 |
| `data/curriculum.ts` | 1 + language expert sign-off if new content |
| `contexts/AppContext.tsx` | **2** |
| `app/_layout.tsx`, `app/(tabs)/_layout.tsx` | **2** |
| `vercel.json`, `netlify.toml`, `package.json` | **2** |
| `docs/` only | 1 |

### What reviewers check

**Correctness**
- Does the code do what the PR description says?
- Are edge cases handled (empty state, null, zero hearts, no lessons completed)?
- Are there any silent failures — `try/catch` with empty catch body?

**State integrity**
- Does anything touch AsyncStorage outside of `AppContext.tsx`?
- Does anything rename or delete existing AsyncStorage keys (`iw_user_profile`, `iw_user_progress`, `iw_onboarding_name`)?
- Does anything change XP, streak, or heart logic without a `product-decision` label?

**Design integrity**
- Are colors from `useColors()` — not hardcoded?
- Are fonts from the Inter family — not `fontWeight: 'bold'`?
- Does the change break dark mode or look wrong on small screens?

**Content integrity (for curriculum changes)**
- Is every new ID globally unique?
- Is the Devanagari script correct?
- Are exercise answers actually correct?

**Diff hygiene**
- Is the diff focused — no unrelated cleanup bundled in?
- Are there any leftover `console.log` calls?
- Any `as any` without an explanatory comment?

### Reviewer response options

| Response | Meaning |
|---|---|
| **Approve** | Ready to merge as-is |
| **Request changes** | Blocking issues found — contributor must address and re-request review |
| **Comment (no review state)** | Questions or non-blocking suggestions — does not block merge |

A reviewer who leaves only comments (no formal review state) does not count as the required approval.

### Re-review after changes

If a contributor pushes new commits after receiving review comments:
- GitHub automatically dismisses any existing approvals (if the repo is configured to do so)
- The contributor clicks "Re-request review" explicitly after addressing all comments
- The reviewer confirms the fixes and re-approves

---

## Stage 4 — Maintainer merge audit (final gate)

After all required approvals are in and CI is green, a maintainer performs a final pass before merging.

### Final diff review

The maintainer opens the PR "Files changed" tab and scans for:

- [ ] No new hardcoded secrets, tokens, or API keys accidentally committed
- [ ] No `.env` files or sensitive config added to the repo
- [ ] No accidental deletion of important files (check the "deleted files" section of the diff)
- [ ] Commit history on the branch is clean enough to produce a readable squash message

### Smoke test (for UI changes)

For any PR that changes screens or exercise rendering, the maintainer opens the branch in the Expo web preview and runs a quick smoke test:

- [ ] App loads without a blank screen or error
- [ ] The changed screen opens and renders correctly
- [ ] The changed flow completes (lesson starts → exercise renders → answer works → next exercise)
- [ ] No obvious visual regressions on the Home, Review, Leaderboard, and Profile tabs

This takes 2–3 minutes. It is not a full test suite — just a sanity check that the app is not visibly broken.

### Squash and merge

The maintainer clicks **Squash and merge** and edits the final commit message to match the Conventional Commits format:

```
feat(exercise): add LISTEN_AND_CHOOSE exercise type (#23)

Adds the third exercise type to the lesson engine. Includes the
TypeScript interface, renderer component, and 4 sample exercises
in Unit 1 Lesson 2.

Closes #18
```

The format is: `type(scope): description (#PR-number)` with an optional body and `Closes #N` footer.

After merging:
- The branch is deleted automatically
- The linked issue is closed automatically
- The contributor is notified

---

## What happens if a PR is abandoned

If a contributor opens a PR and stops responding for **14 days** with outstanding review comments:

1. A maintainer adds the `stale` label
2. The maintainer leaves a comment: _"This PR has been inactive for 14 days. If you'd like to continue, please address the review comments. Otherwise it will be closed in 7 days."_
3. After 7 more days with no response, the PR is closed (not merged, not deleted from the branch)
4. The branch is preserved for 30 days, then cleaned up
5. The issue is un-assigned and returned to the backlog

Anyone can pick up the abandoned work by rebasing the stale branch or starting fresh from `main`.

---

## Audit trail

Every merge into `main` is permanently recorded:

| Record | Where |
|---|---|
| Squash commit on `main` | Git log — `git log --oneline main` |
| PR discussion and review comments | GitHub PR — preserved forever even after branch deletion |
| CI run log | GitHub Actions — preserved for 90 days by default |
| Issue closure | GitHub Issues — linked to the PR |

This means every line of code that entered `main` can be traced to:
- Which contributor wrote it
- Which reviewer approved it
- Which issue it addressed
- Which CI run confirmed it passed

---

## Emergency bypass (break-glass)

In a genuine production emergency (critical crash affecting all users), a maintainer may merge a hotfix without the full review cycle. This requires:

1. Two maintainers agree verbally (Slack/WhatsApp/call) that the bypass is necessary
2. The hotfix branch passes CI
3. One maintainer merges
4. A retrospective issue is opened within 24 hours documenting what broke, why it was bypassed, and whether the fix needs a follow-up

Break-glass merges should happen fewer than once per quarter. If they happen more often, the process or test coverage needs improvement.
