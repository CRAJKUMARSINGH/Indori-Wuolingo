/**
 * Netlify Serverless Function — API handler
 *
 * This wraps the Express app with serverless-http so every request to
 * /api/* on the Netlify site is handled by the same Express routes that
 * run locally on PORT 3001.
 *
 * The netlify.toml redirect rule:
 *   /api/* → /.netlify/functions/api  (status 200, force)
 * routes all API traffic here.
 *
 * Required env vars (set in Netlify dashboard → Site settings → Env vars):
 *   DATABASE_URL   — PostgreSQL connection string (Neon / Supabase / Railway)
 *   SESSION_SECRET — JWT signing secret (min 32 random chars in prod)
 */

import serverless from "serverless-http";
import app from "../../artifacts/api-server/src/app";

export const handler = serverless(app);
