# Git patch set (Indore series)

This folder contains one patch per repository, generated from the “candidate bundle” files.

## Files

- `<repo>.patch`: apply this inside that repo (example: `Indore12.patch`)

## How to apply a patch

1. Clone (or open) the target repo locally.
2. `cd` into the repo root.
3. Apply:

```bash
git apply --whitespace=fix /path/to/Indore12.patch
```

4. Review:

```bash
git status
git diff --stat --cached || true
```

5. Commit + push:

```bash
git add -A
git commit -m "docs: unify repo docs + CI"
git push
```

## Notes

- These patches only touch “repo-facing” files like `README.md`, `.github/*`, and common community health files.
- If you already edited the same files in GitHub, you may get conflicts; in that case, copy the file contents manually from the candidate bundle instead.

