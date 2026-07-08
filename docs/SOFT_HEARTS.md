# Soft Hearts Behavior

## Current MVP behavior

IndiLingo uses **soft hearts** for the MVP.

Wrong answers:

- decrement the displayed session hearts count
- record a mistake for spaced repetition
- show feedback and the correct answer
- allow the learner to continue

Hearts never go below 0. A learner with 0 hearts can keep practicing.

## Why soft hearts

Soft hearts are the right MVP default because:

- seed content still needs robotic and human validation
- beginners should not be blocked while learning a new script
- classrooms and pilots need completion data more than scarcity pressure
- strict mode can be added later without changing the exercise data model

## Future strict mode path

Add a config flag:

```ts
type HeartsMode = "soft" | "strict";
```

Strict mode behavior:

- hearts decrement on wrong answer
- at 0 hearts, the session pauses or exits
- user can recover hearts through review, time, premium, or teacher override
- strict mode can be scoped to exams, challenges, or advanced paths

## QA expectations

Soft hearts tests must verify:

- wrong answer changes hearts from 5 to 4
- repeated wrong answers stop at 0
- lesson continues at 0
- mistakes are recorded
- review queue includes missed exercises
- completion still calculates XP/stars from accuracy

