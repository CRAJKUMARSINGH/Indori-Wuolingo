import { describe, expect, it } from "vitest";
import { matchPairsExercise } from "./helpers.js";
import type { MatchPair } from "./types.js";

const pairs: MatchPair[] = [
  { id: "1", left: "नमस्ते", right: "hello" },
  { id: "2", left: "धन्यवाद", right: "thank you" },
];

describe("matchPairsExercise", () => {
  it("builds an Exercise with the match_pairs type and echoes core fields", () => {
    const exercise = matchPairsExercise({
      id: "hindi-l1-e1",
      lessonId: "hindi-l1",
      prompt: "Match the greeting",
      pairs,
      order: 3,
    });

    expect(exercise).toMatchObject({
      id: "hindi-l1-e1",
      lessonId: "hindi-l1",
      type: "match_pairs",
      prompt: "Match the greeting",
      order: 3,
      pairs,
    });
  });

  it("flattens pairs into options as [left, right, left, right, ...]", () => {
    const exercise = matchPairsExercise({
      id: "e",
      lessonId: "l",
      prompt: "p",
      pairs,
      order: 0,
    });

    expect(exercise.options).toEqual([
      "नमस्ते",
      "hello",
      "धन्यवाद",
      "thank you",
    ]);
  });

  it("stores the authoritative pairs as JSON in correctAnswer", () => {
    const exercise = matchPairsExercise({
      id: "e",
      lessonId: "l",
      prompt: "p",
      pairs,
      order: 0,
    });

    expect(exercise.correctAnswer).toBe(JSON.stringify(pairs));
    expect(JSON.parse(exercise.correctAnswer)).toEqual(pairs);
  });

  it("produces empty options and an empty JSON array when there are no pairs", () => {
    const exercise = matchPairsExercise({
      id: "e",
      lessonId: "l",
      prompt: "p",
      pairs: [],
      order: 0,
    });

    expect(exercise.options).toEqual([]);
    expect(exercise.correctAnswer).toBe("[]");
  });
});
