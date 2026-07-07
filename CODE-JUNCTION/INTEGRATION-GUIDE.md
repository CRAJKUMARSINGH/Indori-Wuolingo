# CODE JUNCTION Integration Guide

## Overview

CODE JUNCTION contains two additional codebases that can be imported to the root app or used for continuous app updation:

1. **Asset-Manager** - Expo/React Native mobile-first implementation
2. **Enterprise-Content-Hub** - React + Vite web implementation

---

## Project Structures

### Asset-Manager
```
Asset-Manager/
├── lib/
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-spec/            # OpenAPI spec (source of truth)
│   ├── api-zod/             # Generated Zod validation schemas
│   └── db/                  # Drizzle ORM schema + migrations
├── artifacts/
│   ├── api-server/          # Express REST API (✅ Builds successfully)
│   ├── indori-wuolingo/     # Expo/React Native frontend (⚠️ Needs Replit env vars)
│   └── mockup-sandbox/      # UI mockups (⚠️ Has TypeScript errors)
└── scripts/                 # Utility scripts
```

### Enterprise-Content-Hub
```
Enterprise-Content-Hub/
├── lib/
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-spec/            # OpenAPI spec (source of truth)
│   ├── api-zod/             # Generated Zod validation schemas
│   └── db/                  # Drizzle ORM schema + migrations
├── artifacts/
│   ├── api-server/          # Express REST API (✅ Builds successfully)
│   ├── indori-wuolingo/     # React + Vite web frontend (⚠️ Missing rollup module)
│   └── mockup-sandbox/      # UI mockups (✅ Typechecks successfully)
└── scripts/                 # Utility scripts
```

---

## Test Results

### Asset-Manager
- ✅ **API Server**: Builds successfully (1.4mb bundle)
- ⚠️ **Frontend (Expo)**: Fails build - requires Replit environment variables (`REPLIT_INTERNAL_APP_DOMAIN`, `REPLIT_DEV_DOMAIN`, or `EXPO_PUBLIC_DOMAIN`)
- ⚠️ **Mockup Sandbox**: TypeScript errors in calendar.tsx and spinner.tsx (React type conflicts)

### Enterprise-Content-Hub
- ✅ **API Server**: Builds successfully (2.2mb bundle)
- ✅ **Frontend (Vite)**: Builds successfully (367.67 kB JS + 106.63 kB CSS)
- ✅ **Frontend Typecheck**: Fixed import errors in lesson.tsx
- ✅ **Mockup Sandbox**: Typechecks successfully

---

## ✅ Integration Status: COMPLETED

### Root App Integration (June 28, 2026)
- ✅ **Shared Libraries**: Copied from Enterprise-Content-Hub to root `lib/`
- ✅ **API Server**: Copied to root `artifacts/api-server/` - builds successfully (2.2mb)
- ✅ **Frontend**: Copied to root `artifacts/indori-wuolingo/` - builds successfully (367.67 kB JS + 106.63 kB CSS)
- ✅ **Dependencies**: Installed with Windows platform fixes
- ✅ **Workspace**: Configured and functional

### Windows Platform Fixes Applied
- Commented out `@esbuild/win32-x64` override in `pnpm-workspace.yaml`
- Commented out `@rollup/rollup-win32-x64-msvc` override in `pnpm-workspace.yaml`
- Commented out `lightningcss-win32-x64-msvc` override in `pnpm-workspace.yaml`
- Commented out `@tailwindcss/oxide-win32-x64-msvc` override in `pnpm-workspace.yaml`
- Fixed React import errors in `lesson.tsx`
- Made PORT and BASE_PATH environment variables optional with defaults in `vite.config.ts`

### Build Commands Verified
```bash
# API Server
pnpm --filter @workspace/api-server run build  # ✅ Success

# Frontend
pnpm --filter @workspace/indori-wuolingo run build  # ✅ Success
```

---

## Integration Points

### Shared Libraries (lib/)

Both projects share the same library structure that can be integrated:

1. **api-spec** - OpenAPI specification
   - Location: `lib/api-spec/openapi.yaml`
   - Purpose: Source of truth for API contract
   - Integration: Copy to root app's lib directory

2. **api-client-react** - Generated React Query hooks
   - Location: `lib/api-client-react/`
   - Purpose: Type-safe API client for React
   - Integration: Add as workspace dependency or copy source

3. **api-zod** - Generated Zod schemas
   - Location: `lib/api-zod/`
   - Purpose: Runtime validation schemas
   - Integration: Add as workspace dependency or copy source

4. **db** - Drizzle ORM schema
   - Location: `lib/db/`
   - Purpose: Database schema and migrations
   - Integration: Copy schema files and migration scripts

### API Server (artifacts/api-server/)

Both projects have identical Express API servers:

- **Stack**: Express 5, Node.js 24, Drizzle ORM, Pino logging
- **Build**: esbuild (CJS bundle)
- **Integration**: 
  - Copy entire `artifacts/api-server/` directory
  - Update workspace dependencies in package.json
  - Set DATABASE_URL and SESSION_SECRET environment variables

### Frontend Options

**Option 1: Mobile-First (Asset-Manager)**
- Stack: Expo, React Native, React Query
- Best for: Mobile app development
- Requires: Expo CLI, Replit deployment environment (or local env vars)

**Option 2: Web-First (Enterprise-Content-Hub)**
- Stack: React 18, Vite, Tailwind CSS, Radix UI
- Best for: Web application
- Requires: Fix rollup dependency issue, fix React import errors

---

## Import Steps to Root App

### Step 1: Copy Shared Libraries
```bash
# Copy from either project (Enterprise-Content-Hub recommended for web)
cp -r CODE-JUNCTION/Enterprise-Content-Hub/lib/* lib/
```

### Step 2: Copy API Server
```bash
cp -r CODE-JUNCTION/Enterprise-Content-Hub/artifacts/api-server artifacts/
```

### Step 3: Copy Frontend (Choose One)
```bash
# For web:
cp -r CODE-JUNCTION/Enterprise-Content-Hub/artifacts/indori-wuolingo artifacts/

# For mobile:
cp -r CODE-JUNCTION/Asset-Manager/artifacts/indori-wuolingo artifacts/
```

### Step 4: Update Root package.json
Add workspace references to the new packages:
```json
{
  "workspaces": [
    "lib/*",
    "artifacts/*"
  ]
}
```

### Step 5: Install Dependencies
```bash
pnpm install
```

### Step 6: Set Environment Variables
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SESSION_SECRET=your-secret-here
```

### Step 7: Push Database Schema
```bash
pnpm --filter @workspace/db run push
```

---

## Issues to Resolve

### Enterprise-Content-Hub Frontend
1. **Missing rollup module**: Run `pnpm install` with `--force` flag or clear node_modules
2. **Import errors in lesson.tsx**: Change imports from 'wouter' to 'react':
   ```typescript
   // Before (incorrect)
   import { useState, useRef, useEffect } from 'wouter';
   
   // After (correct)
   import { useState, useRef, useEffect } from 'react';
   ```

### Asset-Manager Frontend
1. **Replit environment variables**: Set local equivalents or modify build script
2. **TypeScript errors in mockup-sandbox**: Resolve React type conflicts

---

## Continuous Updation Strategy

### Using API Spec as Source of Truth
1. Edit `lib/api-spec/openapi.yaml`
2. Regenerate clients: `pnpm --filter @workspace/api-spec run codegen`
3. Changes propagate to both api-zod and api-client-react

### Database Schema Updates
1. Edit `lib/db/schema.ts`
2. Generate migration: `pnpm --filter @workspace/db run generate`
3. Apply migration: `pnpm --filter @workspace/db run push`

### API Server Updates
1. Edit `artifacts/api-server/src/`
2. Build: `pnpm --filter @workspace/api-server run build`
3. Restart server

---

## Recommendations

1. **Use Enterprise-Content-Hub** for web integration (more modern stack with Vite + Radix UI)
2. **Use Asset-Manager** if mobile app is required
3. **Both API servers are identical** - choose either
4. **Shared libraries are compatible** between both projects
5. **Fix identified issues** before full integration

---

## Next Steps

1. Choose frontend implementation (web or mobile)
2. Resolve identified build issues
3. Copy selected components to root app
4. Test integration with existing root app code
5. Set up CI/CD for continuous updation
