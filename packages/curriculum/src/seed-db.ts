import { db, languagesTable, unitsTable, lessonsTable, exercisesTable } from "@indori/db";

// ─── helpers ────────────────────────────────────────────────────────────────

function scriptLesson(
  langId: string,
  unitId: string,
  lessonNum: number,
  title: string,
  characters: {
    char: string;
    romanization: string;
    meaning: string;
    distractors: string[];
  }[],
): { lesson: typeof lessonsTable.$inferInsert; exercises: typeof exercisesTable.$inferInsert[] } {
  const lessonId = `${langId}-script-l${lessonNum}`;
  const exercises: typeof exercisesTable.$inferInsert[] = characters.flatMap((c, ci) => [
    // Exercise 1: See romanization → pick correct script character
    {
      id: `${lessonId}-e${ci * 2 + 1}`,
      lessonId,
      type: "script_practice" as const,
      prompt: `Which character is "${c.romanization}"? (${c.meaning})`,
      options: shuffle([c.char, ...c.distractors.slice(0, 3)]),
      correctAnswer: c.char,
      romanization: c.romanization,
      nativeScript: c.char,
      order: ci * 2 + 1,
    },
    // Exercise 2: See script character → pick correct romanization
    {
      id: `${lessonId}-e${ci * 2 + 2}`,
      lessonId,
      type: "script_practice" as const,
      prompt: `How do you say "${c.char}"?`,
      options: shuffle([c.romanization, ...(["aa", "ii", "ee", "oo", "ka", "pa", "ma", "sa", "ta", "na"].filter((x) => x !== c.romanization).slice(0, 3))]),
      correctAnswer: c.romanization,
      romanization: c.romanization,
      nativeScript: c.char,
      order: ci * 2 + 2,
    },
  ]);
  return {
    lesson: { id: lessonId, unitId, title, order: lessonNum, xpReward: 15 },
    exercises,
  };
}

function vocabLesson(
  langId: string,
  unitId: string,
  lessonNum: number,
  title: string,
  items: {
    english: string;
    native: string;
    romanization: string;
    options: string[];
  }[],
): { lesson: typeof lessonsTable.$inferInsert; exercises: typeof exercisesTable.$inferInsert[] } {
  const lessonId = `${langId}-vocab-u${unitId.split("-u")[1]}-l${lessonNum}`;
  const exercises: typeof exercisesTable.$inferInsert[] = items.flatMap((item, i) => [
    {
      id: `${lessonId}-e${i * 2 + 1}`,
      lessonId,
      type: "multiple_choice" as const,
      prompt: `What is "${item.english}" in this language?`,
      options: shuffle([item.native, ...item.options.slice(0, 3)]),
      correctAnswer: item.native,
      romanization: item.romanization,
      nativeScript: item.native,
      order: i * 2 + 1,
    },
    {
      id: `${lessonId}-e${i * 2 + 2}`,
      lessonId,
      type: "translate" as const,
      prompt: `Translate: ${item.native} (${item.romanization})`,
      options: shuffle([item.english, ...(["Sun", "Water", "Mother", "House", "Food", "Tree", "Book", "Hand", "Eye", "Heart"].filter((x) => x !== item.english).slice(0, 3))]),
      correctAnswer: item.english,
      romanization: item.romanization,
      nativeScript: item.native,
      order: i * 2 + 2,
    },
  ]);
  return {
    lesson: { id: lessonId, unitId, title, order: lessonNum, xpReward: 10 },
    exercises,
  };
}

function greetingsLesson(
  langId: string,
  unitId: string,
  lessonNum: number,
  items: { english: string; native: string; romanization: string }[],
): { lesson: typeof lessonsTable.$inferInsert; exercises: typeof exercisesTable.$inferInsert[] } {
  const lessonId = `${langId}-greet-l${lessonNum}`;
  const allNative = items.map((i) => i.native);
  const exercises: typeof exercisesTable.$inferInsert[] = items.map((item, i) => ({
    id: `${lessonId}-e${i + 1}`,
    lessonId,
    type: "multiple_choice" as const,
    prompt: `How do you say "${item.english}"?`,
    options: shuffle([item.native, ...allNative.filter((n) => n !== item.native).slice(0, 3)]),
    correctAnswer: item.native,
    romanization: item.romanization,
    nativeScript: item.native,
    order: i + 1,
  }));
  return {
    lesson: { id: lessonId, unitId, title: "Greetings & Introductions", order: lessonNum, xpReward: 10 },
    exercises,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── language data ───────────────────────────────────────────────────────────

const LANGUAGES = [
  { id: "hindi", name: "Hindi", nativeName: "हिन्दी", flagEmoji: "🇮🇳", colorTheme: "#FF6B00", description: "The most widely spoken language of India, written in Devanagari script.", scriptName: "Devanagari", totalLearners: 28400 },
  { id: "marathi", name: "Marathi", nativeName: "मराठी", flagEmoji: "🇮🇳", colorTheme: "#E91E63", description: "Language of Maharashtra, sharing the Devanagari script with Hindi.", scriptName: "Devanagari", totalLearners: 9200 },
  { id: "bengali", name: "Bengali", nativeName: "বাংলা", flagEmoji: "🇮🇳", colorTheme: "#3F51B5", description: "One of the most spoken languages in the world, rich in literature and poetry.", scriptName: "Bengali Script", totalLearners: 18700 },
  { id: "gujarati", name: "Gujarati", nativeName: "ગુજરાતી", flagEmoji: "🇮🇳", colorTheme: "#8BC34A", description: "Language of Gujarat with a unique cursive script.", scriptName: "Gujarati Script", totalLearners: 7300 },
  { id: "tamil", name: "Tamil", nativeName: "தமிழ்", flagEmoji: "🇮🇳", colorTheme: "#FF5722", description: "One of the world's oldest classical languages with a 2000-year literary tradition.", scriptName: "Tamil Script", totalLearners: 12600 },
  { id: "telugu", name: "Telugu", nativeName: "తెలుగు", flagEmoji: "🇮🇳", colorTheme: "#009688", description: "The most widely spoken Dravidian language, known for its melodious sound.", scriptName: "Telugu Script", totalLearners: 11400 },
  { id: "punjabi", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flagEmoji: "🇮🇳", colorTheme: "#FF9800", description: "Language of the Punjab, written in the elegant Gurmukhi script.", scriptName: "Gurmukhi", totalLearners: 8900 },
  { id: "malayalam", name: "Malayalam", nativeName: "മലയാളം", flagEmoji: "🇮🇳", colorTheme: "#673AB7", description: "Language of Kerala, known for its complex and beautiful script.", scriptName: "Malayalam Script", totalLearners: 6800 },
  { id: "kannada", name: "Kannada", nativeName: "ಕನ್ನಡ", flagEmoji: "🇮🇳", colorTheme: "#F44336", description: "Ancient Dravidian language of Karnataka with a rich literary tradition.", scriptName: "Kannada Script", totalLearners: 7100 },
  { id: "odia", name: "Odia", nativeName: "ଓଡ଼ିଆ", flagEmoji: "🇮🇳", colorTheme: "#00BCD4", description: "Language of Odisha, with a distinctively rounded script.", scriptName: "Odia Script", totalLearners: 4200 },
  { id: "assamese", name: "Assamese", nativeName: "অসমীয়া", flagEmoji: "🇮🇳", colorTheme: "#4CAF50", description: "Language of Assam in northeast India, closely related to Bengali.", scriptName: "Assamese Script", totalLearners: 3100 },
  { id: "urdu", name: "Urdu", nativeName: "اردو", flagEmoji: "🇮🇳", colorTheme: "#9C27B0", description: "A beautiful Persianized form of Hindustani, written in Nastaliq script (right-to-left).", scriptName: "Nastaliq (Perso-Arabic)", totalLearners: 15200 },
  { id: "kashmiri", name: "Kashmiri", nativeName: "कॉशुर", flagEmoji: "🇮🇳", colorTheme: "#795548", description: "Language of the Kashmir Valley with a rich poetic tradition.", scriptName: "Devanagari / Nastaliq", totalLearners: 1800 },
  { id: "nepali", name: "Nepali", nativeName: "नेपाली", flagEmoji: "🇮🇳", colorTheme: "#607D8B", description: "Also spoken widely in North Bengal and Sikkim, written in Devanagari.", scriptName: "Devanagari", totalLearners: 3600 },
  { id: "sindhi", name: "Sindhi", nativeName: "سنڌي", flagEmoji: "🇮🇳", colorTheme: "#FF4081", description: "Ancient language of the Indus Valley civilization, written in Perso-Arabic script.", scriptName: "Perso-Arabic / Devanagari", totalLearners: 2400 },
];

// ─── build seed data ─────────────────────────────────────────────────────────

type LangSeed = {
  lang: typeof LANGUAGES[0];
  units: {
    unit: typeof unitsTable.$inferInsert;
    lessons: { lesson: typeof lessonsTable.$inferInsert; exercises: typeof exercisesTable.$inferInsert[] }[];
  }[];
};

function buildHindi(): LangSeed {
  const lang = LANGUAGES.find((l) => l.id === "hindi")!;
  const scriptUnitId = "hindi-u1";
  const greetUnitId = "hindi-u2";
  const numbersUnitId = "hindi-u3";
  const foodUnitId = "hindi-u4";
  return {
    lang,
    units: [
      {
        unit: { id: scriptUnitId, languageId: "hindi", title: "Script & Alphabet", description: "Learn to read and write Devanagari — the script used for Hindi", unitType: "script", order: 1 },
        lessons: [
          scriptLesson("hindi", scriptUnitId, 1, "Vowels: अ आ इ ई", [
            { char: "अ", romanization: "a", meaning: "short A sound", distractors: ["आ", "इ", "उ", "ए"] },
            { char: "आ", romanization: "aa", meaning: "long A sound", distractors: ["अ", "इ", "ई", "ए"] },
            { char: "इ", romanization: "i", meaning: "short I sound", distractors: ["ई", "उ", "ए", "अ"] },
            { char: "ई", romanization: "ii", meaning: "long I sound", distractors: ["इ", "अ", "ए", "उ"] },
          ]),
          scriptLesson("hindi", scriptUnitId, 2, "Vowels: उ ऊ ए ओ", [
            { char: "उ", romanization: "u", meaning: "short U sound", distractors: ["ऊ", "ए", "ओ", "अ"] },
            { char: "ऊ", romanization: "uu", meaning: "long U sound", distractors: ["उ", "ए", "ओ", "इ"] },
            { char: "ए", romanization: "e", meaning: "E sound", distractors: ["ओ", "उ", "अ", "इ"] },
            { char: "ओ", romanization: "o", meaning: "O sound", distractors: ["ए", "उ", "अ", "ई"] },
          ]),
          scriptLesson("hindi", scriptUnitId, 3, "Consonants: क ख ग घ", [
            { char: "क", romanization: "ka", meaning: "K sound", distractors: ["ख", "ग", "घ", "च"] },
            { char: "ख", romanization: "kha", meaning: "KH sound", distractors: ["क", "ग", "घ", "च"] },
            { char: "ग", romanization: "ga", meaning: "G sound", distractors: ["क", "ख", "घ", "ज"] },
            { char: "घ", romanization: "gha", meaning: "GH sound", distractors: ["क", "ग", "ख", "ज"] },
          ]),
          scriptLesson("hindi", scriptUnitId, 4, "Consonants: च छ ज झ", [
            { char: "च", romanization: "cha", meaning: "CH sound", distractors: ["छ", "ज", "झ", "क"] },
            { char: "छ", romanization: "chha", meaning: "CHH sound", distractors: ["च", "ज", "झ", "क"] },
            { char: "ज", romanization: "ja", meaning: "J sound", distractors: ["च", "छ", "झ", "ग"] },
            { char: "झ", romanization: "jha", meaning: "JH sound", distractors: ["च", "ज", "छ", "ग"] },
          ]),
          scriptLesson("hindi", scriptUnitId, 5, "Consonants: त थ द ध न", [
            { char: "त", romanization: "ta", meaning: "T sound (dental)", distractors: ["थ", "द", "ध", "न"] },
            { char: "थ", romanization: "tha", meaning: "TH sound", distractors: ["त", "द", "ध", "न"] },
            { char: "द", romanization: "da", meaning: "D sound (dental)", distractors: ["त", "थ", "ध", "न"] },
            { char: "न", romanization: "na", meaning: "N sound", distractors: ["त", "द", "ध", "म"] },
          ]),
          scriptLesson("hindi", scriptUnitId, 6, "Consonants: प फ ब म स", [
            { char: "प", romanization: "pa", meaning: "P sound", distractors: ["फ", "ब", "म", "स"] },
            { char: "म", romanization: "ma", meaning: "M sound", distractors: ["प", "ब", "न", "स"] },
            { char: "स", romanization: "sa", meaning: "S sound", distractors: ["प", "म", "ब", "न"] },
            { char: "र", romanization: "ra", meaning: "R sound", distractors: ["ल", "म", "न", "व"] },
          ]),
        ],
      },
      {
        unit: { id: greetUnitId, languageId: "hindi", title: "Greetings & Phrases", description: "Essential greetings and polite phrases in Hindi", unitType: "phrases", order: 2 },
        lessons: [
          greetingsLesson("hindi", greetUnitId, 1, [
            { english: "Hello / Namaste", native: "नमस्ते", romanization: "Namaste" },
            { english: "Good morning", native: "सुप्रभात", romanization: "Suprabhat" },
            { english: "Thank you", native: "धन्यवाद", romanization: "Dhanyavaad" },
            { english: "Please", native: "कृपया", romanization: "Kripaya" },
            { english: "Yes", native: "हाँ", romanization: "Haan" },
            { english: "No", native: "नहीं", romanization: "Nahin" },
          ]),
        ],
      },
      {
        unit: { id: numbersUnitId, languageId: "hindi", title: "Numbers", description: "Count from 1 to 10 in Hindi", unitType: "vocabulary", order: 3 },
        lessons: [
          vocabLesson("hindi", numbersUnitId, 1, "Numbers 1–5", [
            { english: "One", native: "एक", romanization: "ek", options: ["दो", "तीन", "चार", "पाँच"] },
            { english: "Two", native: "दो", romanization: "do", options: ["एक", "तीन", "चार", "पाँच"] },
            { english: "Three", native: "तीन", romanization: "teen", options: ["एक", "दो", "चार", "पाँच"] },
            { english: "Four", native: "चार", romanization: "chaar", options: ["एक", "दो", "तीन", "पाँच"] },
            { english: "Five", native: "पाँच", romanization: "paanch", options: ["एक", "दो", "तीन", "चार"] },
          ]),
          vocabLesson("hindi", numbersUnitId, 2, "Numbers 6–10", [
            { english: "Six", native: "छह", romanization: "chha", options: ["सात", "आठ", "नौ", "दस"] },
            { english: "Seven", native: "सात", romanization: "saat", options: ["छह", "आठ", "नौ", "दस"] },
            { english: "Eight", native: "आठ", romanization: "aath", options: ["छह", "सात", "नौ", "दस"] },
            { english: "Nine", native: "नौ", romanization: "nau", options: ["छह", "सात", "आठ", "दस"] },
            { english: "Ten", native: "दस", romanization: "das", options: ["छह", "सात", "आठ", "नौ"] },
          ]),
        ],
      },
      {
        unit: { id: foodUnitId, languageId: "hindi", title: "Food & Market", description: "Common food words and market phrases", unitType: "vocabulary", order: 4 },
        lessons: [
          vocabLesson("hindi", foodUnitId, 1, "Common Foods", [
            { english: "Water", native: "पानी", romanization: "paani", options: ["खाना", "दूध", "चाय", "रोटी"] },
            { english: "Food / Meal", native: "खाना", romanization: "khaana", options: ["पानी", "दूध", "चाय", "रोटी"] },
            { english: "Bread", native: "रोटी", romanization: "roti", options: ["पानी", "खाना", "दूध", "चाय"] },
            { english: "Milk", native: "दूध", romanization: "doodh", options: ["पानी", "खाना", "चाय", "रोटी"] },
            { english: "Tea", native: "चाय", romanization: "chaay", options: ["पानी", "खाना", "दूध", "रोटी"] },
          ]),
        ],
      },
    ],
  };
}

function buildSimpleLang(
  langId: string,
  scriptChars: { char: string; romanization: string; meaning: string; distractors: string[] }[],
  greetings: { english: string; native: string; romanization: string }[],
  numbers: { english: string; native: string; romanization: string }[],
  foods: { english: string; native: string; romanization: string }[],
): LangSeed {
  const lang = LANGUAGES.find((l) => l.id === langId)!;
  const scriptUnitId = `${langId}-u1`;
  const greetUnitId = `${langId}-u2`;
  const numbersUnitId = `${langId}-u3`;
  const foodUnitId = `${langId}-u4`;

  const chunkSize = 4;
  const scriptLessons: { lesson: typeof lessonsTable.$inferInsert; exercises: typeof exercisesTable.$inferInsert[] }[] = [];
  for (let i = 0; i < Math.min(scriptChars.length, 16); i += chunkSize) {
    const chunk = scriptChars.slice(i, i + chunkSize);
    const lessonNum = Math.floor(i / chunkSize) + 1;
    const chunkLabel = chunk.map((c) => c.char).join(" ");
    scriptLessons.push(scriptLesson(langId, scriptUnitId, lessonNum, `Characters: ${chunkLabel}`, chunk));
  }

  const numberOptions = numbers.map((n) => n.native);
  const numberExercises: typeof exercisesTable.$inferInsert[] = numbers.slice(0, 5).map((num, i) => ({
    id: `${langId}-num-l1-e${i + 1}`,
    lessonId: `${langId}-num-l1`,
    type: "multiple_choice" as const,
    prompt: `What is "${num.english}" in this language?`,
    options: shuffle([num.native, ...numberOptions.filter((n) => n !== num.native).slice(0, 3)]),
    correctAnswer: num.native,
    romanization: num.romanization,
    nativeScript: num.native,
    order: i + 1,
  }));

  const foodOptions = foods.map((f) => f.native);
  const foodExercises: typeof exercisesTable.$inferInsert[] = foods.slice(0, 5).map((f, i) => ({
    id: `${langId}-food-l1-e${i + 1}`,
    lessonId: `${langId}-food-l1`,
    type: "translate" as const,
    prompt: `Translate: ${f.native} (${f.romanization})`,
    options: shuffle([f.english, ...["Sun", "Water", "Mother", "House", "Food", "Tree", "Book", "Hand"].filter((x) => x !== f.english).slice(0, 3)]),
    correctAnswer: f.english,
    romanization: f.romanization,
    nativeScript: f.native,
    order: i + 1,
  }));

  const greetOptions = greetings.map((g) => g.native);
  const greetExercises: typeof exercisesTable.$inferInsert[] = greetings.slice(0, 6).map((g, i) => ({
    id: `${langId}-greet-l1-e${i + 1}`,
    lessonId: `${langId}-greet-l1`,
    type: "multiple_choice" as const,
    prompt: `How do you say "${g.english}"?`,
    options: shuffle([g.native, ...greetOptions.filter((n) => n !== g.native).slice(0, 3)]),
    correctAnswer: g.native,
    romanization: g.romanization,
    nativeScript: g.native,
    order: i + 1,
  }));

  return {
    lang,
    units: [
      {
        unit: { id: scriptUnitId, languageId: langId, title: "Script & Alphabet", description: `Learn to read and write ${lang.scriptName}`, unitType: "script", order: 1 },
        lessons: scriptLessons,
      },
      {
        unit: { id: greetUnitId, languageId: langId, title: "Greetings & Phrases", description: "Essential greetings and polite phrases", unitType: "phrases", order: 2 },
        lessons: [
          {
            lesson: { id: `${langId}-greet-l1`, unitId: greetUnitId, title: "Greetings & Introductions", order: 1, xpReward: 10 },
            exercises: greetExercises,
          },
        ],
      },
      {
        unit: { id: numbersUnitId, languageId: langId, title: "Numbers", description: "Count from 1 to 10", unitType: "vocabulary", order: 3 },
        lessons: [
          {
            lesson: { id: `${langId}-num-l1`, unitId: numbersUnitId, title: "Numbers 1–10", order: 1, xpReward: 10 },
            exercises: numberExercises,
          },
        ],
      },
      {
        unit: { id: foodUnitId, languageId: langId, title: "Food & Daily Life", description: "Essential vocabulary for food and daily life", unitType: "vocabulary", order: 4 },
        lessons: [
          {
            lesson: { id: `${langId}-food-l1`, unitId: foodUnitId, title: "Common Foods", order: 1, xpReward: 10 },
            exercises: foodExercises,
          },
        ],
      },
    ],
  };
}

// ─── all language seeds ───────────────────────────────────────────────────────

const ALL_SEEDS: LangSeed[] = [
  buildHindi(),

  buildSimpleLang(
    "marathi",
    [
      { char: "अ", romanization: "a", meaning: "short A", distractors: ["आ", "इ", "उ", "ए"] },
      { char: "आ", romanization: "aa", meaning: "long A", distractors: ["अ", "इ", "उ", "ए"] },
      { char: "इ", romanization: "i", meaning: "short I", distractors: ["ई", "उ", "ए", "अ"] },
      { char: "क", romanization: "ka", meaning: "K sound", distractors: ["ख", "ग", "च", "ज"] },
      { char: "ग", romanization: "ga", meaning: "G sound", distractors: ["क", "ख", "घ", "ज"] },
      { char: "ज", romanization: "ja", meaning: "J sound", distractors: ["च", "झ", "ग", "क"] },
      { char: "त", romanization: "ta", meaning: "T sound", distractors: ["थ", "द", "ध", "न"] },
      { char: "म", romanization: "ma", meaning: "M sound", distractors: ["प", "ब", "न", "स"] },
    ],
    [
      { english: "Hello / Namaste", native: "नमस्कार", romanization: "Namaskar" },
      { english: "Thank you", native: "धन्यवाद", romanization: "Dhanyavaad" },
      { english: "Yes", native: "हो", romanization: "Ho" },
      { english: "No", native: "नाही", romanization: "Naahi" },
      { english: "How are you?", native: "कसे आहात?", romanization: "Kase aahat?" },
      { english: "Good", native: "चांगले", romanization: "Chaangle" },
    ],
    [
      { english: "One", native: "एक", romanization: "ek" },
      { english: "Two", native: "दोन", romanization: "don" },
      { english: "Three", native: "तीन", romanization: "teen" },
      { english: "Four", native: "चार", romanization: "chaar" },
      { english: "Five", native: "पाच", romanization: "paach" },
    ],
    [
      { english: "Water", native: "पाणी", romanization: "paani" },
      { english: "Food", native: "जेवण", romanization: "jevan" },
      { english: "Bread", native: "भाकरी", romanization: "bhaakri" },
      { english: "Milk", native: "दूध", romanization: "doodh" },
      { english: "Tea", native: "चहा", romanization: "chaha" },
    ],
  ),

  buildSimpleLang(
    "bengali",
    [
      { char: "অ", romanization: "o", meaning: "O/A sound", distractors: ["আ", "ই", "উ", "এ"] },
      { char: "আ", romanization: "aa", meaning: "long A", distractors: ["অ", "ই", "উ", "এ"] },
      { char: "ই", romanization: "i", meaning: "short I", distractors: ["ঈ", "উ", "এ", "অ"] },
      { char: "ক", romanization: "ka", meaning: "K sound", distractors: ["খ", "গ", "ঘ", "চ"] },
      { char: "গ", romanization: "ga", meaning: "G sound", distractors: ["ক", "খ", "ঘ", "জ"] },
      { char: "ত", romanization: "ta", meaning: "T sound", distractors: ["থ", "দ", "ধ", "ন"] },
      { char: "ম", romanization: "ma", meaning: "M sound", distractors: ["প", "ব", "ন", "স"] },
      { char: "র", romanization: "ra", meaning: "R sound", distractors: ["ল", "ম", "ন", "ব"] },
    ],
    [
      { english: "Hello", native: "হ্যালো", romanization: "Hyaalo" },
      { english: "Greetings (Namaskar)", native: "নমস্কার", romanization: "Namaskar" },
      { english: "Thank you", native: "ধন্যবাদ", romanization: "Dhanyavaad" },
      { english: "Yes", native: "হ্যাঁ", romanization: "Hyan" },
      { english: "No", native: "না", romanization: "Naa" },
      { english: "Good morning", native: "সুপ্রভাত", romanization: "Suprobhat" },
    ],
    [
      { english: "One", native: "এক", romanization: "ek" },
      { english: "Two", native: "দুই", romanization: "dui" },
      { english: "Three", native: "তিন", romanization: "tin" },
      { english: "Four", native: "চার", romanization: "chaar" },
      { english: "Five", native: "পাঁচ", romanization: "paanch" },
    ],
    [
      { english: "Water", native: "জল", romanization: "jol" },
      { english: "Rice", native: "ভাত", romanization: "bhat" },
      { english: "Fish", native: "মাছ", romanization: "maach" },
      { english: "Milk", native: "দুধ", romanization: "dudh" },
      { english: "Food", native: "খাবার", romanization: "khabaar" },
    ],
  ),

  buildSimpleLang(
    "gujarati",
    [
      { char: "અ", romanization: "a", meaning: "short A", distractors: ["આ", "ઇ", "ઉ", "એ"] },
      { char: "આ", romanization: "aa", meaning: "long A", distractors: ["અ", "ઇ", "ઉ", "એ"] },
      { char: "ઇ", romanization: "i", meaning: "short I", distractors: ["ઈ", "ઉ", "એ", "અ"] },
      { char: "ક", romanization: "ka", meaning: "K sound", distractors: ["ખ", "ગ", "ઘ", "ચ"] },
      { char: "ગ", romanization: "ga", meaning: "G sound", distractors: ["ક", "ખ", "ઘ", "જ"] },
      { char: "ત", romanization: "ta", meaning: "T sound", distractors: ["થ", "દ", "ધ", "ન"] },
      { char: "મ", romanization: "ma", meaning: "M sound", distractors: ["પ", "બ", "ન", "સ"] },
      { char: "સ", romanization: "sa", meaning: "S sound", distractors: ["પ", "મ", "ન", "ત"] },
    ],
    [
      { english: "Hello", native: "નમસ્તે", romanization: "Namaste" },
      { english: "Thank you", native: "આભાર", romanization: "Aabhaar" },
      { english: "Yes", native: "હા", romanization: "Haa" },
      { english: "No", native: "ના", romanization: "Naa" },
      { english: "How are you?", native: "કેમ છો?", romanization: "Kem chho?" },
      { english: "Good", native: "સારું", romanization: "Saarun" },
    ],
    [
      { english: "One", native: "એક", romanization: "ek" },
      { english: "Two", native: "બે", romanization: "be" },
      { english: "Three", native: "ત્રણ", romanization: "tran" },
      { english: "Four", native: "ચાર", romanization: "chaar" },
      { english: "Five", native: "પાંચ", romanization: "paanch" },
    ],
    [
      { english: "Water", native: "પાણી", romanization: "paani" },
      { english: "Food", native: "ખોરાક", romanization: "khoraak" },
      { english: "Bread", native: "રોટલી", romanization: "rotli" },
      { english: "Milk", native: "દૂધ", romanization: "doodh" },
      { english: "Tea", native: "ચા", romanization: "chaa" },
    ],
  ),

  buildSimpleLang(
    "tamil",
    [
      { char: "அ", romanization: "a", meaning: "short A", distractors: ["ஆ", "இ", "உ", "எ"] },
      { char: "ஆ", romanization: "aa", meaning: "long A", distractors: ["அ", "இ", "உ", "எ"] },
      { char: "இ", romanization: "i", meaning: "short I", distractors: ["ஈ", "உ", "எ", "அ"] },
      { char: "க", romanization: "ka", meaning: "K/G sound", distractors: ["ச", "த", "ப", "ம"] },
      { char: "ச", romanization: "sa/cha", meaning: "S/CH sound", distractors: ["க", "த", "ப", "ம"] },
      { char: "த", romanization: "ta/da", meaning: "T/D sound", distractors: ["க", "ச", "ப", "ம"] },
      { char: "ம", romanization: "ma", meaning: "M sound", distractors: ["க", "ச", "த", "ன"] },
      { char: "ன", romanization: "na", meaning: "N sound (final)", distractors: ["ம", "ர", "ல", "வ"] },
    ],
    [
      { english: "Hello / Vanakkam", native: "வணக்கம்", romanization: "Vanakkam" },
      { english: "Thank you", native: "நன்றி", romanization: "Nandri" },
      { english: "Yes", native: "ஆம்", romanization: "Aam" },
      { english: "No", native: "இல்லை", romanization: "Illai" },
      { english: "How are you?", native: "நீங்கள் எப்படி இருக்கிறீர்கள்?", romanization: "Neengal eppadi irukkireergal?" },
      { english: "Good", native: "நல்லது", romanization: "Nalladu" },
    ],
    [
      { english: "One", native: "ஒன்று", romanization: "ondru" },
      { english: "Two", native: "இரண்டு", romanization: "irandu" },
      { english: "Three", native: "மூன்று", romanization: "moondru" },
      { english: "Four", native: "நான்கு", romanization: "naangu" },
      { english: "Five", native: "ஐந்து", romanization: "aindu" },
    ],
    [
      { english: "Water", native: "தண்ணீர்", romanization: "thanneer" },
      { english: "Rice", native: "சோறு", romanization: "soru" },
      { english: "Milk", native: "பால்", romanization: "paal" },
      { english: "Banana", native: "வாழைப்பழம்", romanization: "vaazhaippazham" },
      { english: "Food", native: "உணவு", romanization: "unavu" },
    ],
  ),

  buildSimpleLang(
    "telugu",
    [
      { char: "అ", romanization: "a", meaning: "short A", distractors: ["ఆ", "ఇ", "ఉ", "ఎ"] },
      { char: "ఆ", romanization: "aa", meaning: "long A", distractors: ["అ", "ఇ", "ఉ", "ఎ"] },
      { char: "ఇ", romanization: "i", meaning: "short I", distractors: ["ఈ", "ఉ", "ఎ", "అ"] },
      { char: "క", romanization: "ka", meaning: "K sound", distractors: ["ఖ", "గ", "ఘ", "చ"] },
      { char: "గ", romanization: "ga", meaning: "G sound", distractors: ["క", "ఖ", "ఘ", "జ"] },
      { char: "త", romanization: "ta", meaning: "T sound", distractors: ["థ", "ద", "ధ", "న"] },
      { char: "మ", romanization: "ma", meaning: "M sound", distractors: ["ప", "బ", "న", "స"] },
      { char: "స", romanization: "sa", meaning: "S sound", distractors: ["ప", "మ", "న", "త"] },
    ],
    [
      { english: "Hello / Namaskaram", native: "నమస్కారం", romanization: "Namaskaram" },
      { english: "Thank you", native: "ధన్యవాదాలు", romanization: "Dhanyavaadaalu" },
      { english: "Yes", native: "అవును", romanization: "Avunu" },
      { english: "No", native: "కాదు", romanization: "Kaadu" },
      { english: "How are you?", native: "మీరు ఎలా ఉన్నారు?", romanization: "Meeru elaa unnaaru?" },
      { english: "Good", native: "మంచిది", romanization: "Manchidi" },
    ],
    [
      { english: "One", native: "ఒకటి", romanization: "okati" },
      { english: "Two", native: "రెండు", romanization: "rendu" },
      { english: "Three", native: "మూడు", romanization: "moodu" },
      { english: "Four", native: "నాలుగు", romanization: "naalugu" },
      { english: "Five", native: "అయిదు", romanization: "ayidu" },
    ],
    [
      { english: "Water", native: "నీరు", romanization: "neeru" },
      { english: "Rice", native: "అన్నం", romanization: "annam" },
      { english: "Milk", native: "పాలు", romanization: "paalu" },
      { english: "Food", native: "ఆహారం", romanization: "aahaaram" },
      { english: "Mango", native: "మామిడి", romanization: "maamidi" },
    ],
  ),

  buildSimpleLang(
    "punjabi",
    [
      { char: "ਅ", romanization: "a", meaning: "short A", distractors: ["ਆ", "ਇ", "ਉ", "ਏ"] },
      { char: "ਆ", romanization: "aa", meaning: "long A", distractors: ["ਅ", "ਇ", "ਉ", "ਏ"] },
      { char: "ਇ", romanization: "i", meaning: "short I", distractors: ["ਈ", "ਉ", "ਏ", "ਅ"] },
      { char: "ਕ", romanization: "ka", meaning: "K sound", distractors: ["ਖ", "ਗ", "ਘ", "ਚ"] },
      { char: "ਗ", romanization: "ga", meaning: "G sound", distractors: ["ਕ", "ਖ", "ਘ", "ਜ"] },
      { char: "ਤ", romanization: "ta", meaning: "T sound", distractors: ["ਥ", "ਦ", "ਧ", "ਨ"] },
      { char: "ਮ", romanization: "ma", meaning: "M sound", distractors: ["ਪ", "ਬ", "ਨ", "ਸ"] },
      { char: "ਸ", romanization: "sa", meaning: "S sound", distractors: ["ਪ", "ਮ", "ਨ", "ਤ"] },
    ],
    [
      { english: "Hello / Sat Sri Akal", native: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", romanization: "Sat Sri Akaal" },
      { english: "Thank you", native: "ਧੰਨਵਾਦ", romanization: "Dhanyavaad" },
      { english: "Yes", native: "ਹਾਂ", romanization: "Haan" },
      { english: "No", native: "ਨਹੀਂ", romanization: "Nahin" },
      { english: "How are you?", native: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?", romanization: "Tusi kiven ho?" },
      { english: "Good", native: "ਚੰਗਾ", romanization: "Changa" },
    ],
    [
      { english: "One", native: "ਇੱਕ", romanization: "ikk" },
      { english: "Two", native: "ਦੋ", romanization: "do" },
      { english: "Three", native: "ਤਿੰਨ", romanization: "tinn" },
      { english: "Four", native: "ਚਾਰ", romanization: "chaar" },
      { english: "Five", native: "ਪੰਜ", romanization: "panj" },
    ],
    [
      { english: "Water", native: "ਪਾਣੀ", romanization: "paani" },
      { english: "Food", native: "ਖਾਣਾ", romanization: "khaana" },
      { english: "Bread", native: "ਰੋਟੀ", romanization: "roti" },
      { english: "Milk", native: "ਦੁੱਧ", romanization: "duddh" },
      { english: "Lassi", native: "ਲੱਸੀ", romanization: "lassi" },
    ],
  ),

  buildSimpleLang(
    "malayalam",
    [
      { char: "അ", romanization: "a", meaning: "short A", distractors: ["ആ", "ഇ", "ഉ", "എ"] },
      { char: "ആ", romanization: "aa", meaning: "long A", distractors: ["അ", "ഇ", "ഉ", "എ"] },
      { char: "ഇ", romanization: "i", meaning: "short I", distractors: ["ഈ", "ഉ", "എ", "അ"] },
      { char: "ക", romanization: "ka", meaning: "K sound", distractors: ["ഖ", "ഗ", "ഘ", "ച"] },
      { char: "ഗ", romanization: "ga", meaning: "G sound", distractors: ["ക", "ഖ", "ഘ", "ജ"] },
      { char: "ത", romanization: "ta", meaning: "T sound", distractors: ["ഥ", "ദ", "ധ", "ന"] },
      { char: "മ", romanization: "ma", meaning: "M sound", distractors: ["പ", "ബ", "ന", "സ"] },
      { char: "ര", romanization: "ra", meaning: "R sound", distractors: ["ല", "മ", "ന", "വ"] },
    ],
    [
      { english: "Hello / Namaskaram", native: "നമസ്കാരം", romanization: "Namaskaram" },
      { english: "Thank you", native: "നന്ദി", romanization: "Nandi" },
      { english: "Yes", native: "അതേ", romanization: "Athe" },
      { english: "No", native: "ഇല്ല", romanization: "Illa" },
      { english: "How are you?", native: "സുഖമാണോ?", romanization: "Sukhamaano?" },
      { english: "Good", native: "നല്ലത്", romanization: "Nallath" },
    ],
    [
      { english: "One", native: "ഒന്ന്", romanization: "onnu" },
      { english: "Two", native: "രണ്ട്", romanization: "randu" },
      { english: "Three", native: "മൂന്ന്", romanization: "moonnu" },
      { english: "Four", native: "നാല്", romanization: "naalu" },
      { english: "Five", native: "അഞ്ച്", romanization: "anchu" },
    ],
    [
      { english: "Water", native: "വെള്ളം", romanization: "vellam" },
      { english: "Rice", native: "ചോറ്", romanization: "choru" },
      { english: "Fish", native: "മീൻ", romanization: "meen" },
      { english: "Coconut", native: "തേങ്ങ", romanization: "thenga" },
      { english: "Food", native: "ഭക്ഷണം", romanization: "bhakshanam" },
    ],
  ),

  buildSimpleLang(
    "kannada",
    [
      { char: "ಅ", romanization: "a", meaning: "short A", distractors: ["ಆ", "ಇ", "ಉ", "ಎ"] },
      { char: "ಆ", romanization: "aa", meaning: "long A", distractors: ["ಅ", "ಇ", "ಉ", "ಎ"] },
      { char: "ಇ", romanization: "i", meaning: "short I", distractors: ["ಈ", "ಉ", "ಎ", "ಅ"] },
      { char: "ಕ", romanization: "ka", meaning: "K sound", distractors: ["ಖ", "ಗ", "ಘ", "ಚ"] },
      { char: "ಗ", romanization: "ga", meaning: "G sound", distractors: ["ಕ", "ಖ", "ಘ", "ಜ"] },
      { char: "ತ", romanization: "ta", meaning: "T sound", distractors: ["ಥ", "ದ", "ಧ", "ನ"] },
      { char: "ಮ", romanization: "ma", meaning: "M sound", distractors: ["ಪ", "ಬ", "ನ", "ಸ"] },
      { char: "ಸ", romanization: "sa", meaning: "S sound", distractors: ["ಪ", "ಮ", "ನ", "ತ"] },
    ],
    [
      { english: "Hello / Namaskara", native: "ನಮಸ್ಕಾರ", romanization: "Namaskara" },
      { english: "Thank you", native: "ಧನ್ಯವಾದ", romanization: "Dhanyavaada" },
      { english: "Yes", native: "ಹೌದು", romanization: "Houdu" },
      { english: "No", native: "ಇಲ್ಲ", romanization: "Illa" },
      { english: "How are you?", native: "ನೀವು ಹೇಗಿದ್ದೀರಿ?", romanization: "Neevu heegiddiri?" },
      { english: "Good", native: "ಒಳ್ಳೆಯದು", romanization: "Olleyadu" },
    ],
    [
      { english: "One", native: "ಒಂದು", romanization: "ondu" },
      { english: "Two", native: "ಎರಡು", romanization: "eradu" },
      { english: "Three", native: "ಮೂರು", romanization: "mooru" },
      { english: "Four", native: "ನಾಲ್ಕು", romanization: "naalku" },
      { english: "Five", native: "ಐದು", romanization: "aidu" },
    ],
    [
      { english: "Water", native: "ನೀರು", romanization: "neeru" },
      { english: "Rice", native: "ಅನ್ನ", romanization: "anna" },
      { english: "Milk", native: "ಹಾಲು", romanization: "haalu" },
      { english: "Mango", native: "ಮಾವು", romanization: "maavu" },
      { english: "Food", native: "ಆಹಾರ", romanization: "aahaara" },
    ],
  ),

  buildSimpleLang(
    "odia",
    [
      { char: "ଅ", romanization: "a", meaning: "short A", distractors: ["ଆ", "ଇ", "ଉ", "ଏ"] },
      { char: "ଆ", romanization: "aa", meaning: "long A", distractors: ["ଅ", "ଇ", "ଉ", "ଏ"] },
      { char: "ଇ", romanization: "i", meaning: "short I", distractors: ["ଈ", "ଉ", "ଏ", "ଅ"] },
      { char: "କ", romanization: "ka", meaning: "K sound", distractors: ["ଖ", "ଗ", "ଘ", "ଚ"] },
      { char: "ଗ", romanization: "ga", meaning: "G sound", distractors: ["କ", "ଖ", "ଘ", "ଜ"] },
      { char: "ତ", romanization: "ta", meaning: "T sound", distractors: ["ଥ", "ଦ", "ଧ", "ନ"] },
      { char: "ମ", romanization: "ma", meaning: "M sound", distractors: ["ପ", "ବ", "ନ", "ସ"] },
      { char: "ସ", romanization: "sa", meaning: "S sound", distractors: ["ପ", "ମ", "ନ", "ତ"] },
    ],
    [
      { english: "Hello / Namaskara", native: "ନମସ୍କାର", romanization: "Namaskara" },
      { english: "Thank you", native: "ଧନ୍ୟବାଦ", romanization: "Dhanyavaada" },
      { english: "Yes", native: "ହଁ", romanization: "Han" },
      { english: "No", native: "ନାହିଁ", romanization: "Naahin" },
      { english: "How are you?", native: "ଆପଣ କେମିତି ଅଛନ୍ତି?", romanization: "Aapana kemiti achanti?" },
      { english: "Good", native: "ଭଲ", romanization: "Bhala" },
    ],
    [
      { english: "One", native: "ଏକ", romanization: "eka" },
      { english: "Two", native: "ଦୁଇ", romanization: "dui" },
      { english: "Three", native: "ତିନି", romanization: "tini" },
      { english: "Four", native: "ଚାରି", romanization: "chaari" },
      { english: "Five", native: "ପାଞ୍ଚ", romanization: "paancha" },
    ],
    [
      { english: "Water", native: "ଜଳ", romanization: "jala" },
      { english: "Rice", native: "ଭାତ", romanization: "bhaata" },
      { english: "Milk", native: "କ୍ଷୀର", romanization: "khira" },
      { english: "Fish", native: "ମାଛ", romanization: "maachha" },
      { english: "Food", native: "ଖାଦ୍ୟ", romanization: "khaadya" },
    ],
  ),

  buildSimpleLang(
    "assamese",
    [
      { char: "অ", romanization: "o", meaning: "O/A sound", distractors: ["আ", "ই", "উ", "এ"] },
      { char: "আ", romanization: "aa", meaning: "long A", distractors: ["অ", "ই", "উ", "এ"] },
      { char: "ই", romanization: "i", meaning: "short I", distractors: ["ঈ", "উ", "এ", "অ"] },
      { char: "ক", romanization: "ka", meaning: "K sound", distractors: ["খ", "গ", "ঘ", "চ"] },
      { char: "গ", romanization: "ga", meaning: "G sound", distractors: ["ক", "খ", "ঘ", "জ"] },
      { char: "ত", romanization: "ta", meaning: "T sound", distractors: ["থ", "দ", "ধ", "ন"] },
      { char: "ম", romanization: "ma", meaning: "M sound", distractors: ["প", "ব", "ন", "স"] },
      { char: "ৰ", romanization: "ra", meaning: "R sound", distractors: ["ল", "ম", "ন", "ব"] },
    ],
    [
      { english: "Hello / Namaskar", native: "নমস্কাৰ", romanization: "Namaskar" },
      { english: "Thank you", native: "ধন্যবাদ", romanization: "Dhanyabaad" },
      { english: "Yes", native: "হয়", romanization: "Hoy" },
      { english: "No", native: "নহয়", romanization: "Nahoy" },
      { english: "How are you?", native: "আপুনি কেনে আছে?", romanization: "Aapuni kene aahe?" },
      { english: "Good", native: "ভাল", romanization: "Bhaal" },
    ],
    [
      { english: "One", native: "এক", romanization: "ek" },
      { english: "Two", native: "দুই", romanization: "dui" },
      { english: "Three", native: "তিনি", romanization: "tini" },
      { english: "Four", native: "চাৰি", romanization: "chaari" },
      { english: "Five", native: "পাঁচ", romanization: "paanch" },
    ],
    [
      { english: "Water", native: "পানী", romanization: "paani" },
      { english: "Rice", native: "ভাত", romanization: "bhat" },
      { english: "Fish", native: "মাছ", romanization: "maach" },
      { english: "Milk", native: "গাখীৰ", romanization: "gaakhir" },
      { english: "Food", native: "খাদ্য", romanization: "khadya" },
    ],
  ),

  buildSimpleLang(
    "urdu",
    [
      { char: "ا", romanization: "alif", meaning: "A sound", distractors: ["ب", "پ", "ت", "ج"] },
      { char: "ب", romanization: "be", meaning: "B sound", distractors: ["ا", "پ", "ت", "ج"] },
      { char: "پ", romanization: "pe", meaning: "P sound", distractors: ["ا", "ب", "ت", "ج"] },
      { char: "ت", romanization: "te", meaning: "T sound", distractors: ["ا", "ب", "پ", "ج"] },
      { char: "ج", romanization: "jeem", meaning: "J sound", distractors: ["ا", "ب", "پ", "ت"] },
      { char: "د", romanization: "daal", meaning: "D sound", distractors: ["ر", "ز", "س", "ش"] },
      { char: "م", romanization: "meem", meaning: "M sound", distractors: ["ن", "و", "ہ", "ی"] },
      { char: "ن", romanization: "noon", meaning: "N sound", distractors: ["م", "و", "ہ", "ی"] },
    ],
    [
      { english: "Hello / Salaam", native: "سلام", romanization: "Salaam" },
      { english: "Thank you", native: "شکریہ", romanization: "Shukriya" },
      { english: "Yes", native: "ہاں", romanization: "Haan" },
      { english: "No", native: "نہیں", romanization: "Nahin" },
      { english: "How are you?", native: "آپ کیسے ہیں؟", romanization: "Aap kaise hain?" },
      { english: "Good", native: "اچھا", romanization: "Acha" },
    ],
    [
      { english: "One", native: "ایک", romanization: "ek" },
      { english: "Two", native: "دو", romanization: "do" },
      { english: "Three", native: "تین", romanization: "teen" },
      { english: "Four", native: "چار", romanization: "chaar" },
      { english: "Five", native: "پانچ", romanization: "paanch" },
    ],
    [
      { english: "Water", native: "پانی", romanization: "paani" },
      { english: "Food", native: "کھانا", romanization: "khaana" },
      { english: "Bread", native: "روٹی", romanization: "roti" },
      { english: "Milk", native: "دودھ", romanization: "doodh" },
      { english: "Tea", native: "چائے", romanization: "chaaye" },
    ],
  ),

  buildSimpleLang(
    "kashmiri",
    [
      { char: "अ", romanization: "a", meaning: "short A", distractors: ["आ", "इ", "उ", "ए"] },
      { char: "आ", romanization: "aa", meaning: "long A", distractors: ["अ", "इ", "उ", "ए"] },
      { char: "इ", romanization: "i", meaning: "short I", distractors: ["ई", "उ", "ए", "अ"] },
      { char: "क", romanization: "ka", meaning: "K sound", distractors: ["ख", "ग", "घ", "च"] },
      { char: "ग", romanization: "ga", meaning: "G sound", distractors: ["क", "ख", "घ", "ज"] },
      { char: "त", romanization: "ta", meaning: "T sound", distractors: ["थ", "द", "ध", "न"] },
      { char: "म", romanization: "ma", meaning: "M sound", distractors: ["प", "ब", "न", "स"] },
      { char: "स", romanization: "sa", meaning: "S sound", distractors: ["प", "म", "न", "त"] },
    ],
    [
      { english: "Hello / Adab", native: "آداب", romanization: "Adab" },
      { english: "Thank you", native: "शुक्रिया", romanization: "Shukriya" },
      { english: "Yes", native: "हा", romanization: "Haa" },
      { english: "No", native: "ना", romanization: "Naa" },
      { english: "How are you?", native: "च्या छुख?", romanization: "Kya chus?" },
      { english: "Good", native: "सपाद", romanization: "Saphaad" },
    ],
    [
      { english: "One", native: "अकु", romanization: "akhu" },
      { english: "Two", native: "ज़ि", romanization: "zi" },
      { english: "Three", native: "त्रे", romanization: "tre" },
      { english: "Four", native: "त्सोर", romanization: "tsor" },
      { english: "Five", native: "पाँच", romanization: "paanch" },
    ],
    [
      { english: "Water", native: "पानि", romanization: "paani" },
      { english: "Rice", native: "भात", romanization: "bhat" },
      { english: "Bread", native: "चोत", romanization: "chot" },
      { english: "Milk", native: "दूद", romanization: "dood" },
      { english: "Food", native: "वाखुर", romanization: "vakhur" },
    ],
  ),

  buildSimpleLang(
    "nepali",
    [
      { char: "अ", romanization: "a", meaning: "short A", distractors: ["आ", "इ", "उ", "ए"] },
      { char: "आ", romanization: "aa", meaning: "long A", distractors: ["अ", "इ", "उ", "ए"] },
      { char: "इ", romanization: "i", meaning: "short I", distractors: ["ई", "उ", "ए", "अ"] },
      { char: "क", romanization: "ka", meaning: "K sound", distractors: ["ख", "ग", "घ", "च"] },
      { char: "ग", romanization: "ga", meaning: "G sound", distractors: ["क", "ख", "घ", "ज"] },
      { char: "त", romanization: "ta", meaning: "T sound", distractors: ["थ", "द", "ध", "न"] },
      { char: "म", romanization: "ma", meaning: "M sound", distractors: ["प", "ब", "न", "स"] },
      { char: "स", romanization: "sa", meaning: "S sound", distractors: ["प", "म", "न", "त"] },
    ],
    [
      { english: "Hello / Namaste", native: "नमस्ते", romanization: "Namaste" },
      { english: "Thank you", native: "धन्यवाद", romanization: "Dhanyavaad" },
      { english: "Yes", native: "हो", romanization: "Ho" },
      { english: "No", native: "होइन", romanization: "Hoina" },
      { english: "How are you?", native: "तपाईं कस्तो हुनुहुन्छ?", romanization: "Tapai kasto hunuhunchha?" },
      { english: "Good", native: "राम्रो", romanization: "Ramro" },
    ],
    [
      { english: "One", native: "एक", romanization: "ek" },
      { english: "Two", native: "दुई", romanization: "dui" },
      { english: "Three", native: "तीन", romanization: "teen" },
      { english: "Four", native: "चार", romanization: "chaar" },
      { english: "Five", native: "पाँच", romanization: "paanch" },
    ],
    [
      { english: "Water", native: "पानी", romanization: "paani" },
      { english: "Rice", native: "भात", romanization: "bhaat" },
      { english: "Bread", native: "रोटी", romanization: "roti" },
      { english: "Milk", native: "दूध", romanization: "doodh" },
      { english: "Tea", native: "चिया", romanization: "chiya" },
    ],
  ),

  buildSimpleLang(
    "sindhi",
    [
      { char: "ا", romanization: "alif", meaning: "A sound", distractors: ["ب", "پ", "ت", "ج"] },
      { char: "ب", romanization: "be", meaning: "B sound", distractors: ["ا", "پ", "ت", "ج"] },
      { char: "پ", romanization: "pe", meaning: "P sound", distractors: ["ا", "ب", "ت", "ج"] },
      { char: "ت", romanization: "te", meaning: "T sound", distractors: ["ا", "ب", "پ", "ج"] },
      { char: "ج", romanization: "jeem", meaning: "J sound", distractors: ["ا", "ب", "پ", "ت"] },
      { char: "د", romanization: "daal", meaning: "D sound", distractors: ["ر", "ز", "س", "ش"] },
      { char: "م", romanization: "meem", meaning: "M sound", distractors: ["ن", "و", "ه", "ي"] },
      { char: "ن", romanization: "noon", meaning: "N sound", distractors: ["م", "و", "ه", "ي"] },
    ],
    [
      { english: "Hello / Salaam", native: "سلام", romanization: "Salaam" },
      { english: "Thank you", native: "شڪريا", romanization: "Shukriya" },
      { english: "Yes", native: "ها", romanization: "Haa" },
      { english: "No", native: "نه", romanization: "Na" },
      { english: "How are you?", native: "تون ڪيئن آهين؟", romanization: "Toon kayn aahen?" },
      { english: "Good", native: "سٺو", romanization: "Satho" },
    ],
    [
      { english: "One", native: "ھڪ", romanization: "hiku" },
      { english: "Two", native: "ٻه", romanization: "ba" },
      { english: "Three", native: "ٽي", romanization: "ti" },
      { english: "Four", native: "چار", romanization: "chaar" },
      { english: "Five", native: "پنج", romanization: "panj" },
    ],
    [
      { english: "Water", native: "پاڻي", romanization: "paani" },
      { english: "Food", native: "کاڌو", romanization: "khaadho" },
      { english: "Bread", native: "ماني", romanization: "maani" },
      { english: "Milk", native: "کير", romanization: "kheer" },
      { english: "Tea", native: "چانهه", romanization: "chaanha" },
    ],
  ),
];

// ─── main seed ───────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding IndiLingo database with 15 languages...");

  // Insert languages
  for (const seed of ALL_SEEDS) {
    const { lang } = seed;
    await db
      .insert(languagesTable)
      .values({
        id: lang.id,
        name: lang.name,
        nativeName: lang.nativeName,
        flagEmoji: lang.flagEmoji,
        colorTheme: lang.colorTheme,
        description: lang.description,
        scriptName: lang.scriptName,
        totalLearners: lang.totalLearners,
      })
      .onConflictDoUpdate({
        target: languagesTable.id,
        set: {
          name: lang.name,
          nativeName: lang.nativeName,
          scriptName: lang.scriptName,
          colorTheme: lang.colorTheme,
          description: lang.description,
          totalLearners: lang.totalLearners,
        },
      });
    console.log(`  Language: ${lang.name}`);
  }

  // Insert units, lessons, exercises
  for (const seed of ALL_SEEDS) {
    for (const { unit, lessons } of seed.units) {
      await db
        .insert(unitsTable)
        .values(unit)
        .onConflictDoUpdate({
          target: unitsTable.id,
          set: { title: unit.title, description: unit.description, unitType: unit.unitType },
        });

      for (const { lesson, exercises } of lessons) {
        await db
          .insert(lessonsTable)
          .values(lesson)
          .onConflictDoUpdate({
            target: lessonsTable.id,
            set: { title: lesson.title, xpReward: lesson.xpReward },
          });

        for (const ex of exercises) {
          await db
            .insert(exercisesTable)
            .values(ex)
            .onConflictDoUpdate({
              target: exercisesTable.id,
              set: {
                prompt: ex.prompt,
                options: ex.options,
                correctAnswer: ex.correctAnswer,
                romanization: ex.romanization ?? null,
                nativeScript: ex.nativeScript ?? null,
              },
            });
        }
      }
    }
    console.log(`  Seeded units/lessons for ${seed.lang.name}`);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
