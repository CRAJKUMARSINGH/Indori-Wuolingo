# Indore10 Migration Guide

Use `Indore10` as the **main implementation donor** for the unified `Indori-Wuolingo` repo. Do not rename the final product to Indore10. Think of it as the best working draft whose useful parts should be absorbed into the final home.

## Final decision

```txt
Final repo / public brand: Indori-Wuolingo
Short app name in UI:      IndiLingo
Main code donor:           Indore10
Mobile donor:              Indore09
Reference docs donor:      Indori-Wuolingo, Indore03, Indore04, Indore08, Indore12
```

## What to copy from Indore10

| Indore10 source | Final destination | Action |
|---|---|---|
| `artifacts/indilingo` | `apps/web` | Copy as the first Vite web app baseline |
| `artifacts/api-server` | `apps/api` or `packages/api` | Copy as API baseline |
| `lib/db` | `packages/db` | Copy schema and Drizzle config |
| `lib/api-spec` | `packages/api-spec` | Copy OpenAPI source |
| `lib/api-client-react` | `packages/api-client-react` | Copy generated client initially |
| `lib/api-zod` | `packages/api-zod` | Copy generated Zod package initially |
| `scripts/src/seed-indilingo.ts` | `packages/curriculum/src/seed-indilingo.ts` | Extract seed data and DB adapter |
| `README.md`, `replit.md`, `Creat.md` | `docs/source-audits/indore10/` | Keep as source references |

## What must be fixed after copying

### 1. `match_pairs`

Indore10 has the right idea but the implementation needs correction.

Current problem:

- all left/right choices are rendered in one loose option bag
- matching checks whether two selected strings appear in a valid pair
- duplicate text can create false matches
- UI is not the polished two-column "Match it" flow

Required final contract:

```ts
type MatchPair = {
  id: string;
  left: string;
  right: string;
};

type MatchPairsExercise = Exercise & {
  type: "match_pairs";
  pairs: MatchPair[];
  correctAnswer: string; // JSON.stringify(pairs), kept for API compatibility
};
```

Required player behavior:

- render left column and right column separately
- shuffle only the right column
- match by `pair.id`, not text
- finish when every `pair.id` is matched
- record mistakes without blocking progress in soft-hearts mode

Use the code sketch in `PRODUCTION_SKELETON.md`.

### 2. Soft hearts

Indore10 currently routes away when hearts reach 0. For the MVP, change this.

Required MVP behavior:

- wrong answer decrements displayed hearts
- hearts stop at 0
- lesson continues at 0
- mistake is recorded
- strict blocking is kept for a future config flag

### 3. PWA

Add `vite-plugin-pwa` to the copied web app.

Cache:

- app shell
- manifest/icons
- seed curriculum JSON
- recent lesson API responses

### 4. Curriculum extraction

Do not leave all curriculum inside a DB seed script forever.

Recommended split:

```txt
packages/curriculum/
|-- src/
|   |-- languages.ts
|   |-- lessons.ts
|   |-- exercises.ts
|   |-- levels.ts
|   |-- seed-indilingo.ts
|   |-- seed-db.ts
```

Keep pure curriculum data separate from Drizzle insert logic.

## Exact migration sequence

1. Start from the final `Indori-Wuolingo` repo.
2. Create `apps/web`, `apps/api`, and `packages/*`.
3. Copy `Indore10/artifacts/indilingo` into `apps/web`.
4. Copy `Indore10/artifacts/api-server` into `apps/api`.
5. Copy `Indore10/lib/db` into `packages/db`.
6. Copy `Indore10/lib/api-spec`, `lib/api-client-react`, and `lib/api-zod` into matching packages.
7. Copy `Indore10/scripts/src/seed-indilingo.ts` into `packages/curriculum/src/`.
8. Move pure language/curriculum arrays out of the seed script into reusable modules.
9. Patch `ExercisePlayer` for stable two-column `match_pairs`.
10. Patch hearts behavior to soft hearts.
11. Add PWA plugin and manifest.
12. Add robotic tests.
13. Run `pnpm install`, `pnpm typecheck`, `pnpm build`.
14. Only after it builds, start adding Indore09 mobile code.

## Suggested commit plan

```txt
commit 1: chore(workspace): create unified pnpm app/package layout
commit 2: feat(web): migrate Indore10 Vite learner app
commit 3: feat(api): migrate Indore10 API and OpenAPI packages
commit 4: feat(curriculum): extract Indore10 15-language seed data
commit 5: fix(exercises): stabilize match_pairs two-column matching
commit 6: feat(gamification): document and implement soft hearts mode
commit 7: feat(pwa): add offline app shell and seed curriculum caching
commit 8: test(robotic): add 21-user language-path simulation suite
```

## Keep Indore10 as an archive

After migration, keep the original Indore10 clone/reference around under:

```txt
docs/source-audits/indore10/
```

Do not keep two live apps competing in the final repo. The final repo should have one clear learner web app: `apps/web`.

