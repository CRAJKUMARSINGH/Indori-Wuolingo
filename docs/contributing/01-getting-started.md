# 01 · Getting Started

Everything you need to get Indori-Wuolingo running on your machine from scratch.

---

## Prerequisites

| Tool | Minimum version | Why |
|---|---|---|
| Node.js | 20 | Runtime for Metro bundler and build scripts |
| pnpm | 9 | Workspace package manager |
| Git | any | Version control |
| Expo Go | latest | Test on a real device (optional but recommended) |

### Install Node 20

```bash
# macOS / Linux (via nvm)
nvm install 20
nvm use 20

# Windows (via nvm-windows or fnm)
fnm install 20
fnm use 20
```

### Install pnpm

```bash
npm install -g pnpm
```

Verify:

```bash
node -v   # should print v20.x.x
pnpm -v   # should print 9.x.x
```

---

## Clone and install

```bash
git clone <repo-url>
cd indori-wuolingo
pnpm install
```

This installs all workspace packages — the Expo app, API server, and shared libraries — in one step.

---

## Run the app

```bash
pnpm --filter @workspace/indori-wuolingo run dev
```

You will see a QR code in the terminal.

| Target | How to open |
|---|---|
| **Physical device** | Scan QR with Expo Go (Android) or Camera (iOS) |
| **Web browser** | Open `http://localhost:20532` |
| **Android emulator** | Press `a` in the terminal |

> Web preview is the fastest way to iterate on UI. Use a real device to test haptics, safe area insets, and native animations.

---

## Run the API server (optional)

The MVP uses AsyncStorage only — no backend needed for app development. If you are working on the API server:

```bash
pnpm --filter @workspace/api-server run dev
```

The API runs on port 5000 and is proxied through the shared reverse proxy.

---

## Typecheck

Before pushing any code, run:

```bash
pnpm run typecheck
```

This checks all workspace packages. Zero errors required before opening a PR.

---

## Environment variables

For local development, no environment variables are required. The app runs entirely on AsyncStorage.

If you need the API client to point to a specific backend:

```bash
# create a .env.local in artifacts/indori-wuolingo/
EXPO_PUBLIC_DOMAIN=your-dev-domain.example.com
```

Do not commit `.env.local`. It is gitignored.

---

## Common first-run issues

| Symptom | Fix |
|---|---|
| `Metro bundler not found` | Run `pnpm install` again from the repo root |
| QR code doesn't work | Ensure your phone and computer are on the same Wi-Fi network |
| Web preview blank | Wait 15–30 seconds for the initial Metro bundle |
| TypeScript errors on fresh clone | Run `pnpm run typecheck:libs` first to build shared lib declarations |
| Port 20532 already in use | Stop any other running Expo instance |

---

## Next steps

- Read [02-project-structure.md](./02-project-structure.md) to understand where everything lives
- Read [03-how-to-contribute.md](./03-how-to-contribute.md) when you are ready to make a change
