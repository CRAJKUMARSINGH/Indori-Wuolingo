import { Exercise } from '@workspace/api-client-react';

/** Stable MatchPair shape — mirrors packages/curriculum/src/types.ts */
export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

/**
 * Parse pairs from the stable {id, left, right} JSON contract.
 * Falls back to the legacy [[left, right]] tuple format for old data, and as a
 * last resort splits the flat `options` array in half.
 */
export function parseMatchPairs(exercise: Exercise): MatchPair[] {
  try {
    const parsed = JSON.parse(exercise.correctAnswer);
    // New contract: [{id, left, right}, ...]
    if (
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      typeof parsed[0] === 'object' &&
      'left' in parsed[0] &&
      'right' in parsed[0]
    ) {
      return parsed as MatchPair[];
    }
    // Legacy contract: [[left, right], ...]
    if (Array.isArray(parsed) && parsed.every((p) => Array.isArray(p) && p.length === 2)) {
      return (parsed as string[][]).map(([l, r], i) => ({ id: String(i), left: l, right: r }));
    }
  } catch {
    /* fall through to options-based fallback */
  }

  // Last resort: split options array in half
  const half = Math.floor(exercise.options.length / 2);
  const left = exercise.options.slice(0, half);
  const right = exercise.options.slice(half);
  return left.map((l, i) => ({ id: String(i), left: l, right: right[i] ?? '' }));
}
