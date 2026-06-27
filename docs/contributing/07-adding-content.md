# 07 · Adding Content

How to add new lessons, exercises, units, and badges to the curriculum.

All content lives in one file: `artifacts/indori-wuolingo/data/curriculum.ts`

---

## Content model overview

```
CURRICULUM: Unit[]
  └── Unit
        └── Lesson[]
              └── Exercise[]   (MULTIPLE_CHOICE | WORD_ORDER)

BADGES: Badge[]
LEADERBOARD_MOCK: LeaderboardEntry[]
```

---

## Adding an exercise to an existing lesson

Open `data/curriculum.ts` and find the lesson by its ID. Add a new entry to the `exercises` array.

### MULTIPLE_CHOICE exercise

```typescript
{
  id: 'u1l3e7',                   // must be globally unique: u{unit}l{lesson}e{exercise}
  type: 'MULTIPLE_CHOICE',
  prompt: 'Paani',                // the word or phrase being tested
  promptScript: 'पानी',           // Devanagari script (optional but include it for Hindi)
  promptTranslit: 'Paa-ni',       // romanized pronunciation guide (optional)
  hint: 'Essential for survival', // cultural or linguistic hint (optional)
  options: ['Water', 'Food', 'Fire', 'Air'],  // always 4 options
  correctIndex: 0,                // 0-based index of the correct answer
}
```

**Rules:**
- Always provide exactly 4 options
- The correct answer should not always be in position 0 — vary the position
- Include `promptScript` for any Hindi vocabulary lesson
- Keep `hint` short — one sentence maximum
- Distractors (wrong answers) should be plausible, not obviously wrong

### WORD_ORDER exercise

```typescript
{
  id: 'u2l1e4',
  type: 'WORD_ORDER',
  instruction: 'Arrange to say "My name is Priya"',  // what the user should build
  words: ['Mera', 'naam', 'hai', 'Priya'],           // the shuffled word tiles
  correctSentence: 'Mera naam hai Priya',             // exact correct answer (case-sensitive)
}
```

**Rules:**
- `words` array contains exactly the words that compose `correctSentence`
- `correctSentence` must be the exact string that results from joining `words` in the right order
- Keep sentences short — 4 to 6 words maximum
- Use transliteration (Roman script) not Devanagari for WORD_ORDER exercises (easier to tap)

---

## Adding a new lesson to an existing unit

Find the unit in `CURRICULUM` and add to its `lessons` array:

```typescript
{
  id: 'u2l3',                     // u{unit}l{lesson} — must be unique
  title: 'Colors',                // English display title
  titleHindi: 'रंग',              // Devanagari display title
  iconName: 'color-palette',      // Ionicons name — see https://icons.expo.fyi
  xpReward: 15,                   // XP granted on first completion
  exercises: [
    // ... 5 to 8 exercises (mix of types)
  ],
}
```

**Lesson content rules:**
- **5–8 exercises per lesson** — keeps sessions under 5 minutes
- Mix `MULTIPLE_CHOICE` and `WORD_ORDER` types — do not use only one type
- Include a `WORD_ORDER` exercise at the end of each lesson (synthesis activity)
- Exercise IDs must follow the pattern: `u{unitNum}l{lessonNum}e{exerciseNum}` (e.g. `u2l3e1`)
- `iconName` must be a valid [Ionicons](https://icons.expo.fyi) name

**XP guidelines:**

| Lesson difficulty | XP reward |
|---|---|
| Introductory (first in unit) | 10 |
| Standard | 15 |
| Challenging (later in unit) | 20 |
| Review / culture lesson | 10 |

---

## Adding a new unit

Add an entry to the `CURRICULUM` array in `data/curriculum.ts`:

```typescript
{
  id: 'unit6',                    // must be unique: unit1 through unitN
  title: 'Health',                // English title
  titleHindi: 'स्वास्थ्य',          // Devanagari title
  description: 'Body and wellness phrases',  // short subtitle shown in the UI
  color: '#7C3AED',               // unique color — used for lesson nodes and unit header
  lessons: [
    // ... add at least 2 lessons to make the unit worthwhile
  ],
}
```

**Unit color guidelines:**
- Each unit must have a visually distinct color
- Use saturated, accessible colors (avoid pastels — they don't work on both light and dark backgrounds)
- Existing unit colors: `#4F46E5` (indigo), `#0EA5E9` (sky), `#10B981` (emerald), `#F59E0B` (amber), `#EC4899` (pink)

---

## Adding a badge

Badges are defined in the `BADGES` array at the bottom of `curriculum.ts`:

```typescript
{
  id: 'streak_30',                 // unique string ID
  title: '30-Day Legend',          // display title (short)
  description: 'Study 30 days in a row',  // shown in profile
  icon: 'medal',                   // Ionicons name
  xpRequired: 0,                   // XP threshold (0 = not XP-based)
  lessonsRequired: 0,              // lesson count threshold (0 = not lesson-based)
  streakRequired: 30,              // streak threshold (0 = not streak-based)
}
```

**Badge award logic (in `AppContext.tsx → computeBadges`):**
- If `lessonsRequired > 0` → awarded when `completedLessons.length >= lessonsRequired`
- If `xpRequired > 0` → awarded when `xp >= xpRequired`
- If `streakRequired > 0` → awarded when `streak >= streakRequired`
- Badges are checked after every lesson completion and are permanent once earned

**Badge design rules:**
- Award for effort, not difficulty — milestones should feel reachable
- Space milestones so there is always a badge within 2–3 lessons reach
- `icon` must be a valid [Ionicons](https://icons.expo.fyi) name

---

## Exercise ID reference

IDs must be globally unique across the entire `curriculum.ts` file.

Format: `u{unitNumber}l{lessonNumber}e{exerciseNumber}`

Examples:
- `u1l1e1` — Unit 1, Lesson 1, Exercise 1
- `u3l2e5` — Unit 3, Lesson 2, Exercise 5
- `u5l1e6` — Unit 5, Lesson 1, Exercise 6

Never reuse or change existing IDs. The `wordBank` in `AppContext` uses exercise IDs as keys to track which words a user got wrong. Changing an ID silently resets that word's review history.

---

## Before opening a content PR

- [ ] All new IDs are unique (search `curriculum.ts` for the ID to confirm)
- [ ] `correctIndex` is tested — the right answer is actually correct
- [ ] `correctSentence` matches the words in `words` exactly
- [ ] `pnpm run typecheck` passes with zero errors
- [ ] Tested the new lesson end-to-end in the app
