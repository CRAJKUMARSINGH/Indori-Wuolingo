# App_Theme.md — Indori-Wuolingo Developer Theme Document

> **This document is the single source of truth for what this product is, where it stands today, and the roadmap for taking it to enterprise grade.**
> Every developer on this team should read it before writing a line of code.

---

## 1. What Is Indori-Wuolingo?

Indori-Wuolingo is a **gamified Indian regional language learning platform** — India's answer to Duolingo, built specifically for the Indian linguistic landscape.

India has 22 constitutionally recognised languages and 780+ dialects. No dedicated gamified platform exists for them. Global competitors (Duolingo, Babbel) cover fewer than 3 Indian languages with shallow content. We exist to close that gap.

**One-line mission:** Democratise access to India's linguistic heritage by delivering a world-class, gamified language-learning platform — learnable whether you speak Hindi, English, or both.

---

## 2. Who We Build For

| Segment | Description |
|---|---|
| Urban Youth (18–30) | Curious about heritage languages they grew up hearing but never formally learned |
| Indian Diaspora | NRIs/PIOs in the US, UK, UAE, Canada maintaining language connection |
| Students | Preparing for competitive exams with regional language components |
| Professionals | Employees relocating inter-state (Delhi → Chennai, etc.) |
| Language Enthusiasts | Researchers, writers, creators exploring India's linguistic diversity |

---

## 3. Regional Language Catalogue — What We Teach & In What Base Language

The platform teaches **Indian regional languages** using either **Hindi or English as the base (interface) language**. This is the full catalogue — 22 constitutionally recognised languages plus key classical/diaspora additions.

### 3.1 Launch Targets (Phases 1–3)

These 6 languages ship first. Curriculum, audio, and script modules are the build priority.

| # | Language | Native Name | Script | Script Family | Base Languages | Primary Learner Region |
|---|---|---|---|---|---|---|
| 1 | **Hindi** *(current)* | हिन्दी | Devanagari | Brahmic | English | Pan-India, diaspora |
| 2 | **Marathi** | मराठी | Devanagari | Brahmic | Hindi · English | Maharashtra, diaspora |
| 3 | **Bengali** | বাংলা | Bengali | Brahmic | Hindi · English | West Bengal, Bangladesh diaspora |
| 4 | **Tamil** | தமிழ் | Tamil | Brahmic | Hindi · English | Tamil Nadu, Sri Lanka diaspora |
| 5 | **Telugu** | తెలుగు | Telugu | Brahmic | Hindi · English | Telangana, Andhra Pradesh |
| 6 | **Gujarati** | ગુજરાતી | Gujarati | Brahmic | Hindi · English | Gujarat, UK/US/East Africa diaspora |

### 3.2 Year-1 Expansion (Phases 4–6)

Add these 6 once the launch set is stable. Same build pattern.

| # | Language | Native Name | Script | Script Family | Base Languages | Primary Learner Region |
|---|---|---|---|---|---|---|
| 7 | **Punjabi** | ਪੰਜਾਬੀ | Gurmukhi | Brahmic | Hindi · English | Punjab, UK/Canada diaspora |
| 8 | **Kannada** | ಕನ್ನಡ | Kannada | Brahmic | Hindi · English | Karnataka |
| 9 | **Malayalam** | മലയാളം | Malayalam | Brahmic | Hindi · English | Kerala, Gulf diaspora |
| 10 | **Odia** | ଓଡ଼ିଆ | Odia | Brahmic | Hindi · English | Odisha |
| 11 | **Assamese** | অসমীয়া | Bengali (variant) | Brahmic | Hindi · English | Assam, Northeast India |
| 12 | **Urdu** | اُردُو | Nastaliq (Perso-Arabic) | Perso-Arabic | Hindi · English | UP, Hyderabad, Pakistan diaspora |

### 3.3 Year-2 Roadmap (Phase 7–8)

Complete the 22 official languages. Each requires a dedicated content specialist.

| # | Language | Native Name | Script | Script Family | Base Languages | Primary Learner Region |
|---|---|---|---|---|---|---|
| 13 | **Sanskrit** | संस्कृतम् | Devanagari | Brahmic | Hindi · English | Pan-India (classical/academic) |
| 14 | **Maithili** | मैथिली | Devanagari / Mithilakshar | Brahmic | Hindi · English | Bihar, Nepal Terai |
| 15 | **Santali** | ᱥᱟᱱᱛᱟᱲᱤ | Ol Chiki | Indigenous | Hindi · English | Jharkhand, West Bengal |
| 16 | **Kashmiri** | کٲشُر / कॉशुर | Sharada / Perso-Arabic | Both | Hindi · English | Jammu & Kashmir |
| 17 | **Nepali** | नेपाली | Devanagari | Brahmic | Hindi · English | Sikkim, Darjeeling, diaspora |
| 18 | **Sindhi** | سنڌي / सिन्धी | Perso-Arabic / Devanagari | Both | Hindi · English | Sindhi diaspora (global) |
| 19 | **Konkani** | कोंकणी | Devanagari / Roman | Brahmic | Hindi · English | Goa, coastal Karnataka |
| 20 | **Manipuri (Meitei)** | মেইতেই লোন্ | Meitei Mayek | Indigenous | Hindi · English | Manipur, Northeast India |
| 21 | **Bodo** | बड़ो | Devanagari | Brahmic | Hindi · English | Assam, Bodoland |
| 22 | **Dogri** | डोगरी | Devanagari / Takri | Brahmic | Hindi · English | Jammu region |

### 3.4 How Base Language Works (Developer Note)

Every exercise has a `baseLanguage` field: `"hi"` (Hindi) or `"en"` (English).

- **English base** → prompts and instructions in English, target content in regional language
- **Hindi base** → prompts and instructions in Hindi, target content in regional language
- Learner selects their base language during onboarding; the curriculum renders accordingly
- The `curriculum.ts` data model and OpenAPI schema must both support `baseLanguage` per exercise — this is a **Phase 1 architecture task**

### 3.5 Script Complexity Reference (for dev planning)

| Script Type | Languages | Rendering notes |
|---|---|---|
| Devanagari | Hindi, Marathi, Sanskrit, Nepali, Maithili, Bodo, Dogri, Konkani (partial) | ✅ Well-supported on all platforms |
| Bengali | Bengali, Assamese | ✅ Standard Unicode, verify older Android |
| Tamil | Tamil | ✅ Standard Unicode, test on Android 8 and below |
| Telugu | Telugu | ✅ Standard Unicode |
| Kannada | Kannada | ✅ Standard Unicode |
| Malayalam | Malayalam | ⚠️ Complex conjuncts — test rendering carefully on mobile |
| Gujarati | Gujarati | ✅ Standard Unicode |
| Gurmukhi | Punjabi | ✅ Standard Unicode |
| Odia | Odia | ⚠️ Less common — verify font availability on low-end Android |
| Perso-Arabic / Nastaliq | Urdu, Sindhi, Kashmiri | ⚠️ RTL layout required — needs `writingDirection: 'rtl'` on all text/input components |
| Ol Chiki | Santali | ⚠️ Rare — may need custom font bundling |
| Meitei Mayek | Manipuri | ⚠️ Rare — custom font required |
| Sharada / Takri | Kashmiri, Dogri (historical) | ℹ️ Reference only — use Devanagari as teaching script |

---

## 4. Current Product State (as of June 2026)

### 4.1 What is live and working

**Mobile App (Expo Router — primary)**
- Onboarding flow: Welcome → Language selection → Daily goal setting
- Home screen with curriculum map: unit cards + lesson nodes with locked/unlocked/completed states
- Streak, hearts, and XP stat pills in the header
- Daily goal progress card
- Lesson engine: multiple-choice and word-order exercise types
- Profile screen: XP, streak, lessons done, minutes studied, badges, per-unit progress, reset flow
- Leaderboard tab
- Review tab (spaced repetition surface)
- Dark/light mode via `useColors` hook
- AsyncStorage-based local progress (no backend auth yet)

**Web App (Vite + React — first-class artifact)**
- Routes: `/`, `/learn`, `/lesson/:id`, `/leaderboard`, `/profile`, `/stats`, `/onboarding/*`
- Deployed on Netlify
- Shared API contract with mobile via OpenAPI spec + generated React Query hooks

**API Server (Express 5 + Drizzle ORM + PostgreSQL)**
- Routes: `/api/health`, `/api/users`, `/api/lessons`, `/api/exercises`, `/api/progress`, `/api/checkin`, `/api/leaderboard`, `/api/stats`
- Structured logging via Pino
- Zod input validation on all routes
- esbuild CJS bundle (2.2 MB)

**Admin Dashboard (`/admin`)**
- Platform stats overview (languages, learners, XP)
- Learner progress table
- Language catalog (12 languages with native names, scripts, lesson counts)
- Lessons browser (per language, with level and XP reward)

**Quick Quiz (`/quiz`)**
- Language selector → randomised 5-question quiz
- Multiple-choice and text-input exercise rendering
- Score tracking and results screen

**Shared Infrastructure**
- pnpm workspaces monorepo (Node 24, TypeScript 5.9)
- OpenAPI spec as single source of truth (`lib/api-spec/openapi.yaml`)
- Orval-generated React Query hooks (`lib/api-client-react`)
- Orval-generated Zod schemas (`lib/api-zod`)
- Drizzle ORM schema (`lib/db`)
- GitHub Actions CI (typecheck on every PR)
- Netlify deployment

### 4.2 Curriculum coverage today

- Hindi track: Units covering Greetings, Numbers, Colours, Food, Travel, and more
- Exercise types active: Multiple Choice, Word Order
- Exercise types defined but not yet rendered: `match_pairs`
- Audio: not yet recorded or wired

### 4.3 Known gaps (honest assessment)

| Gap | Impact |
|---|---|
| No user authentication | All progress is local/anonymous; no cross-device sync |
| Hard-coded `userId: 1` in web pages | Must be replaced with session-aware `useGetMe()` hook |
| No audio pronunciation | Core language learning feature missing |
| `match_pairs` exercise not rendered | Defined in spec and DB but unreachable in lesson flow |
| Quiz scores not saved to DB | `/api/progress` not called after quiz completion |
| No push notifications | Streak reminders not implemented |
| No offline mode | No service worker or cache strategy |
| Admin is read-only | No content editing, no language enable/disable toggle |
| No WCAG 2.1 AA audit completed | Accessibility compliance not verified |
| Expo `app/` tree unreachable on Netlify | Mobile routes not served by current Vite deployment |

---

## 5. Architecture Overview

```
Indori-Wuolingo/
│
├── lib/                          ← Shared packages (source of truth)
│   ├── api-spec/openapi.yaml     ← OpenAPI spec — NEVER drift from this
│   ├── api-client-react/         ← Generated React Query hooks (run codegen after spec changes)
│   ├── api-zod/                  ← Generated Zod validation schemas
│   └── db/                       ← Drizzle ORM schema + migrations
│
├── artifacts/
│   ├── indori-wuolingo/          ← PRIMARY: Expo Router mobile + Vite web (same repo)
│   ├── indori-wuolingo-web/      ← Dedicated Vite web artifact (in progress)
│   ├── api-server/               ← Express 5 REST API
│   ├── code-junction/
│   │   ├── admin/                ← Admin dashboard (deploys to /admin)
│   │   └── quiz/                 ← Quick quiz (deploys to /quiz)
│   └── mockup-sandbox/           ← UI prototyping only
│
└── scripts/                      ← Utility and build scripts
```

**Single shared PostgreSQL database.** All three apps (learner, admin, quiz) read/write through the same API server.

**The OpenAPI spec is the contract.** Edit `lib/api-spec/openapi.yaml` first, then regenerate clients. Never hand-edit generated files.

---

## 6. Tech Stack Reference

| Layer | Technology |
|---|---|
| Mobile | Expo Router, React Native, expo-av, expo-notifications |
| Web | React 18, Vite, Tailwind CSS, shadcn/ui, Radix UI, Framer Motion |
| Routing (web) | wouter |
| State / data fetching | TanStack Query (React Query v5) |
| API | Express 5, Node.js 24 |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod (v4), drizzle-zod |
| API codegen | Orval (OpenAPI → React Query hooks + Zod schemas) |
| Build | esbuild (API), Vite (web), Metro (mobile) |
| Package manager | pnpm workspaces |
| Language | TypeScript 5.9 throughout |
| CI | GitHub Actions |
| Deployment | Netlify (web), App Store + Play Store (mobile — planned) |
| Logging | Pino |

---

## 7. Enterprise-Grade Improvement Plan

This section is structured in phases. Each phase builds on the previous. Phases 1–3 are the immediate priorities.

---

### Phase 1 — Stabilise the Foundation (Now → Month 1)

These are non-negotiable before any new features.

**Authentication & Sessions**
- [ ] Implement JWT-based session flow: `POST /api/session` → returns `{ userId, sessionToken }`
- [ ] Add `GET /api/me` and `PATCH /api/me` endpoints
- [ ] Inject `Authorization: Bearer <token>` header into all API calls via `custom-fetch.ts`
- [ ] Replace all hard-coded `userId: 1` in web pages with `useGetMe()` hook
- [ ] Persist token in `localStorage` (web) and `AsyncStorage` (mobile)
- [ ] Migrate local AsyncStorage progress to backend on first sign-in

**Exercise Completeness**
- [ ] Render `match_pairs` exercise type in the lesson flow (spec and DB already define it)
- [ ] Save quiz scores to `/api/progress` on quiz completion

**Data Integrity**
- [ ] Add `User`, `ProgressEvent`, and `LeaderboardEntry` models to Drizzle schema
- [ ] Run and verify DB migrations
- [ ] Add seed script for dev environment

**Build Health**
- [ ] Run `pnpm run typecheck` clean — zero errors
- [ ] Verify all workspace packages build successfully on Windows
- [ ] Document all env vars required (`DATABASE_URL`, `SESSION_SECRET`, etc.) in `.env.example`

---

### Phase 2 — Core Product Quality (Month 1–3)

**Audio & Script**
- [ ] Record or source native speaker audio for all current vocabulary items
- [ ] Wire `expo-av` audio playback to lesson exercise flow
- [ ] Add `audioUrl` field to curriculum data and API schema
- [ ] Build script-learning module for Devanagari (stroke order, character recognition)

**Accessibility**
- [ ] Audit all screens against WCAG 2.1 AA
- [ ] Add `accessibilityLabel` and `accessibilityRole` to all interactive elements
- [ ] Verify colour contrast ratios meet 4.5:1 minimum
- [ ] Keyboard navigation for web routes

**Performance**
- [ ] Page load under 2 seconds on 4G for all core web pages
- [ ] Add `staleTime: 5 * 60 * 1000` to TanStack Query `QueryClient` defaults
- [ ] Remove duplicate `QueryClient` instances
- [ ] Implement route-level code splitting on web (Vite lazy imports)

**Notifications & Engagement**
- [ ] Daily streak push notifications via `expo-notifications` (mobile)
- [ ] Email reminders for web users who break streak
- [ ] Streak freeze mechanic (1 free freeze per week)

---

### Phase 3 — Admin & Content Operations (Month 2–4)

The admin dashboard must become a real content management tool before we can scale curriculum.

**Content Management**
- [ ] `POST /api/languages` — create new language
- [ ] `PATCH /api/languages/:id` — enable/disable toggle (wire to admin UI checkbox)
- [ ] `POST /api/lessons` and `PATCH /api/lessons/:id` — create and edit lessons
- [ ] `POST /api/exercises` and `PATCH /api/exercises/:id` — manage exercises
- [ ] CSV/JSON bulk lesson import
- [ ] Content version history (know who changed what)

**User Management**
- [ ] Admin authentication (separate from learner auth)
- [ ] User list with search and filter
- [ ] Ability to reset a user's progress (support use case)
- [ ] Export learner progress as CSV

**Analytics**
- [ ] Lesson completion trends chart (recharts — already installed, unused)
- [ ] Drop-off rate per exercise type
- [ ] Answer accuracy rate per lesson

---

### Phase 4 — Mobile App Store Launch (Month 4–6)

- [ ] Fix Expo build — resolve `REPLIT_INTERNAL_APP_DOMAIN` / `EXPO_PUBLIC_DOMAIN` env var requirement for local/CI builds
- [ ] Add error boundaries to all major screens
- [ ] Integrate Sentry for crash reporting (mobile and web)
- [ ] Add PostHog analytics — lesson started, completed, session length, screen views
- [ ] Add deep links for sharing specific lessons
- [ ] App icon, splash screen, and App Store screenshots finalised
- [ ] Submit to TestFlight (iOS) and Google Play Internal Testing (Android)
- [ ] Tag `v0.1.0` release in git

---

### Phase 5 — Scale & Enterprise (Month 6–12)

**AI & Personalisation**
- [ ] Adaptive difficulty engine — easier options after 3+ errors in a session
- [ ] Spaced repetition review engine — surface high-error-rate words
- [ ] AI conversational practice (Hindi/English chatbot, basic dialogue scoring)

**Offline Mode**
- [ ] Service worker and cache strategy for web
- [ ] Download lesson packs for offline use on mobile
- [ ] Conflict resolution for progress sync when back online

**Institutional / B2B**
- [ ] "Teams" plan — institution admin creates class, invites learners
- [ ] Teacher dashboard: class progress, completion rates, assignment creation
- [ ] Monthly progress reports (exportable PDF)
- [ ] SOC 2 / ISO 27001 preparation for enterprise sales

**Multi-Language Expansion**
- [ ] Refactor curriculum to support multiple language tracks
- [ ] Language selection in onboarding (English → Hindi or English → Marathi)
- [ ] Tamil Unicode rendering verification across Android versions
- [ ] Bengali script support (separate from Devanagari)

**Infrastructure & Reliability**
- [ ] 99.9% API uptime SLA — horizontal scaling, connection pooling
- [ ] Blue-green or rolling deployment strategy (zero downtime)
- [ ] Rate limiting on all public API routes
- [ ] OWASP Top 10 compliance audit
- [ ] GDPR and India DPDP Act 2023 compliance for user data

---

## 8. Key Metrics We Track

| Metric | Week 52 Target | Week 200 Target |
|---|---|---|
| Daily Active Users | 5,000 | 100,000 |
| D1 Retention | 45% | 55% |
| D7 Retention | 22% | 35% |
| Lessons completed / DAU | 1.5 | 2.5 |
| Language tracks live | 1 (Hindi) | 7 |
| Total lessons | 30 | 200+ |
| MRR | $0 | $100,000+ |

---

## 9. Team Workflow

### Branching
- `main` is always stable and deployable
- All work happens on short-lived branches (`feature/`, `fix/`, `chore/`, `docs/`, `refactor/`)
- PRs require 1 approval for normal changes, 2 for shared-core / auth / DB changes
- Squash and merge preferred
- Tag releases from `main`: `v0.1.0`, `v1.0.0`, etc.

### Before every PR
```bash
pnpm run typecheck        # Zero errors required
pnpm run build            # All packages must build
pnpm --filter @workspace/api-server run build  # API bundle verified
```

### After changing the OpenAPI spec
```bash
pnpm --filter @workspace/api-spec run codegen
# Regenerates lib/api-client-react and lib/api-zod — commit both
```

### After changing the DB schema
```bash
pnpm --filter @workspace/db run generate   # Generate migration
pnpm --filter @workspace/db run push       # Apply to dev DB
```

### Environment variables required
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | JWT signing secret |
| `EXPO_PUBLIC_DOMAIN` | Expo Router origin (for non-Replit builds) |

---

## 10. Guiding Principles (Non-Negotiable)

**Cultural Authenticity** — All content is validated by native speakers. No machine-translated content without expert review.

**Learner First** — Every product decision is measured against its impact on learner engagement, retention, and language acquisition outcomes.

**Inclusive by Design** — Works on low-end devices, slow networks, and is accessible to learners with disabilities.

**OpenAPI as Contract** — The spec is the handshake between client and server. Edit spec first, generate second, implement third. Never the other way around.

**Ship Small, Ship Often** — Short branches, focused PRs, frequent merges. Long-lived branches cause pain.

**Don't Break Audio or Progress** — These two data flows (audio playback and progress saving) are the user's most critical experience paths. Test them before every merge.

---

## 11. Quick Reference — Where Things Live

| What you need | Where to find it |
|---|---|
| API contract | `lib/api-spec/openapi.yaml` |
| DB schema | `lib/db/src/schema.ts` |
| Generated API hooks | `lib/api-client-react/src/` |
| Generated Zod schemas | `lib/api-zod/src/` |
| Mobile app screens | `artifacts/indori-wuolingo/app/` |
| Web app pages | `artifacts/indori-wuolingo/src/pages/` |
| API routes | `artifacts/api-server/src/routes/` |
| Curriculum data | `artifacts/indori-wuolingo/data/curriculum.ts` |
| Admin dashboard | `artifacts/code-junction/admin/` |
| Quick quiz | `artifacts/code-junction/quiz/` |
| Long-term roadmap | `PLANNING NOTES/ACTION_PLAN_200_WEEKS.md` |
| Product objectives | `PLANNING NOTES/OBJECTIVE.md` |
| Genius Update plan | `IMPLEMENTATION_PLAN.md` |
| Three-app architecture | `PLANNING NOTES/CODE_JUNCTION_USAGE.md` |

---

*Document owner: Indori-Wuolingo core team*
*Last updated: June 2026*
*Review every quarter — update Phase 1/2/3 items as they are completed*
