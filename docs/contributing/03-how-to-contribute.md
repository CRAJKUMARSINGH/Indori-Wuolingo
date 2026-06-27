# 03 · How to Contribute

A step-by-step walkthrough of the full contribution lifecycle — from finding something to work on through getting it merged.

---

## Step 1 — Find or create an issue

Every contribution starts with a GitHub Issue.

**Finding work:**
- Browse open issues labelled `good first issue` or `help wanted`
- Check the MVP status table in `CONTRIBUTORS.md` for unbuilt features
- Spot a bug while using the app? File an issue before fixing it

**Creating a new issue:**
1. Go to Issues → New Issue
2. Write a clear title: `[Bug] Hearts go negative on wrong answer` or `[Feature] Add LISTEN_AND_CHOOSE exercise type`
3. Describe: what is the current behaviour, what should happen, any relevant context
4. Add relevant labels: `bug`, `feature`, `content`, `docs`
5. Wait for a maintainer to acknowledge before starting large work (to avoid wasted effort)

**Self-assign:**
Comment `I'll take this` or assign yourself. This signals to the team that someone is actively working on it.

---

## Step 2 — Create your branch

Always branch from the latest `main`:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

Follow the naming conventions in [04-branching-strategy.md](./04-branching-strategy.md).

---

## Step 3 — Make focused changes

Work only on the issue you picked up. Do not bundle unrelated fixes into the same branch.

**While working:**
- Run `pnpm --filter @workspace/indori-wuolingo run dev` to see changes live
- Test on web (`http://localhost:20532`) and on a real device for anything touch-related
- Follow patterns from nearby code rather than inventing new ones
- Never hardcode colors — use `useColors()` hook
- Never use `console.log` in production code

---

## Step 4 — Run checks before pushing

```bash
# TypeScript — must be zero errors
pnpm run typecheck

# Visual check — go through the testing checklist
# See 12-testing-checklist.md
```

Do not push code that fails the typecheck. CI will catch it and your PR cannot be merged.

---

## Step 5 — Push and open a Pull Request

```bash
git add .
git commit -m "feat: add word-match exercise renderer"
git push origin feature/your-feature-name
```

On GitHub:
1. Click **Compare & pull request**
2. Fill in the PR template (see [06-pull-request-guide.md](./06-pull-request-guide.md))
3. Link the issue: write `Closes #42` in the description
4. Add screenshots or a screen recording for any UI change
5. If the work is still in progress, mark it as a **Draft PR** — this keeps others informed without requesting review

---

## Step 6 — Respond to review

- Address every comment — either fix it or explain why you disagree
- Push new commits to the same branch (do not force-push during review)
- Re-request review after significant updates

---

## Step 7 — Merge

Once approved:
- A maintainer will **Squash and merge**
- The branch is deleted automatically after merge
- The issue is closed automatically (if you wrote `Closes #N`)

---

## First-time contributor checklist

- [ ] Issue exists and is assigned to me
- [ ] Branched from latest `main`
- [ ] Changes are focused on one issue only
- [ ] `pnpm run typecheck` passes with zero errors
- [ ] Tested on web + device (or noted in PR why not)
- [ ] PR description is filled in (what, why, how tested)
- [ ] Screenshots attached for any UI change
- [ ] Linked issue with `Closes #N`

---

## What counts as a contribution

Not all contributions are code. All of these count:

- Fixing a bug
- Adding lesson content to `curriculum.ts`
- Adding a new exercise type
- Improving documentation in this folder
- Reporting a well-described bug
- Reviewing someone else's PR with substantive comments
- Translating UI strings for a new language track
- Recording audio assets for listening exercises

Your name belongs in the contributors list if your work was merged, regardless of type.
