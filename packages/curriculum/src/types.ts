// Shared exercise model — canonical definition for the whole monorepo.
// Aligned with Indore10's schema: text PKs, prompt (not question), order column.

export type ExerciseType =
  | "script_practice"
  | "multiple_choice"
  | "translate"
  | "fill_blank"
  | "match_pairs";

/** A single left↔right pair used by match_pairs exercises. */
export type MatchPair = {
  id: string;
  left: string;
  right: string;
};

export type Exercise = {
  id: string;           // text PK (e.g. "hindi-script-l1-e1")
  lessonId: string;     // text FK
  type: ExerciseType;
  prompt: string;       // renamed from "question" in Indore10
  options: string[];
  correctAnswer: string;
  romanization?: string | null;
  nativeScript?: string | null;
  pairs?: MatchPair[];  // decoded from correctAnswer for match_pairs
  level?: "beginner" | "intermediate" | "expert";
  order: number;
};
