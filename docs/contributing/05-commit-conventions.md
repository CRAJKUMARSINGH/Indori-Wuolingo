# 05 · Commit Conventions

We use **Conventional Commits**. Every commit message has a type, an optional scope, and a short description.

---

## Format

```
<type>(<scope>): <short description>

[optional body — explain WHY, not WHAT]

[optional footer — Closes #N, Breaking change: ...]
```

The first line is what shows in `git log --oneline`. Keep it under 72 characters.

---

## Types

| Type | Use for |
|---|---|
| `feat` | New feature, screen, or exercise type |
| `fix` | Bug fix or crash fix |
| `content` | New lesson, exercise, unit, or badge data in `curriculum.ts` |
| `chore` | Build tooling, dependency updates, CI, config changes |
| `docs` | Documentation — this folder, `CONTRIBUTORS.md`, `README.md` |
| `refactor` | Code restructure with no behaviour change |
| `style` | Formatting, whitespace, no logic change |
| `perf` | Performance improvement |
| `revert` | Reverts a previous commit |

---

## Scopes (optional but useful)

Add a scope in parentheses to indicate which area was changed:

```
feat(lesson): add WORD_ORDER exercise renderer
fix(streak): prevent double increment when studying twice in one day
content(unit2): add numbers lesson with 6 exercises
chore(deps): upgrade expo-router to 6.0.24
docs(contributing): add testing checklist
```

Common scopes:
- `lesson`, `review`, `leaderboard`, `profile`, `onboarding`
- `exercise`, `curriculum`, `context`, `nav`
- `ui`, `animation`, `haptics`
- `deps`, `build`, `ci`

---

## Real examples

```bash
# Features
feat(exercise): add LISTEN_AND_CHOOSE exercise type
feat(onboarding): add placement quiz screen
feat(leaderboard): add real-time backend integration

# Fixes
fix(hearts): prevent hearts going below 0 on wrong answer
fix(streak): reset streak after 2+ missed days not 1
fix(nav): lesson complete screen now replaces instead of pushes

# Content
content(unit3): add family vocabulary lesson with 7 exercises
content(badges): add 30-day streak badge definition

# Chores
chore(expo): upgrade SDK from 54 to 55
chore(ci): add typecheck to GitHub Actions

# Docs
docs(contributing): add exercise type extension guide
docs(readme): add Vercel and Netlify deploy instructions
```

---

## Rules

**Do:**
- Write the description in imperative mood: `add`, `fix`, `update` — not `added`, `fixed`, `updated`
- Keep the first line under 72 characters
- Use the body to explain *why* a change was made, not *what* it does (the code shows what)
- Reference issues in the footer: `Closes #42`

**Do not:**
- Write `wip`, `stuff`, `changes`, `fix stuff`, `update code`
- Combine unrelated changes in one commit
- Use the commit body to describe every changed line
- Commit code that fails `pnpm run typecheck`

---

## Body and footer

Use the body when the reason behind a change is not obvious:

```
fix(streak): do not increment streak if already studied today

The streak update logic ran on every completeLesson() call.
If a user completed two lessons in the same day, the streak
counter incremented twice. Now it compares lastStudyDate with
today before deciding whether to increment.

Closes #17
```

---

## Breaking changes

If your change breaks backward compatibility (e.g. changes the AsyncStorage key schema):

```
refactor(storage): rename progress key from iw_progress to iw_user_progress

BREAKING CHANGE: users upgrading from v0.1 will lose saved progress.
Migration script is not provided for MVP. This is acceptable
before the public launch.
```

Add `BREAKING CHANGE:` in the footer. This surfaces it clearly in squash-merge commit messages.
