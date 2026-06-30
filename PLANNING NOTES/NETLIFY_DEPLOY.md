# Netlify Deployment Guide — Indori Wuolingo

## What deploys

| Path | Source | Description |
|---|---|---|
| `/` | `artifacts/indori-wuolingo/` | Main React learning app |
| `/admin` | `artifacts/code-junction/admin/` | Admin content dashboard |
| `/quiz` | `artifacts/code-junction/quiz/` | Quick quiz practice app |
| `/.netlify/functions/api` | `netlify/functions/api.ts` | Serverless Express API |

All four are deployed from this **single repo** in one `git push`.

---

## Step 1 — Hosted PostgreSQL database

Netlify does not include a database. You need a hosted PostgreSQL service.

**Recommended (free tiers available):**
- **Neon** → https://neon.tech (easiest, serverless Postgres)
- **Supabase** → https://supabase.com
- **Railway** → https://railway.app

Create a database on any of these and copy the `DATABASE_URL` connection string.

---

## Step 2 — Connect the repo to Netlify

1. Go to https://app.netlify.com → **Add new site → Import an existing project**
2. Choose **GitHub** and select `CRAJKUMARSINGH/Indori-Wuolingo`
3. Netlify will auto-detect the `netlify.toml` — **do not override any settings**
4. Click **Deploy site**

---

## Step 3 — Set environment variables

In the Netlify dashboard → **Site settings → Environment variables → Add a variable**:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your hosted Postgres connection string from Step 1 |

> No other environment variables are needed for production.

---

## Step 4 — Run database migrations on production

After the first successful deploy, your hosted database will be empty. Run the Drizzle migration once:

```bash
# On your local machine (with the production DATABASE_URL set):
DATABASE_URL="your-prod-url-here" pnpm --filter @workspace/db run push
```

Or set `DATABASE_URL` as a temporary local env var and run push.

---

## Step 5 — Seed production data (optional)

To populate languages, lessons, and exercises on production, run the seed script against the production database:

```bash
DATABASE_URL="your-prod-url-here" pnpm --filter @workspace/scripts run seed
```

---

## Build details

| Setting | Value |
|---|---|
| Build command | see `netlify.toml` |
| Publish directory | `artifacts/indori-wuolingo/dist/public` |
| Functions directory | `netlify/functions` |
| Node version | 20 |
| Package manager | pnpm (auto-detected) |

---

## Local production preview

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Link to your site
netlify link

# 3. Run local production preview (uses real env vars from Netlify)
netlify dev
```

---

## Routing reference

| Request | Goes to |
|---|---|
| `GET /api/languages` | Netlify Function → Express → PostgreSQL |
| `GET /api/progress` | Netlify Function → Express → PostgreSQL |
| `GET /admin` | Static HTML — Admin Dashboard |
| `GET /quiz` | Static HTML — Quick Quiz App |
| `GET /learn/1` | React SPA (`index.html`) → wouter handles client-side routing |
| `GET /progress` | React SPA (`index.html`) → wouter handles client-side routing |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| API returns 500 | Check `DATABASE_URL` env var in Netlify dashboard |
| Blank page on `/learn/...` or `/progress` | Check SPA redirect is in `netlify.toml` (`/* → /index.html`) |
| `/admin` or `/quiz` shows 404 | Confirm build copied the HTML files; check build log |
| DB connection timeout | Use a Postgres provider that supports serverless (Neon recommended) |
| `pnpm not found` in build | Netlify auto-detects pnpm from `pnpm-lock.yaml` — no config needed |
