# Content Contributor Guide

This guide is for anyone adding or editing language content in Indori-Wuolingo. It covers how to write exercises, validate Hindi script, add new units and lessons to `curriculum.ts`, and test your content in the app before opening a PR.

---

## How content works in this app

All lesson content lives in one file:

```
artifacts/indori-wuolingo/data/curriculum.ts
```

This file exports a `curriculum` array of `Unit` objects. Each unit contains `Lesson` objects. Each lesson contains `Exercise` objects. Changing this file is all you need to do to add or update any lesson content — no backend, no database, no config file.

The app reads this file directly at runtime. Every screen that shows lessons, exercises, or vocabulary is driven by this single source of truth.

---

## Data structure

### Unit

```typescript
{
  id: string;               // Unique. Use "unit4", "unit5", etc.
  title: string;            // English unit name: "Colors"
  titleHindi: string;       // Hindi unit name in Devanagari: "रंग"
  description: string;      // Short English subtitle: "Learn colors in Hindi"
  colorKey: "unit1" | "unit2" | "unit3" | "unit4";  // Controls unit header color
  lessons: Lesson[];
}
```

### Lesson

```typescript
{
  id: string;               // Unique. Format: "u4l1" (Unit 4, Lesson 1)
  title: string;            // English lesson name: "Basic Colors"
  subtitle: string;         // Short description: "Red, blue, green, and more"
  xpReward: number;         // XP awarded on completion. Use 10 or 15.
  exercises: Exercise[];
}
```

### Exercise

```typescript
{
  id: string;               // Unique. Format: "u4l1e1" (Unit 4, Lesson 1, Exercise 1)
  type: ExerciseType;       // One of four types — see below
  question: string;         // The question prompt shown to the learner
  options: string[];        // Always exactly 4 options
  correct: string;          // Must exactly match one of the 4 options
  hint?: string;            // Optional. Shown after answering. Cultural or language tip.
}
```

---

## Exercise types

There are four exercise types. Each type shapes how the question is presented and what kind of answer is expected.

### `translate_mc` — Translate from Hindi to English

Use when: the learner sees a Hindi word or phrase and picks the English meaning.

```typescript
{
  id: "u4l1e1",
  type: "translate_mc",
  question: "What does लाल mean?",
  options: ["Red", "Blue", "Green", "Yellow"],
  correct: "Red",
}
```

Rules:
- The Hindi word or phrase goes in the `question` field inside the sentence "What does X mean?"
- All four `options` must be English words or short phrases.
- The `correct` value must be word-for-word identical to one of the `options`.

---

### `en_to_hi_mc` — Translate from English to Hindi

Use when: the learner sees an English word and picks the correct Hindi (Devanagari) script answer.

```typescript
{
  id: "u4l1e2",
  type: "en_to_hi_mc",
  question: "How do you say 'Red' in Hindi?",
  options: ["लाल", "नीला", "हरा", "पीला"],
  correct: "लाल",
  hint: "Laal — you may have heard this word in Hindi songs."
}
```

Rules:
- All four `options` must be Hindi Devanagari script words or short phrases.
- Do not mix Devanagari and Roman script within the same options list.
- Include a `hint` whenever there is a cultural connection, a common phrase, or a memory aid.

---

### `script_mc` — Identify correct Devanagari script

Use when: you want to test whether the learner can recognize the correctly spelled Devanagari form of a word.

```typescript
{
  id: "u4l1e3",
  type: "script_mc",
  question: "Which is the correct Hindi script for 'Red'?",
  options: ["लाल", "लाल्", "लल", "लाला"],
  correct: "लाल",
}
```

Rules:
- The three wrong options must be plausible misspellings or similar-looking words — not random characters.
- A wrong option should differ from the correct one by one character, one matra, or one vowel mark.
- Do not use options that are completely unrelated words — the purpose is to teach script recognition, not to guess randomly.
- Verify every wrong option is actually incorrect. Do not accidentally use a valid Hindi word as a wrong option unless it clearly means something different.

---

### `match_pair` — Match word to meaning

Reserved for future use. Do not add `match_pair` exercises yet — the exercise renderer for this type is not yet implemented.

---

## ID naming rules

IDs must be unique across the entire curriculum. Use this format:

```
u{unitNumber}l{lessonNumber}e{exerciseNumber}
```

Examples:
- `u4l1e1` — Unit 4, Lesson 1, Exercise 1
- `u4l2e3` — Unit 4, Lesson 2, Exercise 3
- `u5l1e1` — Unit 5, Lesson 1, Exercise 1

Do not reuse or recycle IDs from deleted exercises. Increment the number.

---

## Hindi script rules

Getting Devanagari script right is the most important part of content quality. Errors here directly harm learners.

### Use Unicode Devanagari, not transliteration

Always write Hindi words in proper Devanagari Unicode. Never write Romanized Hindi (like "namaste" or "laal") in the `options` or `correct` fields of a Hindi exercise. Romanization may only appear in the `hint` field.

### Common matras (vowel marks) to check

| Matra | Example | Meaning |
|---|---|---|
| ा (aa) | माँ | mother |
| ि (i) | दिन | day |
| ी (ee) | तीन | three |
| ु (u) | गुलाब | rose |
| ू (oo) | भूख | hunger |
| े (e) | मेरा | mine |
| ै (ai) | है | is |
| ो (o) | खो | lose |
| ौ (au) | कौन | who |
| ं (anusvara) | हाँ | yes |
| ँ (chandrabindu) | माँ | mother |
| ः (visarga) | दुःख | sorrow |
| ् (halant/virama) | नमस्ते | hello |

Matras that are easy to confuse:
- `है` (is) vs `हैं` (are) — the anusvara makes them different words
- `माँ` (mother) vs `मां` — chandrabindu (ँ) is preferred in standard Hindi for माँ
- `नहीं` (no) — must include the chandrabindu above ही

### Verify before submitting

Before opening a PR with Hindi content:

1. Copy each Hindi string into Google Translate and verify the meaning.
2. Check the Devanagari spelling against a Hindi dictionary (Shabdkosh at shabdkosh.com is a reliable reference).
3. If you are unsure about a word, leave a comment in the PR and ask a native speaker to confirm.

### Do not guess

If you are not confident in the Devanagari spelling of a word, do not guess. Leave a placeholder and ask for review:

```typescript
question: "What does ___ mean?", // TODO: verify Devanagari spelling before merge
```

---

## Writing good exercises

### Each lesson should have 6–8 exercises

Six exercises keeps sessions short and completable in under 3 minutes. Eight is the maximum before fatigue sets in. Do not add more than 8 exercises per lesson.

### Mix exercise types within a lesson

A lesson with only `translate_mc` exercises feels repetitive. A good lesson alternates types:

```
Exercise 1: translate_mc
Exercise 2: en_to_hi_mc
Exercise 3: translate_mc
Exercise 4: en_to_hi_mc
Exercise 5: script_mc
Exercise 6: en_to_hi_mc
```

### Wrong options should be plausible

The three wrong options in any exercise should be:
- Related to the topic (other colors if the topic is colors, other family members if the topic is family)
- Similar enough that the learner has to think
- Not so similar that the exercise is unfair or confusing

Bad wrong options:
```
question: "What does लाल mean?"
options: ["Red", "Elephant", "Thursday", "Seventeen"]  // too unrelated, too easy
```

Good wrong options:
```
question: "What does लाल mean?"
options: ["Red", "Blue", "Pink", "Orange"]  // all colors, requires real knowledge
```

### Hints add cultural depth

Use `hint` for:
- Bollywood references: "You may have heard this in the song..."
- Memory aids: "Think of the English word 'laal' used in Indian restaurants..."
- Grammar context: "In Hindi, adjectives change form based on gender..."
- Cultural connection: "This word is used during Holi festival..."

Keep hints to 1–2 sentences. They appear after the learner answers, so they do not slow down the exercise flow.

---

## Adding a new unit

1. Open `artifacts/indori-wuolingo/data/curriculum.ts`
2. Add your new unit object to the end of the `curriculum` array
3. Give it the next available unit ID (`"unit4"`, `"unit5"`, etc.)
4. Give it the next available `colorKey` — cycle through `unit1`, `unit2`, `unit3`, `unit4`
5. Add at least 2 lessons with 6 exercises each before opening a PR
6. Update the `BADGES` array at the bottom of the file to add a badge for completing the new unit:

```typescript
{ id: "unit4_complete", title: "Color Expert", description: "Complete Unit 4", icon: "droplet" },
```

7. Add the badge check logic in `ProgressContext.tsx`:

```typescript
const unit4Lessons = curriculum[3].lessons.map((l) => l.id);
checkBadge("unit4_complete", unit4Lessons.every((id) => completedLessons.includes(id)));
```

---

## Adding a new lesson to an existing unit

1. Open `curriculum.ts`
2. Find the unit you want to extend
3. Add your new lesson object to the end of that unit's `lessons` array
4. Use the next lesson ID in sequence: if the unit already has `u2l1` and `u2l2`, add `u2l3`
5. Number your exercises starting from `u2l3e1`

Lessons are shown in the order they appear in the array. New lessons appear at the bottom of the unit path and are locked until the previous lesson is completed.

---

## Testing your content in the app

### Step 1 — Run the app

```bash
pnpm --filter @workspace/indori-wuolingo run dev
```

Scan the QR code with Expo Go on your phone.

### Step 2 — Clear existing progress (if needed)

If the lesson you want to test is locked because earlier lessons are not completed, you can temporarily reset progress:

On the Profile screen, there is no reset button yet (planned for a future release). To reset progress during development:

1. Close Expo Go on your phone.
2. Go to your phone's Settings → Apps → Expo Go → Storage → Clear Data.
3. Re-open Expo Go and scan the QR code.

Alternatively, add a temporary reset button in the Profile screen for local testing only. Do not commit a reset button to main.

### Step 3 — Complete the lesson manually

Walk through every exercise in your new lesson:

- Check that each question reads naturally
- Check that every `options` list makes sense
- Try selecting each wrong option — verify the red feedback shows the correct answer
- Select the correct option — verify the green feedback is clear
- Verify the lesson complete screen shows the correct XP amount

### Step 4 — Check script rendering

On your phone, verify that all Devanagari characters render correctly:

- No missing characters or boxes
- Matras align correctly above and below the base character
- The chandrabindu (ँ) on माँ renders as a small crescent moon above the vowel mark

If any character renders as a box or question mark on Android, that specific Unicode code point may not be supported by the default Android font. Avoid it or find an alternative spelling.

### Step 5 — Type check

```bash
pnpm --filter @workspace/indori-wuolingo run typecheck
```

This catches any TypeScript errors introduced by your changes — wrong field names, missing required fields, or type mismatches in exercise structure.

---

## Checklist before opening a content PR

- [ ] All Hindi strings verified against a Hindi dictionary or with a native speaker
- [ ] All exercise IDs are unique and follow the naming convention
- [ ] Each lesson has 6–8 exercises
- [ ] Exercise types are varied within each lesson
- [ ] Wrong options are plausible but clearly incorrect
- [ ] Hints are included for at least half the exercises in each lesson
- [ ] Walked through every exercise manually in Expo Go
- [ ] All Devanagari characters render correctly on device
- [ ] `pnpm run typecheck` passes
- [ ] PR description explains which unit/lessons were added and how content was verified

---

## Useful references

| Resource | URL | Use for |
|---|---|---|
| Shabdkosh Hindi Dictionary | shabdkosh.com | Verify Hindi word spelling and meaning |
| Google Translate | translate.google.com | Quick sanity check (not authoritative) |
| Devanagari Unicode Chart | unicode.org/charts/PDF/U0900.pdf | Check character code points |
| Hindi Wiktionary | hi.wiktionary.org | Definitions and usage examples in Hindi |
| NCERT Hindi Textbooks | ncert.nic.in | Curriculum-appropriate vocabulary for school topics |

---

## Questions about content

If you are unsure whether a word is correct, a cultural reference is appropriate, or a translation is accurate, open a GitHub issue with the label `content-review` and describe the question. Do not guess and merge — content errors are visible to every user and erode trust quickly.
