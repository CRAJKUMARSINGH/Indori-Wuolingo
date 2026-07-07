# Apply Outputs To The Updated Repo

This note is tailored to the current local clone:

```txt
C:\Users\Rajkumar\Documents\Codex\2026-07-07\r\work\repos\Indori-Wuolingo
```

Current observed state:

- `README.md` is empty.
- There is no `apps/` folder yet.
- There is no `packages/` folder yet.
- Existing runnable/code folders are under `artifacts/`.
- All 13 source repos are available under `work/repos/`.

## Immediate safe copy

Copy the polished docs into the primary repo first:

```powershell
$Repo = "C:\Users\Rajkumar\Documents\Codex\2026-07-07\r\work\repos\Indori-Wuolingo"
$Out = "C:\Users\Rajkumar\Documents\Codex\2026-07-07\r\outputs\indori-wuolingo-unified"

Copy-Item "$Out\README.md" "$Repo\README.md" -Force
Copy-Item "$Out\MERGE_SUMMARY.md" "$Repo\MERGE_SUMMARY.md" -Force
Copy-Item "$Out\PRODUCTION_SKELETON.md" "$Repo\PRODUCTION_SKELETON.md" -Force
Copy-Item "$Out\INDORE10_MIGRATION_GUIDE.md" "$Repo\INDORE10_MIGRATION_GUIDE.md" -Force
Copy-Item "$Out\ACTION_PLAN_52_WEEKS.md" "$Repo\ACTION_PLAN_52_WEEKS.md" -Force
Copy-Item "$Out\landing-page.html" "$Repo\landing-page.html" -Force
Copy-Item "$Out\docs\SOFT_HEARTS.md" "$Repo\docs\SOFT_HEARTS.md" -Force
Copy-Item "$Out\docs\ROBOTIC_TEST_SUITE.md" "$Repo\docs\ROBOTIC_TEST_SUITE.md" -Force
```

## Then stage Indore10 into the final layout

```powershell
$Repo = "C:\Users\Rajkumar\Documents\Codex\2026-07-07\r\work\repos\Indori-Wuolingo"
$Indore10 = "C:\Users\Rajkumar\Documents\Codex\2026-07-07\r\work\repos\Indore10"

New-Item -ItemType Directory -Force -Path "$Repo\apps" | Out-Null
New-Item -ItemType Directory -Force -Path "$Repo\packages" | Out-Null
New-Item -ItemType Directory -Force -Path "$Repo\docs\source-audits\indore10" | Out-Null

Copy-Item "$Indore10\artifacts\indilingo" "$Repo\apps\web" -Recurse -Force
Copy-Item "$Indore10\artifacts\api-server" "$Repo\apps\api" -Recurse -Force
Copy-Item "$Indore10\lib\db" "$Repo\packages\db" -Recurse -Force
Copy-Item "$Indore10\lib\api-spec" "$Repo\packages\api-spec" -Recurse -Force
Copy-Item "$Indore10\lib\api-client-react" "$Repo\packages\api-client-react" -Recurse -Force
Copy-Item "$Indore10\lib\api-zod" "$Repo\packages\api-zod" -Recurse -Force

New-Item -ItemType Directory -Force -Path "$Repo\packages\curriculum\src" | Out-Null
Copy-Item "$Indore10\scripts\src\seed-indilingo.ts" "$Repo\packages\curriculum\src\seed-indilingo.ts" -Force

Copy-Item "$Indore10\README.md" "$Repo\docs\source-audits\indore10\README.md" -Force
Copy-Item "$Indore10\replit.md" "$Repo\docs\source-audits\indore10\replit.md" -Force
Copy-Item "$Indore10\Creat.md" "$Repo\docs\source-audits\indore10\Creat.md" -Force
```

## Patch immediately after copying

Do not treat the copied Indore10 code as finished until these are done:

1. Replace `apps/web/src/components/exercise-player.tsx` `match_pairs` logic with stable two-column matching by `pair.id`.
2. Change hearts from strict blocking to soft hearts for MVP.
3. Add `vite-plugin-pwa` to `apps/web/vite.config.ts`.
4. Extract pure curriculum arrays out of `packages/curriculum/src/seed-indilingo.ts`.
5. Add robotic test runner under `tests/robotic`.

## Suggested verification

```powershell
cd "C:\Users\Rajkumar\Documents\Codex\2026-07-07\r\work\repos\Indori-Wuolingo"
git status --short
pnpm install
pnpm typecheck
pnpm build
```

If `pnpm install` needs network access, run it in your normal terminal or approve network access in Codex.

