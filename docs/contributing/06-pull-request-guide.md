# 06 · Pull Request Guide

How to write a good PR, what reviewers look for, and how the review process works.

---

## PR size

Keep PRs small. Large PRs are slow to review, cause more conflicts, and are harder to revert if something goes wrong.

| PR type | Target size |
|---|---|
| Bug fix | ≤ 100 lines changed |
| New screen | ≤ 300 lines changed |
| New exercise type | ≤ 200 lines changed |
| Content (lessons) | ≤ 500 lines (mostly data) |
| Docs | Any size |

If your change is larger, ask yourself: *Can I split this into two PRs that each make sense on their own?*

---

## PR title

Use the same format as commit messages:

```
feat(exercise): add LISTEN_AND_CHOOSE exercise type
fix(hearts): prevent negative heart count on wrong answer
content(unit3): add family vocabulary lesson
docs(contributing): add exercise type extension guide
```

---

## PR description template

Copy this into every PR description:

```markdown
## What changed
- 

## Why
- 

## How I tested it
- [ ] Web browser (http://localhost:20532)
- [ ] iOS device (Expo Go)
- [ ] Android device (Expo Go)
- [ ] `pnpm run typecheck` — zero errors

## Screenshots or screen recording
<!-- Attach for any UI change -->

## Related issue
Closes #
```

**What changed** — bullet list of the changes. Be specific.  
**Why** — the reason. Link to the issue if helpful.  
**How I tested** — check the boxes you actually tested. Leave untested ones unchecked with a note.  
**Screenshots** — required for any visual change. A short screen recording is even better.

---

## Before requesting review

- [ ] Branch is up to date with `main`
- [ ] `pnpm run typecheck` passes with zero errors
- [ ] Manual test checklist complete (see [12-testing-checklist.md](./12-testing-checklist.md))
- [ ] PR description filled in completely
- [ ] Screenshots or screen recording attached for UI changes
- [ ] Issue linked with `Closes #N`
- [ ] No unrelated changes in the diff
- [ ] No `console.log` statements left in

---

## Draft PRs

Open a draft PR early to:
- Signal that work is in progress (prevents duplicate work)
- Get early feedback on direction before investing too much time
- Keep the issue's context linked to real code

Convert to "Ready for review" when all checks pass.

---

## Review rules

**For reviewers:**
- Review within 24 hours of being requested (for a 3-person team this is easy)
- Be specific: `This function will call AsyncStorage on every render — move it into useEffect` is better than `this looks slow`
- Distinguish between blocking issues and suggestions: use `nit:` prefix for non-blocking comments
- Approve only when you are genuinely satisfied — not just to be nice

**For authors:**
- Respond to every comment: either fix it, or reply explaining your reasoning
- Push follow-up commits to the same branch — do not create a new PR
- Re-request review explicitly after you have addressed all comments
- Do not resolve reviewer comments yourself — let the reviewer resolve them

---

## Merge

Only maintainers merge. After approval:
1. Maintainer clicks **Squash and merge**
2. Edits the final commit message to match conventions if needed
3. Confirms merge
4. Branch is deleted automatically

Do not click merge yourself unless you have been granted maintainer access.

---

## After merge

- The linked issue is closed automatically
- Verify the change works in the deployed preview (if available)
- Delete your local branch: `git branch -d feature/my-thing`
- Pull the latest `main`: `git checkout main && git pull`
