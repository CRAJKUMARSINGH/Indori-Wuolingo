# Robotic Test Suite

## Goal

Run the product like a classroom, not like a unit test file. The suite simulates:

- 21 users
- 15 languages
- every seeded lesson
- every exercise type
- offline seed validation by default
- optional real API mode

## Persona matrix

| Group | Count | Behavior |
|---|---:|---|
| Beginner | 7 | slow pace, frequent script mistakes, relies on romanization |
| Intermediate | 7 | mixed accuracy, faster progression, review queue usage |
| Expert | 7 | high accuracy, strict-mode candidate, leaderboard pressure |

## Test modes

Offline mode:

```bash
pnpm test:robotic
```

Real API mode:

```bash
ROBOTIC_REAL_API=1 pnpm test:robotic
```

Focused language/persona:

```bash
pnpm test:robotic -- --language hindi --persona beginner-01
```

## Assertions

For every language:

- language appears in selection grid
- first unit is script/alphabet where applicable
- every lesson has at least one exercise
- every exercise has prompt and answer data
- `match_pairs` has aligned pair IDs
- all option lists are unique enough for validation
- level tags are valid: beginner, intermediate, expert

For every simulated lesson:

- progress starts at 0 and ends at 100
- wrong answers record mistakes
- soft hearts never block completion
- hearts never go below 0
- completion returns correct count, total count, stars, XP
- review queue can master a missed exercise

## Sample result

```txt
Robotic suite summary
Mode: offline seed
Personas: 21
Languages: 15
Lessons visited: 945
Exercises answered: 7,560
match_pairs checked: 630
Soft hearts floor checks: passed
Review queue checks: passed
Failures: 0
Warnings: 3 content-normalization notes
```

## Implementation sketch

```ts
for (const persona of personas) {
  for (const language of languages) {
    const path = buildAdaptivePath({ persona, language });
    for (const lesson of path.lessons) {
      const result = await runLessonSimulation({
        persona,
        language,
        lesson,
        mode: process.env.ROBOTIC_REAL_API ? "api" : "offline",
        heartsMode: "soft",
      });
      assertLessonResult(result);
    }
  }
}
```

