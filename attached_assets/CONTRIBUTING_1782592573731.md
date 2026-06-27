# Contributing

This project is designed for a small team of 3 contributors working asynchronously with `GitHub`.

## Core workflow

1. Create or pick a `GitHub Issue`.
2. Assign the issue to yourself.
3. Create a branch from `main`.
4. Make focused changes for that issue only.
5. Run local checks before pushing.
6. Open a Pull Request.
7. Get at least 1 approval from another contributor.
8. Merge only after CI passes.

## Branch naming

Use one of these patterns:

- `feature/short-description`
- `fix/short-description`
- `chore/short-description`
- `docs/short-description`

Examples:

- `feature/login-flow`
- `fix/profile-crash`
- `docs/api-setup`

## Commit style

Keep commits short and clear.

Examples:

- `feat: add login screen validation`
- `fix: prevent null profile crash`
- `docs: update setup guide`
- `chore: clean lint warnings`

## Pull Request rules

Each Pull Request should:

- solve one issue or one small unit of work
- include a clear title
- explain what changed
- explain how it was tested
- stay reasonably small when possible

## Pull Request template

Use this format in Pull Requests:

```md
## What changed
- 

## Why
- 

## How I tested it
- 

## Screenshots or notes
- 
```

## Review rules

- at least 1 other contributor should review before merge
- do not self-merge major changes without review
- ask for re-review after significant updates
- keep review comments direct and specific

## Local checks before push

Run the checks that match the project stack.

Examples:

```bash
npm install
npm run lint
npm test
npm run build
```

If the repo uses another stack, update this section to match it.

## Branch protection recommendation

Protect `main` with:

- required Pull Requests
- at least 1 approval
- required status checks
- no direct pushes

## Working as a 3-person team

This is a simple split that works well:

- Contributor 1: frontend and UI work
- Contributor 2: backend, APIs, and data logic
- Contributor 3: QA, fixes, integrations, and release support

These roles can rotate. The important rule is that everyone reviews code, not just writes it.

## Small-team habits

- keep tasks small
- merge often
- avoid long-lived branches
- open draft PRs early for visibility
- write notes in issues instead of private chat when decisions affect the repo

## What to avoid

- huge PRs with unrelated changes
- direct pushes to `main`
- silent breaking changes
- skipping tests on shared code
- keeping work local for too long without opening a PR
