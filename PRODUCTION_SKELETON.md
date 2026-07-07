# Production Skeleton

## Workspace

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tests/*"
```

```json
{
  "name": "indori-wuolingo",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "dev": "pnpm --parallel --filter @indori/api --filter @indori/web dev",
    "build": "pnpm -r build",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test",
    "test:robotic": "tsx tests/robotic/run-robotic-suite.ts",
    "seed": "tsx packages/curriculum/src/seed-db.ts"
  }
}
```

## Shared exercise model

```ts
export type ExerciseType =
  | "script_practice"
  | "multiple_choice"
  | "translate"
  | "fill_blank"
  | "match_pairs";

export type MatchPair = {
  id: string;
  left: string;
  right: string;
};

export type Exercise = {
  id: string;
  lessonId: string;
  type: ExerciseType;
  prompt: string;
  options: string[];
  correctAnswer: string;
  romanization?: string | null;
  nativeScript?: string | null;
  pairs?: MatchPair[];
  level?: "beginner" | "intermediate" | "expert";
  order: number;
};
```

## Correct match_pairs seeding

```ts
export function matchPairsExercise(input: {
  id: string;
  lessonId: string;
  prompt: string;
  pairs: MatchPair[];
  order: number;
}): Exercise {
  return {
    id: input.id,
    lessonId: input.lessonId,
    type: "match_pairs",
    prompt: input.prompt,
    pairs: input.pairs,
    options: input.pairs.flatMap((pair) => [pair.left, pair.right]),
    correctAnswer: JSON.stringify(input.pairs),
    order: input.order,
  };
}
```

## Correct two-column Match It player

```tsx
function MatchPairsView({
  exercise,
  onCorrect,
  onMistake,
}: {
  exercise: Exercise;
  onCorrect: () => void;
  onMistake: () => void;
}) {
  const pairs = exercise.pairs ?? JSON.parse(exercise.correctAnswer);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const rightOptions = useMemo(
    () => [...pairs].sort((a, b) => a.right.localeCompare(b.right)),
    [pairs],
  );

  function chooseRight(pairId: string) {
    if (!selectedLeft) return;

    if (selectedLeft === pairId) {
      const next = new Set(matched).add(pairId);
      setMatched(next);
      setSelectedLeft(null);
      if (next.size === pairs.length) onCorrect();
      return;
    }

    setSelectedLeft(null);
    onMistake();
  }

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="mb-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
        Match it
      </div>
      <h2 className="mb-6 text-center text-2xl font-bold">{exercise.prompt}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {pairs.map((pair) => (
            <button
              key={pair.id}
              disabled={matched.has(pair.id)}
              onClick={() => setSelectedLeft(pair.id)}
              className={cn(
                "h-16 w-full rounded-lg border-2 px-4 text-left text-lg font-semibold",
                selectedLeft === pair.id && "border-emerald-600 bg-emerald-50",
                matched.has(pair.id) && "opacity-30",
              )}
            >
              {pair.left}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {rightOptions.map((pair) => (
            <button
              key={pair.id}
              disabled={matched.has(pair.id)}
              onClick={() => chooseRight(pair.id)}
              className={cn(
                "h-16 w-full rounded-lg border-2 px-4 text-left text-lg font-semibold",
                matched.has(pair.id) && "opacity-30",
              )}
            >
              {pair.right}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Soft hearts state

```ts
type HeartsMode = "soft" | "strict";

export function applyAnswerResult(state: {
  hearts: number;
  mode: HeartsMode;
  isCorrect: boolean;
}) {
  if (state.isCorrect) return { ...state, blocked: false };

  const hearts = Math.max(0, state.hearts - 1);
  return {
    ...state,
    hearts,
    blocked: state.mode === "strict" && hearts === 0,
  };
}
```

## PWA config

```ts
// apps/web/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.png"],
      manifest: {
        name: "Indori-Wuolingo",
        short_name: "IndiLingo",
        start_url: "/",
        display: "standalone",
        background_color: "#fff8ed",
        theme_color: "#0f766e",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,json}"],
        runtimeCaching: [
          {
            urlPattern: /\/curriculum\/seed.*\.json$/,
            handler: "CacheFirst",
            options: { cacheName: "seed-curriculum" }
          },
          {
            urlPattern: /\/api\/lessons\/.*/,
            handler: "NetworkFirst",
            options: { cacheName: "lesson-api" }
          }
        ]
      }
    })
  ]
});
```

## Recommended implementation order

1. Copy the Indore10 web app into `apps/web`.
2. Extract seed data from `scripts/src/seed-indilingo.ts` into `packages/curriculum`.
3. Move Drizzle schema into `packages/db`.
4. Convert `ExercisePlayer` into `packages/exercise-player`.
5. Replace `match_pairs` bag matching with the two-column stable-pair contract.
6. Add `vite-plugin-pwa` and cache seed curriculum.
7. Add robotic tests before adding more content.
8. Bring Expo screens from Indore09 into `apps/mobile`.

