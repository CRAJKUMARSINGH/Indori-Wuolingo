# 04 · Branching Strategy

Trunk-based development with a protected `main` branch. Simple, fast, and low-conflict for a small team.

---

## The model

```
main  ←──────────────────────────────── always stable, always deployable
  │
  ├── feature/hindi-audio-exercises      short-lived, merged in ≤ 3 days
  ├── fix/streak-not-incrementing        short-lived, merged quickly
  └── docs/content-authoring-guide      short-lived
```

- `main` is the only permanent branch
- All work happens in short-lived branches
- No `develop`, `staging`, or `release` branches (too much overhead for a 3-person team)

---

## Branch naming

Use a prefix followed by a short kebab-case description:

| Prefix | Use for |
|---|---|
| `feature/` | New screens, features, exercise types, language tracks |
| `fix/` | Bug fixes, crash fixes, wrong behaviour |
| `chore/` | Dependency updates, build config, CI changes |
| `docs/` | Documentation, this folder, `CONTRIBUTORS.md` |
| `refactor/` | Code structure improvements with no behaviour change |
| `content/` | Lesson content, exercise data, badge definitions |

**Examples:**

```
feature/listen-and-choose-exercise
feature/marathi-language-track
fix/hearts-go-negative
fix/streak-resets-on-app-restart
chore/upgrade-expo-sdk-55
docs/add-audio-exercise-guide
refactor/split-curriculum-by-unit
content/unit2-numbers-lessons
```

**Rules:**
- Use only lowercase letters, numbers, and hyphens
- Keep it short (3–5 words max)
- Make it readable at a glance

---

## Standard branch flow

```
1. git checkout main && git pull origin main
2. git checkout -b feature/my-thing
3. ... make focused changes ...
4. git push origin feature/my-thing
5. Open PR on GitHub
6. Review + approval
7. Squash and merge into main
8. Delete branch
```

---

## Merge policy

| Change type | Merge style | Approvals needed |
|---|---|---|
| Normal feature or fix | Squash and merge | 1 |
| Shared core files (`AppContext`, `_layout`, `curriculum`) | Squash and merge | 2 |
| Hotfix on broken `main` | Squash and merge | 1 (fast review) |
| Docs only | Squash and merge | 1 |

**Why squash and merge?**
Each PR becomes exactly one commit on `main`. The history reads like a clean changelog of shipped work, not a log of every `wip: stuff` and `fix typo` commit.

---

## Handling parallel work

If two contributors touch the same files, do this:

1. Merge the smaller PR first
2. The second contributor rebases on the new `main`:
   ```bash
   git checkout main && git pull origin main
   git checkout feature/my-thing
   git rebase main
   # resolve any conflicts
   git push --force-with-lease origin feature/my-thing
   ```
3. Request re-review (force-push resets approvals on some GitHub settings)

---

## Releases and tags

Tag from `main` after shipping a meaningful milestone:

```bash
git tag v0.2.0
git push origin v0.2.0
```

Tag format: `vMAJOR.MINOR.PATCH`

| Version bump | When |
|---|---|
| PATCH (`0.1.1`) | Bug fixes, content updates |
| MINOR (`0.2.0`) | New exercise type, new language track, major screen |
| MAJOR (`1.0.0`) | Public launch, breaking content schema change |

---

## Hotfix process

If `main` is broken in production:

```bash
git checkout main && git pull origin main
git checkout -b fix/critical-crash-on-lesson-start
# fix the issue
git push origin fix/critical-crash-on-lesson-start
# open PR → one reviewer approves → squash merge immediately
```

Do not create a `hotfix/` branch off a tag — `main` is always the source of truth.

---

## Protected branch rules (recommended GitHub settings)

Apply these to `main`:

- ✅ Require a pull request before merging (no direct pushes)
- ✅ Require at least 1 approving review
- ✅ Require status checks to pass (`typecheck`)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Delete head branches automatically after merge
- ❌ Do NOT allow force pushes to `main`
