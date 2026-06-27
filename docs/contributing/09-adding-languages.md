# 09 · Adding a New Language Track

How to add a second Indian language (Marathi, Tamil, Bengali, etc.) to Indori-Wuolingo.

The content model was designed from the start to support multiple languages without rebuilding the app.

---

## When to add a new language

Only start a new language track after:

1. The Hindi track has been validated with real users (retention, lesson completion)
2. At least one language expert is available to review the content
3. Native speaker audio is sourced or in progress
4. At least 2 full units (10+ lessons) of content are ready

Do not add a language as a stub with placeholder content — incomplete tracks harm trust.

---

## Step 1 — Create the curriculum file

Create `artifacts/indori-wuolingo/data/curriculum-marathi.ts` (or the language name).

Copy the structure from `curriculum.ts` and replace all content:

```typescript
// curriculum-marathi.ts

import type { Unit, Badge } from './curriculum';

export const MARATHI_CURRICULUM: Unit[] = [
  {
    id: 'mr_unit1',              // prefix with language code to avoid ID collisions
    title: 'Foundations',
    titleHindi: 'पाया',          // in the target language script
    description: 'Start with the basics',
    color: '#4F46E5',
    lessons: [
      {
        id: 'mr_u1l1',
        title: 'Greetings',
        titleHindi: 'अभिवादन',   // target language word
        iconName: 'hand-right',
        xpReward: 10,
        exercises: [
          {
            id: 'mr_u1l1e1',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Namaskar',
            promptScript: 'नमस्कार',
            promptTranslit: 'Na-mas-kar',
            options: ['Hello', 'Goodbye', 'Please', 'Thank you'],
            correctIndex: 0,
          },
          // ...
        ],
      },
    ],
  },
];

export const MARATHI_BADGES: Badge[] = [
  // same structure as BADGES in curriculum.ts
  // prefix IDs with 'mr_' to avoid collision
];
```

**ID convention for multi-language:**

| Language | ID prefix |
|---|---|
| Hindi | `u1l1e1` (no prefix — default) |
| Marathi | `mr_u1l1e1` |
| Tamil | `ta_u1l1e1` |
| Bengali | `bn_u1l1e1` |
| Telugu | `te_u1l1e1` |
| Kannada | `kn_u1l1e1` |
| Gujarati | `gu_u1l1e1` |

---

## Step 2 — Export from a barrel file

Create `artifacts/indori-wuolingo/data/index.ts` if it doesn't exist:

```typescript
export * from './curriculum';
export * from './curriculum-marathi';
// export * from './curriculum-tamil'; etc.
```

---

## Step 3 — Update `AppContext.tsx` to load the right curriculum

In `contexts/AppContext.tsx`, make `useUnlockedLessons` and any place that uses `CURRICULUM` read from the user's selected language:

```typescript
import { CURRICULUM, MARATHI_CURRICULUM } from '@/data';

function getCurriculumForLanguage(lang: string) {
  switch (lang) {
    case 'marathi': return MARATHI_CURRICULUM;
    default: return CURRICULUM;  // Hindi is the default
  }
}

export function useUnlockedLessons(): Set<string> {
  const { progress, userProfile } = useAppContext();
  const curriculum = getCurriculumForLanguage(userProfile?.targetLanguage ?? 'hindi');
  // ... rest of the logic unchanged
}
```

Apply the same pattern wherever `CURRICULUM` is referenced:
- `app/(tabs)/index.tsx` — home screen lesson path
- `app/(tabs)/review.tsx` — completed lessons list
- `app/(tabs)/profile.tsx` — unit progress
- `app/(tabs)/leaderboard.tsx` — no curriculum needed (XP is global)

---

## Step 4 — Enable the language in onboarding

Open `app/onboarding/language.tsx` and change `comingSoon: true` to `comingSoon: false` for the new language:

```typescript
const LANGUAGES = [
  { code: 'hindi', name: 'Hindi', script: 'हिंदी', flag: '🇮🇳', speakers: '600M+ speakers' },
  { code: 'marathi', name: 'Marathi', script: 'मराठी', flag: '🇮🇳', speakers: '83M speakers' },
  // ↑ remove comingSoon: true
  ...
];
```

---

## Step 5 — Add language-specific colors (optional)

If the new language track uses a distinct color palette (e.g. different unit colors), define them in `constants/colors.ts`:

```typescript
// Optional: language-specific unit colors
marathi_unit1: '#0F766E',
marathi_unit2: '#B45309',
```

Or reuse the existing unit color tokens — they are language-agnostic.

---

## Step 6 — Add audio assets

Create a subfolder:

```
artifacts/indori-wuolingo/assets/audio/marathi/
  namaskar.mp3
  dhanyawad.mp3
  ...
```

Audio requirements: see [08-adding-exercise-types.md](./08-adding-exercise-types.md) for specs.

---

## Language expert review checklist

Before merging a new language track, a language expert must confirm:

- [ ] All `promptScript` entries are correct in the target script
- [ ] All `promptTranslit` romanizations follow a consistent scheme
- [ ] All `correctSentence` values in WORD_ORDER exercises are grammatically correct
- [ ] No offensive, insensitive, or culturally inappropriate examples
- [ ] Examples use Indian names, places, and situations — not generic Western ones
- [ ] Audio assets (if included) are recorded by a native speaker, not TTS

---

## Minimum viable language track

To ship a language as production-ready (not `comingSoon`):

| Requirement | Target |
|---|---|
| Units | 3+ |
| Lessons per unit | 2+ |
| Exercises per lesson | 5–8 |
| Total exercises | 30+ |
| Badges | 3+ (first lesson, first unit, XP milestone) |
| Audio (if LISTEN type used) | 100% of prompts |
| Language expert review | Required |
