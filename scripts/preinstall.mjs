import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const workspaceRoot = path.resolve(import.meta.dirname, "..");
const userAgent = process.env.npm_config_user_agent ?? "";

if (!userAgent.startsWith("pnpm/")) {
  console.error("Use pnpm instead");
  process.exit(1);
}

for (const filename of ["package-lock.json", "yarn.lock"]) {
  const filePath = path.join(workspaceRoot, filename);
  try {
    fs.rmSync(filePath, { force: true });
  } catch {
  }
}

