import { describe, expect, it } from 'vitest';
import { Exercise } from '@workspace/api-client-react';
import { parseMatchPairs } from './match-pairs';

function makeExercise(overrides: Partial<Exercise>): Exercise {
  return {
    id: 'e1',
    lessonId: 'l1',
    type: 'match_pairs',
    prompt: 'Match the pairs',
    options: [],
    correctAnswer: '[]',
    order: 0,
    ...overrides,
  };
}

describe('parseMatchPairs', () => {
  it('parses the stable {id, left, right} JSON contract', () => {
    const pairs = [
      { id: 'a', left: 'नमस्ते', right: 'hello' },
      { id: 'b', left: 'धन्यवाद', right: 'thank you' },
    ];
    const exercise = makeExercise({ correctAnswer: JSON.stringify(pairs) });

    expect(parseMatchPairs(exercise)).toEqual(pairs);
  });

  it('upgrades the legacy [[left, right]] tuple format into keyed pairs', () => {
    const legacy = [
      ['नमस्ते', 'hello'],
      ['धन्यवाद', 'thank you'],
    ];
    const exercise = makeExercise({ correctAnswer: JSON.stringify(legacy) });

    expect(parseMatchPairs(exercise)).toEqual([
      { id: '0', left: 'नमस्ते', right: 'hello' },
      { id: '1', left: 'धन्यवाद', right: 'thank you' },
    ]);
  });

  it('falls back to splitting the options array in half on invalid JSON', () => {
    const exercise = makeExercise({
      correctAnswer: 'not-json',
      options: ['नमस्ते', 'धन्यवाद', 'hello', 'thank you'],
    });

    expect(parseMatchPairs(exercise)).toEqual([
      { id: '0', left: 'नमस्ते', right: 'hello' },
      { id: '1', left: 'धन्यवाद', right: 'thank you' },
    ]);
  });

  it('pads with an empty string when the options array is odd-length', () => {
    const exercise = makeExercise({
      correctAnswer: 'not-json',
      options: ['a', 'b', 'c'],
    });

    // half = floor(3 / 2) = 1 → left ["a"], right ["b", "c"]
    expect(parseMatchPairs(exercise)).toEqual([{ id: '0', left: 'a', right: 'b' }]);
  });

  it('returns an empty array when there is no usable data', () => {
    const exercise = makeExercise({ correctAnswer: '[]', options: [] });

    expect(parseMatchPairs(exercise)).toEqual([]);
  });
});
