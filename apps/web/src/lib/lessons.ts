import type { Language, UnitKey } from "@/data/languages";

export type Exercise =
  | { kind: "match-glyph"; prompt: string; correct: string; options: string[]; sub?: string; promptFont?: string }
  | { kind: "listen-pick"; native: string; correct: string; options: string[]; sub?: string; nativeFont?: string }
  | { kind: "translate"; from: "en" | "native"; text: string; correct: string; options: string[]; sub?: string; optionsFont?: string }
  | { kind: "arrange"; correct: string[]; tokens: string[]; meaning: string; tokenFont?: string }
  | { kind: "trace"; glyph: string; roman: string; meaning?: string; glyphFont?: string };

// Deterministic seeded PRNG for consistent lessons
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

type Rng = () => number;

function pickN<T>(rng: Rng, pool: T[], n: number, exclude: T): T[] {
  const rest = pool.filter((p) => p !== exclude);
  const out: T[] = [];
  while (out.length < n && rest.length) {
    const i = Math.floor(rng() * rest.length);
    out.push(rest.splice(i, 1)[0]);
  }
  return out;
}

function shuffle<T>(rng: Rng, arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rotate<T>(arr: T[], offset: number): T[] {
  if (!arr.length) return arr;
  const k = ((offset % arr.length) + arr.length) % arr.length;
  return arr.slice(k).concat(arr.slice(0, k));
}

export function buildLesson(lang: Language, unit: UnitKey, lessonIndex = 0): Exercise[] {
  const font = lang.fontFamily;
  const rng = mulberry32(hashStr(`${lang.code}:${unit}:${lessonIndex}`));

  if (unit === "script") {
    const chars = rotate(lang.aksharas, lessonIndex * 2);
    const romanPool = lang.aksharas.map((c) => c.roman);
    const glyphPool = lang.aksharas.map((c) => c.char);
    const out: Exercise[] = [];
    
    out.push({ kind: "trace", glyph: chars[0].char, roman: chars[0].roman, glyphFont: font });
    out.push({ kind: "trace", glyph: chars[3]?.char || chars[0].char, roman: chars[3]?.roman || chars[0].roman, glyphFont: font });
    
    for (const c of shuffle(rng, chars).slice(0, 6)) {
      out.push({
        kind: "match-glyph", prompt: c.char, promptFont: font, sub: c.sound,
        correct: c.roman,
        options: shuffle(rng, [c.roman, ...pickN(rng, romanPool, 3, c.roman)]),
      });
    }
    
    for (const c of shuffle(rng, chars).slice(0, 4)) {
      out.push({
        kind: "translate", from: "en",
        text: `Which letter sounds like "${c.roman}"?`,
        correct: c.char,
        options: shuffle(rng, [c.char, ...pickN(rng, glyphPool, 3, c.char)]),
        optionsFont: font,
      });
    }
    return out;
  }

  if (unit === "words") {
    const words = rotate(lang.words, lessonIndex);
    const meaningPool = lang.words.map((w) => w.meaning);
    const nativePool = lang.words.map((w) => w.native);
    const romanPool = lang.words.map((w) => w.roman);
    const out: Exercise[] = [];
    
    for (const w of shuffle(rng, words).slice(0, 6)) {
      out.push({
        kind: "match-glyph", prompt: w.native, promptFont: font, sub: w.roman,
        correct: w.meaning,
        options: shuffle(rng, [w.meaning, ...pickN(rng, meaningPool, 3, w.meaning)]),
      });
    }
    
    for (const w of shuffle(rng, words).slice(0, 5)) {
      out.push({
        kind: "translate", from: "en",
        text: `Choose the word for "${w.meaning}"`,
        correct: w.native,
        options: shuffle(rng, [w.native, ...pickN(rng, nativePool, 3, w.native)]),
        optionsFont: font, sub: w.roman,
      });
    }
    
    for (const w of shuffle(rng, words).slice(0, 2)) {
      out.push({
        kind: "listen-pick", native: w.native, nativeFont: font, sub: w.roman,
        correct: w.meaning,
        options: shuffle(rng, [w.meaning, ...pickN(rng, meaningPool, 2, w.meaning)]),
      });
    }
    return out;
  }

  if (unit === "phrases") {
    const phrases = rotate(lang.phrases, lessonIndex);
    const meaningPool = lang.phrases.map((p) => p.meaning);
    const nativePool = lang.phrases.map((p) => p.native);
    const out: Exercise[] = [];
    
    for (const p of phrases) {
      out.push({
        kind: "listen-pick", native: p.native, nativeFont: font, sub: p.roman,
        correct: p.meaning,
        options: shuffle(rng, [p.meaning, ...pickN(rng, meaningPool, 2, p.meaning)]),
      });
    }
    
    for (const p of phrases.slice(0, 3)) {
      out.push({
        kind: "translate", from: "en",
        text: `How do you say "${p.meaning}"?`,
        correct: p.native,
        options: shuffle(rng, [p.native, ...pickN(rng, nativePool, 3, p.native)]),
        optionsFont: font, sub: p.roman,
      });
    }
    
    for (const p of phrases.slice(0, 2)) {
      const tokens = p.native.split(/\s+/);
      if (tokens.length < 2) continue;
      const distractors = (phrases.find((q) => q !== p)?.native.split(/\s+/) ?? []).slice(0, 2);
      out.push({
        kind: "arrange", correct: tokens,
        tokens: shuffle(rng, [...tokens, ...distractors]),
        meaning: p.meaning, tokenFont: font,
      });
    }
    return out;
  }

  // Default mixed exercises for grammar/conversation
  const words = rotate(lang.words, lessonIndex);
  const phrases = rotate(lang.phrases, lessonIndex);
  const nativePool = lang.words.map((w) => w.native);
  const meaningPool = lang.words.map((w) => w.meaning);
  const mix: Exercise[] = [];
  
  for (const w of words.slice(0, 5)) {
    mix.push({
      kind: "translate", from: "en",
      text: `"${w.meaning}" in ${lang.name}?`,
      correct: w.native,
      options: shuffle(rng, [w.native, ...pickN(rng, nativePool, 3, w.native)]),
      optionsFont: font, sub: w.roman,
    });
  }
  
  for (const p of phrases.slice(0, 4)) {
    mix.push({
      kind: "listen-pick", native: p.native, nativeFont: font, sub: p.roman,
      correct: p.meaning,
      options: shuffle(rng, [p.meaning, ...pickN(rng, meaningPool, 2, p.meaning)]),
    });
  }
  
  return mix;
}

export const LESSONS_PER_UNIT = 12;
