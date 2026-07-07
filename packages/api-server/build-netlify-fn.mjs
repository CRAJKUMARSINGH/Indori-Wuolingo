/**
 * Builds the Netlify serverless functions bundle from api-server context
 * so esbuild and esbuild-plugin-pino resolve correctly.
 *
 * Run via: pnpm --filter @workspace/api-server run build:netlify-fn
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm, mkdir } from "node:fs/promises";

// esbuild-plugin-pino uses require() internally
globalThis.require = createRequire(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// artifacts/api-server → go up two levels to workspace root
const rootDir    = path.resolve(__dirname, "../..");
const outDir     = path.resolve(rootDir, "netlify/functions-dist");

async function buildFunctions() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  await esbuild({
    entryPoints: [path.resolve(rootDir, "netlify/functions-src/api.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: outDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    external: [
      "*.node",
      "sharp",
      "better-sqlite3",
      "sqlite3",
      "canvas",
      "bcrypt",
      "argon2",
      "fsevents",
      "re2",
      "farmhash",
      "xxhash-addon",
      "bufferutil",
      "utf-8-validate",
      "ssh2",
      "cpu-features",
      "pg-native",
      "oracledb",
    ],
    plugins: [
      esbuildPluginPino({ transports: ["pino-pretty"] }),
    ],
    // CJS-in-ESM shim — same as the main API build
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
    },
    supported: { "top-level-await": true },
    sourcemap: "linked",
    tsconfig: path.resolve(__dirname, "tsconfig.json"),
  });

  console.log("✅  Netlify functions built →", outDir);
}

buildFunctions().catch((err) => {
  console.error(err);
  process.exit(1);
});
