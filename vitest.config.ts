import { defineConfig } from "vitest/config";

// Root Vitest config for the monorepo.
//
// Unit tests live next to the pure logic they cover (see the `include` globs
// below). Integration-style suites under `tests/` and generated `artifacts/`
// output are intentionally excluded.
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["packages/**/*.test.ts", "apps/**/*.test.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "artifacts/**",
      "tests/robotic/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html"],
      include: [
        "packages/curriculum/src/helpers.ts",
        "packages/api-server/src/lib/progress.ts",
        "apps/web/src/lib/match-pairs.ts",
      ],
    },
  },
});
