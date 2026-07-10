export type LangCode =
  | "ta" | "te" | "hi" | "bn" | "mr" | "gu" | "kn" | "ml"
  | "pa" | "or" | "as" | "ur" | "sa" | "kok" | "sd";

export interface Language {
  code: LangCode;
  name: string;
  native: string;
  greeting: string;
  script: string;
  fontFamily: string;
  aksharas: { char: string; roman: string; sound: string }[];
  words: { native: string; roman: string; meaning: string }[];
  phrases: { native: string; roman: string; meaning: string }[];
}

export type UnitKey = "script" | "numerals" | "words" | "phrases" | "grammar" | "conversation";

export interface Unit {
  key: UnitKey;
  title: string;
  subtitle: string;
}

export const UNITS: Unit[] = [
  { key: "script", title: "Script Basics", subtitle: "Learn the fundamental characters" },
  { key: "numerals", title: "Numbers", subtitle: "Count from 0 to 9" },
  { key: "words", title: "Essential Words", subtitle: "Build your vocabulary" },
  { key: "phrases", title: "Common Phrases", subtitle: "Everyday expressions" },
  { key: "grammar", title: "Grammar Foundations", subtitle: "Sentence structure basics" },
  { key: "conversation", title: "Conversation", subtitle: "Put it all together" },
];

const notoTamil = "'Noto Sans Tamil', serif";
const notoTelugu = "'Noto Sans Telugu', serif";
const notoDev = "'Noto Sans Devanagari', serif";
const notoBn = "'Noto Sans Bengali', serif";
const notoGu = "'Noto Sans Gujarati', serif";
const notoKn = "'Noto Sans Kannada', serif";
const notoMl = "'Noto Sans Malayalam', serif";
const notoPa = "'Noto Sans Gurmukhi', serif";
const notoOr = "'Noto Sans Oriya', serif";
const notoAr = "'Noto Sans Arabic', serif";

export const LANGUAGES: Language[] = [
  {
    code: "ta", name: "Tamil", native: "தமிழ்", greeting: "வணக்கம்",
    script: "Tamil", fontFamily: notoTamil,
    aksharas: [
      { char: "அ", roman: "a", sound: "a as in about" },
      { char: "ஆ", roman: "ā", sound: "aa as in far" },
      { char: "இ", roman: "i", sound: "i as in it" },
      { char: "ஈ", roman: "ī", sound: "ee as in see" },
      { char: "உ", roman: "u", sound: "u as in put" },
      { char: "க", roman: "ka", sound: "ka" },
      { char: "ம", roman: "ma", sound: "ma" },
      { char: "ந", roman: "na", sound: "na" },
    ],
    words: [
      { native: "அம்மா", roman: "ammā", meaning: "mother" },
      { native: "அப்பா", roman: "appā", meaning: "father" },
      { native: "நீர்", roman: "nīr", meaning: "water" },
      { native: "வீடு", roman: "vīdu", meaning: "home" },
      { native: "புத்தகம்", roman: "puttakam", meaning: "book" },
      { native: "நண்பன்", roman: "naṇban", meaning: "friend" },
      { native: "பள்ளி", roman: "paḷḷi", meaning: "school" },
      { native: "சாப்பாடு", roman: "sāppāḍu", meaning: "food" },
    ],
    phrases: [
      { native: "வணக்கம்", roman: "vaṇakkam", meaning: "hello" },
      { native: "நன்றி", roman: "naṉṟi", meaning: "thank you" },
      { native: "எப்படி இருக்கிறீர்கள்?", roman: "eppadi irukkiṟīrgaḷ?", meaning: "how are you?" },
    ],
  },
  {
    code: "te", name: "Telugu", native: "తెలుగు", greeting: "నమస్కారం",
    script: "Telugu", fontFamily: notoTelugu,
    aksharas: [
      { char: "అ", roman: "a", sound: "a" },
      { char: "ఆ", roman: "ā", sound: "aa" },
      { char: "ఇ", roman: "i", sound: "i" },
      { char: "ఈ", roman: "ī", sound: "ee" },
      { char: "ఉ", roman: "u", sound: "u" },
      { char: "క", roman: "ka", sound: "ka" },
      { char: "మ", roman: "ma", sound: "ma" },
      { char: "న", roman: "na", sound: "na" },
    ],
    words: [
      { native: "అమ్మ", roman: "amma", meaning: "mother" },
      { native: "నాన్న", roman: "nānna", meaning: "father" },
      { native: "నీళ్ళు", roman: "nīḷḷu", meaning: "water" },
      { native: "ఇల్లు", roman: "illu", meaning: "home" },
      { native: "పుస్తకం", roman: "pustakaṁ", meaning: "book" },
      { native: "స్నేహితుడు", roman: "snēhituḍu", meaning: "friend" },
      { native: "పాఠశాల", roman: "pāṭhaśāla", meaning: "school" },
      { native: "అన్నం", roman: "annaṁ", meaning: "rice/food" },
    ],
    phrases: [
      { native: "నమస్కారం", roman: "namaskāraṁ", meaning: "hello" },
      { native: "ధన్యవాదాలు", roman: "dhanyavādālu", meaning: "thank you" },
      { native: "మీరు ఎలా ఉన్నారు?", roman: "mīru elā unnāru?", meaning: "how are you?" },
    ],
  },
  {
    code: "hi", name: "Hindi", native: "हिन्दी", greeting: "नमस्ते",
    script: "Devanagari", fontFamily: notoDev,
    aksharas: [
      { char: "अ", roman: "a", sound: "a" },
      { char: "आ", roman: "ā", sound: "aa" },
      { char: "इ", roman: "i", sound: "i" },
      { char: "ई", roman: "ī", sound: "ee" },
      { char: "उ", roman: "u", sound: "u" },
      { char: "क", roman: "ka", sound: "ka" },
      { char: "म", roman: "ma", sound: "ma" },
      { char: "न", roman: "na", sound: "na" },
    ],
    words: [
      { native: "माँ", roman: "mā̃", meaning: "mother" },
      { native: "पिता", roman: "pitā", meaning: "father" },
      { native: "पानी", roman: "pānī", meaning: "water" },
      { native: "घर", roman: "ghar", meaning: "home" },
      { native: "किताब", roman: "kitāb", meaning: "book" },
      { native: "दोस्त", roman: "dost", meaning: "friend" },
      { native: "स्कूल", roman: "skūl", meaning: "school" },
      { native: "खाना", roman: "khānā", meaning: "food" },
    ],
    phrases: [
      { native: "नमस्ते", roman: "namaste", meaning: "hello" },
      { native: "धन्यवाद", roman: "dhanyavād", meaning: "thank you" },
      { native: "आप कैसे हैं?", roman: "āp kaise hain?", meaning: "how are you?" },
    ],
  },
  {
    code: "bn", name: "Bengali", native: "বাংলা", greeting: "নমস্কার",
    script: "Bengali", fontFamily: notoBn,
    aksharas: [
      { char: "অ", roman: "a", sound: "a" },
      { char: "আ", roman: "ā", sound: "aa" },
      { char: "ই", roman: "i", sound: "i" },
      { char: "ঈ", roman: "ī", sound: "ee" },
      { char: "উ", roman: "u", sound: "u" },
      { char: "ক", roman: "ka", sound: "ka" },
      { char: "ম", roman: "ma", sound: "ma" },
      { char: "ন", roman: "na", sound: "na" },
    ],
    words: [
      { native: "মা", roman: "mā", meaning: "mother" },
      { native: "বাবা", roman: "bābā", meaning: "father" },
      { native: "জল", roman: "jol", meaning: "water" },
      { native: "বাড়ি", roman: "bāṛi", meaning: "home" },
      { native: "বই", roman: "boi", meaning: "book" },
      { native: "বন্ধু", roman: "bondhu", meaning: "friend" },
      { native: "স্কুল", roman: "skul", meaning: "school" },
      { native: "খাবার", roman: "khābār", meaning: "food" },
    ],
    phrases: [
      { native: "নমস্কার", roman: "nomoshkar", meaning: "hello" },
      { native: "ধন্যবাদ", roman: "dhonnobād", meaning: "thank you" },
      { native: "কেমন আছেন?", roman: "kemon āchen?", meaning: "how are you?" },
    ],
  },
];

export function getLanguage(code: LangCode): Language {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}
