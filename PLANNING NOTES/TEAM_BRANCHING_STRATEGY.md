# Team Branching Strategy

This strategy is optimized for a 3-contributor software team using `GitHub`.

## Recommended model

Use a simple `trunk-based` style with a protected `main` branch.

### Branches

- `main`: always stable and merge-ready
- short-lived feature or fix branches: used for active work only

You do not need a permanent `develop` branch unless the team is shipping complex staged releases.

## Why this works

For a small team, the main risks are merge conflicts, hidden work, and slow reviews. Short branches reduce all three.

## Standard branch flow

1. Open or choose an issue.
2. Create a branch from `main`.
3. Make a focused change.
4. Push the branch.
5. Open a Pull Request.
6. Review and fix comments.
7. Merge into `main`.
8. Delete the branch after merge.

## Branch naming

Use clear prefixes:

- `feature/...`
- `fix/...`
- `chore/...`
- `docs/...`
- `refactor/...`

Examples:

- `feature/user-onboarding`
- `fix/payment-timeout`
- `chore/update-deps`
- `docs/api-readme`

## Merge policy

Use one of these:

- `Squash and merge` for most feature work
- `Rebase and merge` if you want a cleaner linear history

For most 3-person teams, `Squash and merge` is the easiest choice.

## Recommended review rule

- normal changes: 1 approval required
- risky or shared-core changes: 2 people should look before merge

## Handling parallel work

If all 3 contributors are active at the same time:

- one person can work on frontend
- one person can work on backend
- one person can work on tests, fixes, docs, or integration

If two branches touch the same files:

- merge the smaller PR first
- rebase the second branch on latest `main`
- resolve conflicts before requesting final review

## Release handling

If you need lightweight releases:

- tag from `main`
- use tags like `v0.1.0`, `v0.2.0`, `v1.0.0`

If you need an urgent fix:

1. branch from `main` using `fix/...`
2. patch the issue
3. open PR
4. review quickly
5. merge back to `main`
6. tag a release if needed

## Suggested repo rules

Protect `main` with:

- no direct pushes
- PR required before merge
- CI checks required
- stale branch cleanup after merge

## Simple decision guide

Use this approach when:

- the team is 2 to 5 developers
- work is moving quickly
- releases are frequent
- the team wants low process overhead

Use a more complex model only if:

- there are multiple production environments with long QA cycles
- release branches are mandatory
- the organization already has stricter release controls

## Best practice summary

- branch from `main`
- keep branches short-lived
- open PRs early
- merge small changes often
- protect `main`
- use CI to catch obvious problems fast
