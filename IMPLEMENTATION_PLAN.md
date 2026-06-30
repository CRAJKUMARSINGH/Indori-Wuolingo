# Mobile primary, Web first‑class

## Goal Description

The user wants to apply the "Genius Update" plan to the **Indori‑Wuolingo** monorepo. The primary app is the mobile Expo Router app, and the web app should be a first‑class artifact with its own Vite build. The update includes:
- Extracting the existing web code into a dedicated artifact.
- Adding a Vite config for the new web artifact.
- Adding session handling and auth header injection to the API client.
- Removing hard‑coded `userId` values from the web pages.
- Expanding the OpenAPI spec with session, user, progress, leaderboard and stats endpoints.
- Regenerating the TypeScript client (Orval) and Zod types.
- Implementing skeleton Express routes for the new endpoints.
- Adding a starter Prisma (or Drizzle) schema for users and progress events.
- Updating workspace configuration so both apps build correctly.

## User Review Required

> [!IMPORTANT]
> The plan assumes **mobile (Expo Router) remains the primary app** and **web is first‑class** (shared backend contract). If you later decide to make web primary or drop mobile, the folder layout and some scripts will need adjustments.

> [!WARNING]
> The OpenAPI changes and server route skeletons will modify the `api-spec` and `api-server` packages. Ensure you have a clean Git branch before applying.

## Open Questions

1. **Database choice** – The repository currently contains a placeholder `lib/db` folder. Should we use Prisma schema (`schema.prisma`) or a plain TypeScript/Drizzle schema? (The plan defaults to Prisma.)
2. **Authentication flow** – Do you want a simple JWT token stored in `localStorage`/`AsyncStorage`, or a more complete OAuth flow? The plan implements a JWT‑style token.
3. **Client regeneration** – Do you want the plan to automatically run the Orval generation command (`npx orval ...`) now, or should it be left for you to run after the spec is updated?

## Proposed Changes

---
### Workspace & Build Setup

#### [MODIFY] `pnpm-workspace.yaml`
- Add the new web artifact to the `packages` glob.

#### [NEW] `artifacts/indori-wuolingo-web/README.md`
- Brief description of the web artifact.

#### [NEW] `artifacts/indori-wuolingo-web/package.json`
- Minimal package.json that declares the Vite + React dependencies (copy from existing web artifact).

#### [NEW] `artifacts/indori-wuolingo-web/vite.config.ts`
- Use the proven template from `Indore02`. Adjust `root` and `outDir` to point to this artifact.

#### [NEW] `artifacts/indori-wuolingo-web/index.html`
- Basic HTML entry point (copy from existing `artifacts/indori-wuolingo/index.html`).

---
### Move Web Source Code

#### [MODIFY] Move all files from `artifacts/indori-wuolingo/src/*` to `artifacts/indori-wuolingo-web/src/*`.
- Includes `App.tsx`, `pages/`, `components/`, `styles/`, etc.
- Update any relative imports that referenced `../src` to reference the new location.

---
### API Client Session & Auth Header

#### [MODIFY] `lib/api-client-react/src/custom-fetch.ts`
- Add logic to read `sessionToken` from `localStorage` (web) or `AsyncStorage` (mobile) and inject `Authorization: Bearer <token>` into every request.
- Export a helper `setSessionToken(token: string)` to store the token.

---
### Remove Hard‑Coded UserId from Web Pages

#### [MODIFY] `artifacts/indori-wuolingo-web/src/pages/home.tsx`
- Replace `useGetUser(1, …)` with `const { data: me } = useGetMe();` (generated hook) and pass `me?.userId` to child hooks.

#### [MODIFY] `artifacts/indori-wuolingo-web/src/pages/profile.tsx`
- Same replacement for `useListProgress({ userId: 1 })` → use `me?.userId`.

---
### OpenAPI Specification Expansion

#### [MODIFY] `lib/api-spec/openapi.yaml`
- Add paths for `/session` (POST), `/me` (GET, PATCH), `/progress/events` (POST), `/leaderboard` (GET), `/stats/overview` (GET).
- Define request/response schemas for `Session`, `User`, `ProgressEvent`, `LeaderboardEntry`, `StatsOverview`.
- Update `components` section with the new schemas.

---
### Regenerate Client & Zod Types (manual step)

- Command to run after spec update:
  ```bash
  npx orval --config lib/api-client-react/orval-config.ts
  npx orval --config lib/api-zod/orval-config.ts
  ```
- Add a script entry `gen:client` to the root `package.json` for convenience.

---
### Server Skeleton Routes

#### [NEW] `artifacts/api-server/src/routes/session.ts`
- Express router handling POST `/session` returning `{ userId, sessionToken }` (stub implementation).

#### [NEW] `artifacts/api-server/src/routes/me.ts`
- GET `/me` (returns user profile), PATCH `/me` (updates profile).

#### [NEW] `artifacts/api-server/src/routes/progress.ts`
- POST `/progress/events` (stores events, returns status).

#### [NEW] `artifacts/api-server/src/routes/leaderboard.ts`
- GET `/leaderboard` (returns top N users).

#### [NEW] `artifacts/api-server/src/routes/stats.ts`
- GET `/stats/overview` (returns aggregate stats).

#### [MODIFY] `artifacts/api-server/src/index.ts`
- Import and use the new routers.

---
### Database Schema Starter

#### [MODIFY] `lib/db/src/schema.prisma`
- Add `User`, `ProgressEvent`, and `LeaderboardEntry` models with appropriate fields, relations, and timestamps.

#### [NEW] `lib/db/prisma/seed.ts`
- Simple script to seed a few users and dummy events.

---
### Scripts & CI

#### [MODIFY] Root `package.json`
- Add `"gen:client": "npx orval --config lib/api-client-react/orval-config.ts && npx orval --config lib/api-zod/orval-config.ts"`
- Add `"build:web": "cd artifacts/indori-wuolingo-web && npm run build"`
- Add `"dev:web": "cd artifacts/indori-wuolingo-web && npm run dev"`
- Keep `"dev:mobile"` unchanged.

---
### Verification Plan

#### Automated Tests
- Run workspace type‑check: `pnpm run typecheck`.
- Run lint for both artifacts.
- Start the API server and hit the new routes with curl.
- Run the mobile app (`pnpm dev:mobile`) and web app (`pnpm dev:web`) and verify that pages no longer hard‑code `userId` and that API calls include the `Authorization` header.

#### Manual Verification
- Open the web UI, trigger a login flow (simulated by POST `/session`), ensure the token is stored and subsequent API calls include it.
- Verify the leaderboard fetch displays data from the server (stub data for now).
- Check that the DB schema migration runs without errors.

---
### Dependencies & Clean‑up

- Ensure `@tanstack/react-query` is configured with a `QueryClient` that has `defaultOptions.queries.staleTime = 5 * 60 * 1000` (5 minutes) as per the update recommendation.
- Remove any duplicate `QueryClient` instances if present.

---
**Next Steps**
- Once you approve this plan, I will start applying the changes step‑by‑step, committing each logical group, and running the verification steps.

---
*All file paths are absolute Windows style but use forward slashes for markdown links.*
