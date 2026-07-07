# Integration Guide (Apply the bundle)

This bundle is designed to be copied into your repos with minimal conflict.

## Option A: Quick copy (recommended)

For each repository:

1. Copy everything from `repos/<REPO_NAME>/` into the root of that GitHub repo.
2. Commit:
   - `README.md` (if present)
   - `.github/` (issue templates + CI)
   - `LICENSE`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`
   - `.editorconfig`
3. Push to `main`.

## Option B: Keep existing README

If a repo already has a good README (e.g. `Indori-Wuolingo`, `Indore10`), you can keep it and copy only:

- `.github/`
- `LICENSE`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`
- `.editorconfig`

## CI note

The included workflow runs:

- `pnpm install --frozen-lockfile`
- `pnpm run typecheck`

It avoids database-dependent commands so it can run in GitHub Actions without extra secrets.
