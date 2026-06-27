# 08 · Adding Exercise Types

How to extend the lesson engine with a new exercise type.

The exercise system is a typed union. Adding a new type requires changes in exactly three places.

---

## Current exercise types

| Type | File | What it does |
|---|---|---|
| `MULTIPLE_CHOICE` | `components/ExerciseView.tsx` | Tap one of 4 options to translate a word or phrase |
| `WORD_ORDER` | `components/ExerciseView.tsx` | Tap word tiles to build a sentence in the right order |

---

## Step 1 — Define the interface in `curriculum.ts`

Open `artifacts/indori-wuolingo/data/curriculum.ts` and add your interface:

```typescript
// Example: a listening exercise
export interface ListenAndChooseExercise {
  id: string;
  type: 'LISTEN_AND_CHOOSE';
  audioUrl: string;              // relative path to audio asset or URL
  prompt?: string;               // optional visual hint shown below the play button
  options: string[];             // 4 answer options
  correctIndex: number;          // 0-based index of the correct answer
}
```

Then extend the `Exercise` union type:

```typescript
// Before:
export type Exercise = MultipleChoiceExercise | WordOrderExercise;

// After:
export type Exercise = MultipleChoiceExercise | WordOrderExercise | ListenAndChooseExercise;
```

Run `pnpm run typecheck` immediately — TypeScript will now flag every place that handles `Exercise` but doesn't cover the new type.

---

## Step 2 — Add a renderer in `ExerciseView.tsx`

Open `artifacts/indori-wuolingo/components/ExerciseView.tsx`.

**Add a new component for the exercise type:**

```typescript
function ListenAndChooseView({
  exercise,
  onAnswer,
}: {
  exercise: ListenAndChooseExercise;
  onAnswer: (correct: boolean) => void;
}) {
  const colors = useColors();
  const [selected, setSelected] = useState<number | null>(null);
  const [state, setState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const handleSelect = async (index: number) => {
    if (state !== 'idle') return;
    setSelected(index);
    const correct = index === exercise.correctIndex;
    setState(correct ? 'correct' : 'wrong');
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(
        correct
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error
      );
    }
    setTimeout(() => onAnswer(correct), 1200);
  };

  return (
    <View style={styles.container}>
      {/* Audio play button */}
      <TouchableOpacity onPress={() => { /* play audio */ }} style={styles.audioBtn}>
        <Ionicons name="volume-high" size={48} color={colors.primary} />
      </TouchableOpacity>

      {/* Options */}
      {exercise.options.map((opt, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => handleSelect(i)}
          disabled={state !== 'idle'}
          style={[
            styles.option,
            selected === i && state === 'correct' && { backgroundColor: colors.success },
            selected === i && state === 'wrong' && { backgroundColor: colors.destructive },
          ]}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

**Wire it up in the main `ExerciseView` component:**

```typescript
export default function ExerciseView({ exercise, onAnswer }: ExerciseViewProps) {
  const handleAnswer = useCallback(
    (correct: boolean) => onAnswer(correct, exercise.id),
    [exercise.id, onAnswer]
  );

  if (exercise.type === 'MULTIPLE_CHOICE') {
    return <MultipleChoiceView exercise={exercise} onAnswer={handleAnswer} />;
  }

  if (exercise.type === 'WORD_ORDER') {
    return <WordOrderView exercise={exercise} onAnswer={handleAnswer} />;
  }

  // Add your new type here:
  if (exercise.type === 'LISTEN_AND_CHOOSE') {
    return <ListenAndChooseView exercise={exercise} onAnswer={handleAnswer} />;
  }

  // TypeScript exhaustive check — this should never be reached
  const _exhaustive: never = exercise;
  return null;
}
```

The `never` check at the bottom ensures TypeScript will error if you add a type to the union but forget to handle it in the renderer.

---

## Step 3 — Add exercises to lessons in `curriculum.ts`

```typescript
{
  id: 'u1l2e4',
  type: 'LISTEN_AND_CHOOSE',
  audioUrl: 'assets/audio/hindi/namaste.mp3',
  prompt: 'What does this word mean?',
  options: ['Hello', 'Goodbye', 'Please', 'Sorry'],
  correctIndex: 0,
}
```

---

## Step 4 — Add audio assets (for audio types)

Place audio files in:

```
artifacts/indori-wuolingo/assets/audio/hindi/
  namaste.mp3
  shukriya.mp3
  ...
```

Use consistent naming: `{transliterated-word}.mp3`

Audio specs:
- Format: MP3
- Sample rate: 44.1 kHz
- Duration: 0.5–3 seconds per word/phrase
- Recorded by a native speaker (not text-to-speech for MVP)
- Normalized loudness: -14 LUFS

---

## Checklist before opening the PR

- [ ] New interface defined in `curriculum.ts`
- [ ] Union type updated in `curriculum.ts`
- [ ] New renderer component added in `ExerciseView.tsx`
- [ ] `never` exhaustive check still present in `ExerciseView`
- [ ] At least 3 sample exercises of the new type added to a lesson
- [ ] `pnpm run typecheck` passes with zero errors
- [ ] New exercise type tested end-to-end: appears, answers work, advances to next exercise
- [ ] Correct/wrong haptics work on device (not just web)
- [ ] Wrong answers correctly added to `wordBank` in `AppContext`

---

## Design principles for new exercise types

- **Consistent feedback pattern** — use 1200ms delay before advancing (same as existing types)
- **Haptics** — always call `Haptics.notificationAsync` on device (guard with `Platform.OS !== 'web'`)
- **Color feedback** — green for correct, red for wrong, using `colors.success` and `colors.destructive`
- **Disabled state** — disable all interaction after the first tap so users cannot change their answer
- **Accessibility** — ensure the exercise works without audio (provide visual fallback for listening types)
