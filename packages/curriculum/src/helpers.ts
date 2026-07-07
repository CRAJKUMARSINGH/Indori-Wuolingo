import type { Exercise, MatchPair } from "./types.js";

/**
 * Stable match_pairs contract.
 * options = flatMap([left, right]) so legacy clients can still display something.
 * correctAnswer = JSON.stringify(pairs) — the authoritative source of truth.
 */
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
