# Review and Merge Guide

This guide covers how to review a Pull Request, how to handle feedback, and when and how to merge. Follow this process every time — even for small changes.

---

## Who should review

Every PR needs at least one reviewer who did not write the code. For a 3-person team this means:

- The author opens the PR and requests review from one or both other contributors.
- If the change touches shared infrastructure (layout files, context providers, curriculum types, CI config), request both reviewers.
- The reviewer should not be the same person who opened the PR.

---

## When to review

Aim to review within 24 hours of a PR being opened. If you cannot review within 24 hours, leave a comment saying when you will.

Do not let PRs sit without a response for more than 3 days. If a PR is stale, notify the author in the team chat.

---

## How to review a PR

### Step 1 — Read the description first

Before looking at any code, read the PR description completely.

- Understand what changed and why.
- Check that the linked issue exists and makes sense.
- Check that the PR scope matches what the issue describes.

If the description is missing or too vague, comment and ask the author to fill it in before you continue.

---

### Step 2 — Pull the branch and test it locally

For any change that affects the UI or user flow, test it on a real device or simulator.

```bash
git fetch origin
git checkout feature/branch-name
pnpm install
pnpm --filter @workspace/indori-wuolingo run dev
```

Scan the QR code with Expo Go and test the affected screens yourself.

For logic-only or content-only changes, running the type check is sufficient:

```bash
pnpm run typecheck
```

---

### Step 3 — Read the code

Review the diff on GitHub. Look for:

**Correctness**
- Does the code do what the description says?
- Are edge cases handled? (empty state, first use, zero XP, no completed lessons)
- Does AsyncStorage persist correctly if the change touches context?

**Content quality** (for curriculum.ts changes)
- Are all Hindi strings correct Devanagari script?
- Do the exercise IDs follow the existing naming pattern?
- Is the `correct` field accurate for every exercise?
- Are the wrong options plausible but clearly incorrect?

**Code quality**
- Is the change consistent with the existing patterns in the file?
- Are there any obvious performance issues?
- Are any hardcoded values that should be in `constants/colors.ts` or `curriculum.ts`?

**Types**
- Does `pnpm run typecheck` pass cleanly?

---

### Step 4 — Leave comments

Use GitHub's inline comment feature to leave feedback on specific lines.

**How to phrase feedback:**

| Situation | What to write |
|---|---|
| Must fix before merge | `[blocking] This will crash if completedLessons is empty — add a guard.` |
| Should fix but not blocking | `[suggestion] Consider extracting this into a helper function for reuse.` |
| Curious but not blocking | `[nit] Could also use optional chaining here. Up to you.` |
| Praise for clarity | `Nice — this approach is much cleaner than what we had before.` |

Use `[blocking]` only when the issue would cause a bug, a crash, incorrect content, or a broken type. Everything else is a suggestion.

---

### Step 5 — Submit your review

After leaving all comments, submit a formal review:

- **Approve** — the change is ready to merge, possibly with minor nit fixes the author can do before merging
- **Request changes** — there are one or more `[blocking]` issues that must be resolved before merge
- **Comment** — you have feedback or questions but are not formally approving or blocking

---

## How the author responds to review feedback

After receiving a review:

1. Address every comment, even if you disagree.
2. For `[blocking]` comments: fix the issue and push the update.
3. For `[suggestion]` or `[nit]` comments: either make the change or explain why you are not making it. Both are acceptable.
4. Reply to each comment with a short note:
   - `Done — updated line 42.`
   - `Agreed — extracted to a helper.`
   - `Left as-is — this is intentional because the exercise list is always non-empty by construction.`
5. Request re-review if you made significant changes after a blocking review.

---

## When a PR is ready to merge

All of these must be true:

- [ ] At least 1 approved review from another contributor
- [ ] No open `[blocking]` comments
- [ ] `pnpm run typecheck` passes (verified in CI or locally)
- [ ] The author has not self-approved

---

## How to merge

The **reviewer** or the **author** can perform the merge, but the author must not merge without at least one approval.

### Merge method

Use **Squash and merge** for most PRs. This keeps the main branch history clean with one commit per feature or fix.

Use **Merge commit** only if the branch has several meaningful commits that should be preserved individually (rare — only for large features broken into logical commits).

Never use **Rebase and merge** unless you have a specific reason and have discussed it with the team.

### Steps

1. On GitHub, open the PR.
2. Confirm all checks pass.
3. Click **Squash and merge**.
4. Edit the commit message to follow the commit style from the contributing guide:
   ```
   feat: add speaking exercise type to lesson runner (#12)
   ```
5. Click **Confirm squash and merge**.
6. Delete the branch (GitHub offers this after merge — always do it).

---

## After the merge

- The author closes the linked issue.
- All contributors pull the latest `main` before starting their next branch.

```bash
git checkout main
git pull origin main
```

---

## Handling disagreements

If you disagree with a reviewer's `[blocking]` comment:

1. Explain your reasoning in the PR comment thread.
2. If you cannot reach agreement, ask the third contributor to weigh in.
3. Majority decides. The decision and reasoning should be documented in the comment thread so it is visible to everyone.

Do not merge over a `[blocking]` comment without agreement. Do not let disagreements stall a PR for more than 2 days — escalate quickly.

---

## Emergency hotfixes

If a critical bug needs to go directly to `main` without full review:

1. Create a branch named `hotfix/short-description`.
2. Fix only the critical issue — nothing else.
3. Open a PR and tag both other contributors as urgent.
4. One reviewer is required even for hotfixes. Do not skip review entirely.
5. Merge as soon as one approval is received.
6. Open a follow-up issue to review the fix properly and add any missing test coverage.
