# Three-App Architecture — Usage Report

## App Map

```
Indori-Wuolingo/
├── artifacts/indori-wuolingo/     ← ROOT APP  (deploys to /)
├── artifacts/code-junction/
│   ├── admin/                     ← CODE-JUNCTION APP 1 (deploys to /admin)
│   └── quiz/                      ← CODE-JUNCTION APP 2 (deploys to /quiz)
└── artifacts/api-server/          ← Shared API (all three apps call this)
```

All three apps share a **single PostgreSQL database** and a **single deployed API**.

---

## ROOT APP — `artifacts/indori-wuolingo/` (Main Learner Experience)

### What IS used
| Feature | Location |
|---|---|
| Home page — language selector grid (12 languages) | `src/pages/Home.tsx` |
| Learn page — vertical skill tree with locked/unlocked lessons | `src/pages/Learn.tsx` |
| Lesson page — interactive exercise flow (MCQ, translate, fill-blank) | `src/pages/Lesson.tsx` |
| Progress dashboard — XP, streaks, per-language breakdown | `src/pages/Progress.tsx` |
| Profile page — settings and achievements | `src/pages/Profile.tsx` |
| API hooks — `useListLanguages`, `useGetLesson`, `useSaveProgress`, etc. | `@workspace/api-client-react` |
| Framer Motion — page transitions, card animations, XP celebrations | throughout |
| wouter — client-side routing | `src/App.tsx` |
| TanStack Query — server state, caching, loading states | throughout |
| Tailwind CSS + shadcn/ui — design system | throughout |
| Streak tracking + XP accumulation on lesson completion | `src/pages/Lesson.tsx` |

### What is NOT yet used (available but unused)
| Feature | Reason / Next step |
|---|---|
| `match_pairs` exercise type | Defined in OpenAPI + DB schema, not yet rendered in lesson flow |
| `recharts` (charting library, already installed) | Could power XP-over-time chart on Progress page |
| `react-day-picker` (installed) | Could power streak calendar heatmap on Profile |
| `cmdk` command palette (installed) | Could add keyboard-shortcut search across languages |
| `next-themes` dark mode (installed) | Dark mode toggle on Profile page not wired yet |
| `embla-carousel` (installed) | Could carousel language cards on mobile home |
| Audio pronunciation | No audio recorded yet; Web Speech API hook not added |
| User accounts / auth | v1 is anonymous; Replit Auth or Clerk ready to add |
| Adaptive difficulty | All lessons unlock linearly; no AI personalisation yet |

---

## CODE-JUNCTION APP 1 — `/admin` (Admin Dashboard)

### What IS used
| Feature | Details |
|---|---|
| Overview tab — platform stats | Total languages, available count, total learners, total XP |
| Overview tab — learner progress table | All user progress records with language name, XP, streak |
| Languages tab — full language catalog | All 12 languages with native name, script, lesson count, availability badge |
| Lessons tab — per-language lesson browser | Dropdown to pick language → table of all lessons with level, XP reward |
| Learner Stats tab — per-language progress | XP, lessons completed, current and longest streak |
| Live data from API | All data fetched from `/api/languages`, `/api/progress`, `/api/streak` |

### What is NOT yet used / missing
| Feature | Reason / Next step |
|---|---|
| Add / Edit / Delete languages | Read-only dashboard; write API endpoints not yet exposed |
| Add / Edit exercises | Content editing UI not built |
| Enable/disable language toggle | UI checkbox present but `PATCH /languages/:id` endpoint missing |
| Bulk lesson upload | CSV/JSON import not built |
| User management | No auth in v1; multi-user admin not implemented |
| Export reports | Download CSV of progress data not built |
| Charts / analytics | Could use recharts for lesson completion trends |

---

## CODE-JUNCTION APP 2 — `/quiz` (Quick Quiz Practice)

### What IS used
| Feature | Details |
|---|---|
| Language selector | All available languages fetched from `/api/languages` |
| Exercise fetcher | Pulls lessons 1–3 for chosen language, aggregates all exercises |
| Multiple choice rendering | Tap-to-select answer tiles with visual feedback |
| Text input rendering | Type-in-the-blank for translate and fill_blank types |
| Correct/wrong feedback | Colour-coded feedback with correct answer reveal |
| Score tracking | 10 pts per correct answer, running total in header |
| Results screen | % score, correct/wrong count, XP earned, retry option |
| 5-question shuffled quiz | Random selection from available exercises |

### What is NOT yet used / missing
| Feature | Reason / Next step |
|---|---|
| `match_pairs` exercise type | Not rendered; exercises of this type are skipped |
| Timer / timed challenge mode | No countdown implemented |
| Saving quiz scores to DB | Quiz scores not POSTed to `/api/progress` |
| Leaderboard | No cross-user score comparison |
| Streak integration | Quiz completions don't update the main app's streak |
| Audio prompts | No sound on correct/incorrect |
| Offline mode | No service worker / cache |

---

## Shared Infrastructure — used by all three apps

| Component | Used by |
|---|---|
| PostgreSQL database (Drizzle ORM) | API server → all three apps via API |
| `/api/languages` endpoint | All three apps |
| `/api/lessons/:id` endpoint | Root app (lesson flow) + Quiz app |
| `/api/progress` endpoint | Root app (save XP) + Admin app (view) + Quiz app (future) |
| `/api/streak` endpoint | Root app + Admin app |
| OpenAPI spec (`lib/api-spec/openapi.yaml`) | Source of truth for all API contracts |
| Generated React Query hooks | Root app only (Admin + Quiz use raw `fetch`) |
| Zod validation schemas | API server input validation |

---

## Summary

| App | Purpose | Data source | Auth needed? |
|---|---|---|---|
| Root (`/`) | Learner experience | Live API + DB | No (anonymous) |
| Admin (`/admin`) | Content management | Live API + DB | Yes (future) |
| Quiz (`/quiz`) | Quick practice | Live API + DB | No |
