// ============================================================
// IndiLingo — Full 15-Language Curriculum
// 4 Units per language: Script & Alphabet | Greetings | Numbers | Food & Daily Life
// 5 exercise types: MULTIPLE_CHOICE | WORD_ORDER | FILL_BLANK | MATCH_PAIRS
// Hindi Script unit has 6 lessons (per Indore10 spec); all others have 2
// ============================================================

export interface Exercise {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'WORD_ORDER' | 'FILL_BLANK' | 'MATCH_PAIRS';
  // MULTIPLE_CHOICE
  prompt?: string;
  promptScript?: string;
  promptTranslit?: string;
  hint?: string;
  options?: string[];
  correctIndex?: number;
  // WORD_ORDER
  instruction?: string;
  words?: string[];
  correctSentence?: string;
  // FILL_BLANK
  promptSentence?: string;
  blankAnswer?: string;
  // MATCH_PAIRS
  pairs?: { left: string; right: string }[];
}

export interface Lesson {
  id: string;
  title: string;
  titleNative: string;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  title: string;
  titleNative: string;
  description: string;
  color: string;
  lessons: Lesson[];
}

export interface Language {
  id: string;
  name: string;
  nativeName: string;
  flagEmoji: string;
  scriptName: string;
  colorHex: string;
  available: boolean;
  curriculum: Unit[];
}

// ──────────────────────────────────────────────────────────
// BADGE DEFINITIONS
// ──────────────────────────────────────────────────────────
export const BADGES = [
  { id: 'first_lesson', icon: '🌱', title: 'First Step', lessonsRequired: 1 },
  { id: 'five_lessons', icon: '⭐', title: 'Rising Star', lessonsRequired: 5 },
  { id: 'ten_lessons', icon: '🏆', title: 'Champion', lessonsRequired: 10 },
  { id: 'twenty_lessons', icon: '💎', title: 'Diamond', lessonsRequired: 20 },
  { id: 'xp_100', icon: '⚡', title: 'Energized', xpRequired: 100 },
  { id: 'xp_500', icon: '🔥', title: 'On Fire', xpRequired: 500 },
  { id: 'xp_1000', icon: '🌟', title: 'Superstar', xpRequired: 1000 },
  { id: 'streak_3', icon: '📅', title: '3-Day Run', streakRequired: 3 },
  { id: 'streak_7', icon: '🗓️', title: 'Week Strong', streakRequired: 7 },
  { id: 'streak_30', icon: '🏅', title: 'Month Long', streakRequired: 30 },
  { id: 'multilingual', icon: '🌍', title: 'Multilingual', lessonsRequired: 1 },
  { id: 'perfectionist', icon: '🎯', title: 'Perfectionist', lessonsRequired: 3 },
];

// ──────────────────────────────────────────────────────────
// LEADERBOARD MOCK DATA
// ──────────────────────────────────────────────────────────
export const LEADERBOARD_MOCK = [
  { id: 'u1', name: 'Priya S.', xp: 980, flag: '🇮🇳', streak: 14 },
  { id: 'u2', name: 'Arjun M.', xp: 870, flag: '🇮🇳', streak: 9 },
  { id: 'u3', name: 'Kavya R.', xp: 760, flag: '🇮🇳', streak: 22 },
  { id: 'u4', name: 'Rohan P.', xp: 650, flag: '🇮🇳', streak: 6 },
  { id: 'u5', name: 'Sneha T.', xp: 540, flag: '🇮🇳', streak: 11 },
  { id: 'u6', name: 'Vikram K.', xp: 430, flag: '🇮🇳', streak: 4 },
  { id: 'u7', name: 'Meena L.', xp: 320, flag: '🇮🇳', streak: 7 },
  { id: 'u8', name: 'Aditya N.', xp: 210, flag: '🇮🇳', streak: 2 },
  { id: 'u9', name: 'Deepa V.', xp: 150, flag: '🇮🇳', streak: 3 },
  { id: 'u10', name: 'Kiran B.', xp: 80, flag: '🇮🇳', streak: 1 },
];

// ──────────────────────────────────────────────────────────
// EXERCISE BUILDER HELPERS
// ──────────────────────────────────────────────────────────
function mc(id: string, prompt: string, options: string[], correctIndex: number, extra?: Partial<Exercise>): Exercise {
  return { id, type: 'MULTIPLE_CHOICE', prompt, options, correctIndex, ...extra };
}
function wo(id: string, instruction: string, correctSentence: string): Exercise {
  return { id, type: 'WORD_ORDER', instruction, words: correctSentence.split(' '), correctSentence };
}
function fb(id: string, instruction: string, promptSentence: string, blankAnswer: string, hint?: string): Exercise {
  return { id, type: 'FILL_BLANK', instruction, promptSentence, blankAnswer, ...(hint ? { hint } : {}) };
}
function mp(id: string, instruction: string, pairs: { left: string; right: string }[]): Exercise {
  return { id, type: 'MATCH_PAIRS', instruction, pairs };
}

// ══════════════════════════════════════════════════════════
// 1. HINDI — हिंदी
//    Unit 1: Devanagari Script — 6 lessons (per spec)
//    Units 2-4: Greetings | Numbers | Food & Daily Life
// ══════════════════════════════════════════════════════════
const hindiCurriculum: Unit[] = [
  {
    id: 'hi-u1', title: 'Devanagari Script', titleNative: 'देवनागरी', description: 'Master the Hindi alphabet from scratch', color: '#C15B2B',
    lessons: [
      {
        id: 'hi-u1-l1', title: 'Vowels I', titleNative: 'स्वर — अ आ इ ई',
        exercises: [
          mc('hi-u1-l1-e1', 'Which letter is "A" (अ)?', ['आ', 'अ', 'इ', 'उ'], 1, { promptScript: 'अ', hint: 'The very first vowel — short A sound' }),
          mc('hi-u1-l1-e2', 'Which letter makes the "AA" sound?', ['अ', 'आ', 'इ', 'ए'], 1, { promptScript: 'आ', hint: 'Long A — like "aardvark"' }),
          mp('hi-u1-l1-e3', 'Match each vowel to its sound', [
            { left: 'अ', right: 'A (short)' },
            { left: 'आ', right: 'AA (long)' },
            { left: 'इ', right: 'I (short)' },
            { left: 'ई', right: 'EE (long)' },
          ]),
          fb('hi-u1-l1-e4', 'Type the transliteration', 'The Hindi letter "आ" sounds like ___', 'aa', 'Long vowel sound'),
        ],
      },
      {
        id: 'hi-u1-l2', title: 'Vowels II', titleNative: 'स्वर — उ ऊ ए ओ',
        exercises: [
          mc('hi-u1-l2-e1', 'Which letter is the "U" sound?', ['अ', 'इ', 'उ', 'ओ'], 2, { promptScript: 'उ' }),
          mc('hi-u1-l2-e2', 'What sound does "ई" make?', ['A', 'E (short)', 'EE (long)', 'O'], 2, { promptScript: 'ई' }),
          mp('hi-u1-l2-e3', 'Match vowels to their sounds', [
            { left: 'उ', right: 'U (short)' },
            { left: 'ऊ', right: 'OO (long)' },
            { left: 'ए', right: 'E' },
            { left: 'ओ', right: 'O' },
          ]),
          fb('hi-u1-l2-e4', 'Type the transliteration', 'The Hindi vowel "ओ" sounds like ___', 'o', 'Like "open"'),
        ],
      },
      {
        id: 'hi-u1-l3', title: 'Consonants — K Group', titleNative: 'व्यंजन — क ख ग घ',
        exercises: [
          mc('hi-u1-l3-e1', 'Which letter says "K"?', ['ग', 'क', 'च', 'ट'], 1, { promptScript: 'क' }),
          mc('hi-u1-l3-e2', '"ग" sounds like?', ['Ka', 'Ga', 'Pa', 'Ba'], 1, { promptScript: 'ग' }),
          mp('hi-u1-l3-e3', 'Match consonants to sounds', [
            { left: 'क', right: 'Ka' },
            { left: 'ख', right: 'Kha' },
            { left: 'ग', right: 'Ga' },
            { left: 'घ', right: 'Gha' },
          ]),
          fb('hi-u1-l3-e4', 'Complete the word', '___ means "what" (a common Hindi word starting with क+या)', 'kya', 'क्या is written "kya"'),
        ],
      },
      {
        id: 'hi-u1-l4', title: 'Consonants — Ch/J Group', titleNative: 'व्यंजन — च छ ज झ',
        exercises: [
          mc('hi-u1-l4-e1', '"च" sounds like?', ['Ka', 'Cha', 'Ta', 'Pa'], 1, { promptScript: 'च' }),
          mc('hi-u1-l4-e2', 'Which letter is "J"?', ['झ', 'ज', 'च', 'छ'], 1, { promptScript: 'ज' }),
          mp('hi-u1-l4-e3', 'Match consonants to sounds', [
            { left: 'च', right: 'Cha' },
            { left: 'छ', right: 'Chha' },
            { left: 'ज', right: 'Ja' },
            { left: 'झ', right: 'Jha' },
          ]),
          fb('hi-u1-l4-e4', 'Type the transliteration', '"चाय" (the word for tea) starts with the sound ___', 'cha', 'च = Cha'),
        ],
      },
      {
        id: 'hi-u1-l5', title: 'Consonants — T/D/N Group', titleNative: 'व्यंजन — त थ द न',
        exercises: [
          mc('hi-u1-l5-e1', '"त" sounds like?', ['Pa', 'Na', 'Ta', 'Ka'], 2, { promptScript: 'त' }),
          mc('hi-u1-l5-e2', '"न" sounds like?', ['Ma', 'Na', 'Pa', 'Ba'], 1, { promptScript: 'न' }),
          mp('hi-u1-l5-e3', 'Match consonants to sounds', [
            { left: 'त', right: 'Ta' },
            { left: 'थ', right: 'Tha' },
            { left: 'द', right: 'Da' },
            { left: 'न', right: 'Na' },
          ]),
          fb('hi-u1-l5-e4', 'Spell in transliteration', '"नमस्ते" starts with ___', 'na', 'The first consonant is न = Na'),
        ],
      },
      {
        id: 'hi-u1-l6', title: 'Consonants — P/M/S/R Group', titleNative: 'व्यंजन — प म स र',
        exercises: [
          mc('hi-u1-l6-e1', '"म" sounds like?', ['Na', 'Ma', 'Pa', 'Ba'], 1, { promptScript: 'म' }),
          mc('hi-u1-l6-e2', 'Hindi has how many "S" sounds?', ['One', 'Two', 'Three', 'None'], 2, { hint: 'श, ष, स — all are S-type sounds' }),
          mp('hi-u1-l6-e3', 'Match consonants to sounds', [
            { left: 'प', right: 'Pa' },
            { left: 'म', right: 'Ma' },
            { left: 'स', right: 'Sa' },
            { left: 'र', right: 'Ra' },
          ]),
          wo('hi-u1-l6-e4', 'Arrange the transliteration of "Namaste"', 'Na ma ste'),
        ],
      },
    ],
  },
  {
    id: 'hi-u2', title: 'Greetings & Phrases', titleNative: 'अभिवादन', description: 'Say hello, goodbye and more', color: '#E16735',
    lessons: [
      {
        id: 'hi-u2-l1', title: 'Hello & Goodbye', titleNative: 'नमस्ते',
        exercises: [
          mc('hi-u2-l1-e1', 'How do you say "Hello" in Hindi?', ['Namaste', 'Shukriya', 'Alvida', 'Haan'], 0, { promptScript: 'नमस्ते', promptTranslit: 'Namaste' }),
          mc('hi-u2-l1-e2', 'How do you say "Goodbye"?', ['Namaste', 'Alvida', 'Dhanyavad', 'Nahi'], 1, { promptScript: 'अलविदा' }),
          mc('hi-u2-l1-e3', 'What does "Shukriya" mean?', ['Hello', 'Sorry', 'Thank you', 'Goodbye'], 2, { promptScript: 'शुक्रिया', hint: 'You say this when someone does something nice.' }),
          wo('hi-u2-l1-e4', 'Arrange: "Namaste, my friend"', 'Namaste mera dost'),
        ],
      },
      {
        id: 'hi-u2-l2', title: 'How are you?', titleNative: 'आप कैसे हैं?',
        exercises: [
          mc('hi-u2-l2-e1', 'How do you ask "How are you?"', ['Kya haal hai?', 'Kya naam hai?', 'Kitne baje hain?', 'Kahan ho?'], 0, { promptScript: 'क्या हाल है?' }),
          mc('hi-u2-l2-e2', '"Main theek hoon" means?', ['I am fine', 'I am late', 'I am tired', 'I am happy'], 0, { promptScript: 'मैं ठीक हूँ' }),
          fb('hi-u2-l2-e3', 'Complete the sentence', 'To say thank you in Hindi, say ___ (transliteration)', 'dhanyavaad', 'धन्यवाद'),
          mp('hi-u2-l2-e4', 'Match Hindi phrases to meanings', [
            { left: 'नमस्ते', right: 'Hello' },
            { left: 'धन्यवाद', right: 'Thank you' },
            { left: 'अलविदा', right: 'Goodbye' },
            { left: 'माफ़ करें', right: 'Sorry/Excuse me' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'hi-u3', title: 'Numbers', titleNative: 'संख्याएँ', description: 'Count 1–10 in Hindi', color: '#A84CA0',
    lessons: [
      {
        id: 'hi-u3-l1', title: 'Numbers 1–5', titleNative: 'एक से पाँच',
        exercises: [
          mc('hi-u3-l1-e1', 'How do you say "1" in Hindi?', ['दो', 'एक', 'तीन', 'चार'], 1, { promptScript: 'एक', promptTranslit: 'ek' }),
          mc('hi-u3-l1-e2', '"तीन" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptScript: 'तीन' }),
          mp('hi-u3-l1-e3', 'Match numbers to their Hindi words', [
            { left: '1', right: 'एक' },
            { left: '2', right: 'दो' },
            { left: '3', right: 'तीन' },
            { left: '4', right: 'चार' },
          ]),
          fb('hi-u3-l1-e4', 'Type the transliteration (romanized)', 'The number 5 in Hindi is ___ (transliteration: paanch)', 'paanch', 'पाँच — Five fingers = पाँच'),
        ],
      },
      {
        id: 'hi-u3-l2', title: 'Numbers 6–10', titleNative: 'छह से दस',
        exercises: [
          mc('hi-u3-l2-e1', '"सात" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'सात' }),
          mc('hi-u3-l2-e2', 'How do you say "10" in Hindi?', ['आठ', 'नौ', 'दस', 'ग्यारह'], 2, { promptScript: 'दस', promptTranslit: 'das' }),
          mp('hi-u3-l2-e3', 'Match numbers to Hindi words', [
            { left: '6', right: 'छह' },
            { left: '7', right: 'सात' },
            { left: '8', right: 'आठ' },
            { left: '9', right: 'नौ' },
          ]),
          wo('hi-u3-l2-e4', 'Arrange: "I have ten fingers"', 'Mere paas das ungliyan hain'),
        ],
      },
    ],
  },
  {
    id: 'hi-u4', title: 'Food & Daily Life', titleNative: 'खाना और जीवन', description: 'Water, food, and daily words', color: '#2E86AB',
    lessons: [
      {
        id: 'hi-u4-l1', title: 'Food Essentials', titleNative: 'ज़रूरी खाना',
        exercises: [
          mc('hi-u4-l1-e1', '"पानी" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'पानी', promptTranslit: 'paani' }),
          mc('hi-u4-l1-e2', 'How do you say "tea" in Hindi?', ['दूध', 'चावल', 'चाय', 'रोटी'], 2, { promptScript: 'चाय', promptTranslit: 'chaay' }),
          mp('hi-u4-l1-e3', 'Match Hindi food words to English', [
            { left: 'पानी', right: 'Water' },
            { left: 'दूध', right: 'Milk' },
            { left: 'चाय', right: 'Tea' },
            { left: 'चावल', right: 'Rice' },
          ]),
          fb('hi-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread in Hindi is ___ (transliteration: roti)', 'roti', 'रोटी — Round flatbread'),
        ],
      },
      {
        id: 'hi-u4-l2', title: 'Daily Verbs', titleNative: 'रोज़ की क्रियाएँ',
        exercises: [
          mc('hi-u4-l2-e1', '"मैं पानी पीता हूँ" means?', ['I eat rice', 'I drink water', 'I want tea', 'I buy milk'], 1),
          mc('hi-u4-l2-e2', '"खाना" means?', ['Water', 'Food/Eating', 'Sleep', 'Work'], 1, { promptScript: 'खाना' }),
          wo('hi-u4-l2-e3', 'Arrange: "I drink tea every morning"', 'Main roz subah chaay peeta hoon'),
          mp('hi-u4-l2-e4', 'Match actions to Hindi verbs', [
            { left: 'खाना', right: 'To eat' },
            { left: 'पीना', right: 'To drink' },
            { left: 'सोना', right: 'To sleep' },
            { left: 'जाना', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 2. MARATHI — मराठी
// ══════════════════════════════════════════════════════════
const marathiCurriculum: Unit[] = [
  {
    id: 'mr-u1', title: 'Script Basics', titleNative: 'लिपी', description: 'Marathi Devanagari script', color: '#D4751E',
    lessons: [
      {
        id: 'mr-u1-l1', title: 'First Letters', titleNative: 'पहिली अक्षरे',
        exercises: [
          mc('mr-u1-l1-e1', 'Marathi is written in which script?', ['Gujarati', 'Devanagari', 'Kannada', 'Bengali'], 1),
          mc('mr-u1-l1-e2', '"मराठी" starts with which sound?', ['Na', 'Ma', 'Ra', 'Ta'], 1),
          mp('mr-u1-l1-e3', 'Match Marathi letters to sounds', [
            { left: 'म', right: 'Ma' },
            { left: 'र', right: 'Ra' },
            { left: 'ठ', right: 'Tha (retroflex)' },
            { left: 'न', right: 'Na' },
          ]),
          fb('mr-u1-l1-e4', 'Fill in', 'The Marathi word for "beautiful" is सुंदर — starts with sound ___', 'su', 'स = Sa/Su'),
        ],
      },
      {
        id: 'mr-u1-l2', title: 'Script Practice', titleNative: 'लिपी सराव',
        exercises: [
          mc('mr-u1-l2-e1', 'The letter "ठ" sounds like?', ['Da', 'Tha (retroflex)', 'Ka', 'Pa'], 1, { hint: 'Marathi has unique retroflex sounds' }),
          mc('mr-u1-l2-e2', 'Marathi and Hindi share which script?', ['Tamil', 'Gujarati', 'Devanagari', 'Kannada'], 2),
          mp('mr-u1-l2-e3', 'Match vowels to sounds (shared with Hindi)', [
            { left: 'अ', right: 'A' },
            { left: 'आ', right: 'AA' },
            { left: 'इ', right: 'I' },
            { left: 'उ', right: 'U' },
          ]),
          wo('mr-u1-l2-e4', 'Arrange: "Marathi is beautiful"', 'Marathi bhasha khup sundar aahe'),
        ],
      },
    ],
  },
  {
    id: 'mr-u2', title: 'Greetings & Phrases', titleNative: 'अभिवादन', description: 'Essential Marathi greetings', color: '#F5922F',
    lessons: [
      {
        id: 'mr-u2-l1', title: 'Hello & Thanks', titleNative: 'नमस्कार',
        exercises: [
          mc('mr-u2-l1-e1', 'How do you say "Hello" in Marathi?', ['Namaskar', 'Shukriya', 'Dhanyavaad', 'Alvida'], 0, { promptScript: 'नमस्कार', promptTranslit: 'Namaskar' }),
          mc('mr-u2-l1-e2', '"Dhanyavaad" means?', ['Hello', 'Sorry', 'Thank you', 'Please'], 2, { promptScript: 'धन्यवाद' }),
          mc('mr-u2-l1-e3', 'Goodbye in Marathi is?', ['Namaskar', 'Bheto', 'Punha bhetoo', 'Theek'], 2, { hint: 'Literally "let us meet again"' }),
          wo('mr-u2-l1-e4', 'Arrange: "Hello, how are you?"', 'Namaskar kasa aahat'),
        ],
      },
      {
        id: 'mr-u2-l2', title: 'Introductions', titleNative: 'ओळख',
        exercises: [
          mc('mr-u2-l2-e1', '"Majhe naav ___ aahe" means?', ['Where are you from?', 'My name is ___', 'I am fine', 'Nice to meet you'], 1),
          mc('mr-u2-l2-e2', '"Khup chhan" means?', ['Too bad', 'Very good', 'Come here', 'Go away'], 1, { hint: 'A common expression of appreciation' }),
          fb('mr-u2-l2-e3', 'Fill in the blank', 'To say "I am from Pune" in Marathi: Mee ___ aahe', 'Pune', 'City name stays the same'),
          mp('mr-u2-l2-e4', 'Match Marathi phrases to meanings', [
            { left: 'नमस्कार', right: 'Hello' },
            { left: 'धन्यवाद', right: 'Thank you' },
            { left: 'खूप छान', right: 'Very good' },
            { left: 'पुन्हा भेटू', right: 'See you again' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'mr-u3', title: 'Numbers', titleNative: 'संख्या', description: 'Count 1–10 in Marathi', color: '#7B2D8B',
    lessons: [
      {
        id: 'mr-u3-l1', title: 'Numbers 1–5', titleNative: 'एक ते पाच',
        exercises: [
          mc('mr-u3-l1-e1', 'How do you say "1" in Marathi?', ['दोन', 'एक', 'तीन', 'चार'], 1, { promptScript: 'एक', promptTranslit: 'ek' }),
          mc('mr-u3-l1-e2', '"पाच" means?', ['Three', 'Four', 'Five', 'Six'], 2, { promptScript: 'पाच' }),
          mp('mr-u3-l1-e3', 'Match numbers to Marathi', [
            { left: '1', right: 'एक' },
            { left: '2', right: 'दोन' },
            { left: '3', right: 'तीन' },
            { left: '4', right: 'चार' },
          ]),
          fb('mr-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Marathi is ___ (transliteration: paach)', 'paach', 'पाच — Five = पाच'),
        ],
      },
      {
        id: 'mr-u3-l2', title: 'Numbers 6–10', titleNative: 'सहा ते दहा',
        exercises: [
          mc('mr-u3-l2-e1', '"सात" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'सात' }),
          mc('mr-u3-l2-e2', 'How do you say "10" in Marathi?', ['आठ', 'नऊ', 'दहा', 'अकरा'], 2, { promptScript: 'दहा' }),
          mp('mr-u3-l2-e3', 'Match numbers to Marathi', [
            { left: '6', right: 'सहा' },
            { left: '7', right: 'सात' },
            { left: '8', right: 'आठ' },
            { left: '9', right: 'नऊ' },
          ]),
          wo('mr-u3-l2-e4', 'Arrange: "I have ten mangoes"', 'Mazhaakade daha amba aaheta'),
        ],
      },
    ],
  },
  {
    id: 'mr-u4', title: 'Food & Daily Life', titleNative: 'अन्न आणि जीवन', description: 'Food words and daily life in Marathi', color: '#1A7A9C',
    lessons: [
      {
        id: 'mr-u4-l1', title: 'Food Essentials', titleNative: 'जेवण',
        exercises: [
          mc('mr-u4-l1-e1', '"पाणी" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'पाणी', promptTranslit: 'paani' }),
          mc('mr-u4-l1-e2', 'How do you say "tea" in Marathi?', ['दूध', 'भात', 'चहा', 'भाकरी'], 2, { promptScript: 'चहा' }),
          mp('mr-u4-l1-e3', 'Match Marathi food words to English', [
            { left: 'पाणी', right: 'Water' },
            { left: 'दूध', right: 'Milk' },
            { left: 'चहा', right: 'Tea' },
            { left: 'भात', right: 'Rice' },
          ]),
          fb('mr-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread in Marathi is ___ (transliteration: bhaakari)', 'bhaakari', 'भाकरी — Traditional Marathi flatbread'),
        ],
      },
      {
        id: 'mr-u4-l2', title: 'Daily Phrases', titleNative: 'रोजचे जीवन',
        exercises: [
          mc('mr-u4-l2-e1', '"Mee bhaat khato" means?', ['I drink water', 'I eat rice', 'I want tea', 'I buy milk'], 1),
          mc('mr-u4-l2-e2', '"Bhook lagli" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('mr-u4-l2-e3', 'Arrange: "I want water please"', 'Mala paani dyaa please'),
          mp('mr-u4-l2-e4', 'Match actions to Marathi verbs', [
            { left: 'खाणे', right: 'To eat' },
            { left: 'पिणे', right: 'To drink' },
            { left: 'झोपणे', right: 'To sleep' },
            { left: 'जाणे', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 3. BENGALI — বাংলা
// ══════════════════════════════════════════════════════════
const bengaliCurriculum: Unit[] = [
  {
    id: 'bn-u1', title: 'Bengali Script', titleNative: 'বর্ণমালা', description: 'The Bengali alphabet', color: '#27AE60',
    lessons: [
      {
        id: 'bn-u1-l1', title: 'Script Intro', titleNative: 'পরিচয়',
        exercises: [
          mc('bn-u1-l1-e1', 'Bengali script is known as?', ['Devanagari', 'Bengali/Bangla script', 'Gurmukhi', 'Oriya'], 1),
          mc('bn-u1-l1-e2', '"অ" sounds like?', ['I', 'O', 'A', 'E'], 2, { promptScript: 'অ' }),
          mp('bn-u1-l1-e3', 'Match Bengali letters to sounds', [
            { left: 'অ', right: 'A' },
            { left: 'আ', right: 'AA' },
            { left: 'ই', right: 'I' },
            { left: 'ক', right: 'Ka' },
          ]),
          fb('bn-u1-l1-e4', 'Transliterate', 'The Bengali letter "ক" sounds like ___', 'ka', 'First consonant of the Bengali alphabet'),
        ],
      },
      {
        id: 'bn-u1-l2', title: 'More Letters', titleNative: 'আরও অক্ষর',
        exercises: [
          mc('bn-u1-l2-e1', '"ক" sounds like?', ['Ga', 'Ka', 'Cha', 'Ta'], 1, { promptScript: 'ক' }),
          mc('bn-u1-l2-e2', 'Bengali script reads in which direction?', ['Right to left', 'Left to right', 'Top to bottom', 'Bottom to top'], 1),
          mp('bn-u1-l2-e3', 'Match Bengali consonants to sounds', [
            { left: 'ক', right: 'Ka' },
            { left: 'গ', right: 'Ga' },
            { left: 'ত', right: 'Ta' },
            { left: 'ম', right: 'Ma' },
          ]),
          wo('bn-u1-l2-e4', 'Spell: "Bangla"', 'Ba ng la'),
        ],
      },
    ],
  },
  {
    id: 'bn-u2', title: 'Greetings & Phrases', titleNative: 'অভিবাদন', description: 'Say hello in Bengali', color: '#2ECC71',
    lessons: [
      {
        id: 'bn-u2-l1', title: 'Hello & Goodbye', titleNative: 'নমস্কার',
        exercises: [
          mc('bn-u2-l1-e1', 'How do you say "Hello" in Bengali?', ['Nomoshkar', 'Shukriya', 'Dhonnobad', 'Alvida'], 0, { promptScript: 'নমস্কার', promptTranslit: 'Nomoshkar' }),
          mc('bn-u2-l1-e2', '"Dhonnobad" means?', ['Please', 'Goodbye', 'Thank you', 'Sorry'], 2, { promptScript: 'ধন্যবাদ' }),
          mc('bn-u2-l1-e3', '"Abar dekha hobe" means?', ['Hello', 'See you again', 'Good morning', 'Good night'], 1, { promptScript: 'আবার দেখা হবে' }),
          wo('bn-u2-l1-e4', 'Arrange: "Good morning"', 'Shubho sokal'),
        ],
      },
      {
        id: 'bn-u2-l2', title: 'Basic Phrases', titleNative: 'সহজ বাক্য',
        exercises: [
          mc('bn-u2-l2-e1', '"Aami bhalo aachi" means?', ['I am late', 'I am fine', 'I am hungry', 'I am tired'], 1, { promptTranslit: 'Aami bhalo aachi' }),
          mc('bn-u2-l2-e2', '"Maaf korben" means?', ['Thank you', 'Good night', 'Excuse me / Sorry', 'Welcome'], 2),
          fb('bn-u2-l2-e3', 'Type the transliteration (romanized)', 'To say thank you in Bengali, say ___ (transliteration: dhonnobad)', 'dhonnobad', 'ধন্যবাদ — ধ ন্য বা দ'),
          mp('bn-u2-l2-e4', 'Match Bengali phrases to meanings', [
            { left: 'নমস্কার', right: 'Hello' },
            { left: 'ধন্যবাদ', right: 'Thank you' },
            { left: 'ভালো থাকুন', right: 'Stay well' },
            { left: 'শুভ সকাল', right: 'Good morning' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'bn-u3', title: 'Numbers', titleNative: 'সংখ্যা', description: 'Count 1–10 in Bengali', color: '#16A085',
    lessons: [
      {
        id: 'bn-u3-l1', title: 'Numbers 1–5', titleNative: 'এক থেকে পাঁচ',
        exercises: [
          mc('bn-u3-l1-e1', 'How do you say "1" in Bengali?', ['দুই', 'এক', 'তিন', 'চার'], 1, { promptScript: 'এক', promptTranslit: 'ek' }),
          mc('bn-u3-l1-e2', '"তিন" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptScript: 'তিন' }),
          mp('bn-u3-l1-e3', 'Match numbers to Bengali', [
            { left: '1', right: 'এক' },
            { left: '2', right: 'দুই' },
            { left: '3', right: 'তিন' },
            { left: '4', right: 'চার' },
          ]),
          fb('bn-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Bengali is ___ (transliteration: paanch)', 'paanch', 'পাঁচ — পাঁচ = five'),
        ],
      },
      {
        id: 'bn-u3-l2', title: 'Numbers 6–10', titleNative: 'ছয় থেকে দশ',
        exercises: [
          mc('bn-u3-l2-e1', '"সাত" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'সাত' }),
          mc('bn-u3-l2-e2', '10 in Bengali is?', ['আট', 'নয়', 'দশ', 'এগারো'], 2, { promptScript: 'দশ' }),
          mp('bn-u3-l2-e3', 'Match numbers to Bengali', [
            { left: '6', right: 'ছয়' },
            { left: '7', right: 'সাত' },
            { left: '8', right: 'আট' },
            { left: '9', right: 'নয়' },
          ]),
          wo('bn-u3-l2-e4', 'Arrange: "I have five books"', 'Amar paanch ta boi aahe'),
        ],
      },
    ],
  },
  {
    id: 'bn-u4', title: 'Food & Daily Life', titleNative: 'খাবার ও জীবন', description: 'Food and daily words in Bengali', color: '#1A5276',
    lessons: [
      {
        id: 'bn-u4-l1', title: 'Food Essentials', titleNative: 'খাবার',
        exercises: [
          mc('bn-u4-l1-e1', '"পানি" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'পানি', promptTranslit: 'paani' }),
          mc('bn-u4-l1-e2', 'How do you say "tea" in Bengali?', ['দুধ', 'ভাত', 'চা', 'রুটি'], 2, { promptScript: 'চা' }),
          mp('bn-u4-l1-e3', 'Match Bengali food words to English', [
            { left: 'পানি', right: 'Water' },
            { left: 'দুধ', right: 'Milk' },
            { left: 'চা', right: 'Tea' },
            { left: 'ভাত', right: 'Rice' },
          ]),
          fb('bn-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread in Bengali is ___ (transliteration: ruti)', 'ruti', 'রুটি — Flatbread'),
        ],
      },
      {
        id: 'bn-u4-l2', title: 'Daily Verbs', titleNative: 'দৈনন্দিন ক্রিয়া',
        exercises: [
          mc('bn-u4-l2-e1', '"Aami bhat khai" means?', ['I drink water', 'I eat rice', 'I want tea', 'I sleep'], 1),
          mc('bn-u4-l2-e2', '"Khida peye che" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('bn-u4-l2-e3', 'Arrange: "I drink tea in the morning"', 'Aami sokale cha khai'),
          mp('bn-u4-l2-e4', 'Match Bengali verbs to meanings', [
            { left: 'খাওয়া', right: 'To eat' },
            { left: 'পান করা', right: 'To drink' },
            { left: 'ঘুমানো', right: 'To sleep' },
            { left: 'যাওয়া', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 4. TAMIL — தமிழ்
// ══════════════════════════════════════════════════════════
const tamilCurriculum: Unit[] = [
  {
    id: 'ta-u1', title: 'Tamil Script', titleNative: 'தமிழ் எழுத்து', description: 'Learn Tamil letters', color: '#C0392B',
    lessons: [
      {
        id: 'ta-u1-l1', title: 'Vowels', titleNative: 'உயிரெழுத்து',
        exercises: [
          mc('ta-u1-l1-e1', 'Tamil script has how many basic vowels?', ['5', '7', '12', '16'], 3, { hint: 'Tamil has a rich vowel system' }),
          mc('ta-u1-l1-e2', '"அ" sounds like?', ['E', 'A', 'I', 'O'], 1, { promptScript: 'அ' }),
          mp('ta-u1-l1-e3', 'Match Tamil vowels to sounds', [
            { left: 'அ', right: 'A' },
            { left: 'ஆ', right: 'AA' },
            { left: 'இ', right: 'I' },
            { left: 'ஈ', right: 'EE' },
          ]),
          fb('ta-u1-l1-e4', 'Transliterate', 'The Tamil vowel "ஆ" sounds like ___', 'aa', 'Long A sound'),
        ],
      },
      {
        id: 'ta-u1-l2', title: 'Consonants', titleNative: 'மெய்யெழுத்து',
        exercises: [
          mc('ta-u1-l2-e1', '"க" sounds like?', ['Ga', 'Ka', 'Sa', 'Pa'], 1, { promptScript: 'க' }),
          mc('ta-u1-l2-e2', 'Tamil script belongs to which family?', ['Arabic', 'Latin', 'Brahmic', 'Cyrillic'], 2),
          mp('ta-u1-l2-e3', 'Match Tamil consonants to sounds', [
            { left: 'க', right: 'Ka' },
            { left: 'ட', right: 'Ta' },
            { left: 'ம', right: 'Ma' },
            { left: 'வ', right: 'Va' },
          ]),
          wo('ta-u1-l2-e4', 'Spell Tamil (transliteration)', 'Ta mi zh'),
        ],
      },
    ],
  },
  {
    id: 'ta-u2', title: 'Greetings & Phrases', titleNative: 'வணக்கம்', description: 'Say hello in Tamil', color: '#E74C3C',
    lessons: [
      {
        id: 'ta-u2-l1', title: 'Hello & Thanks', titleNative: 'வணக்கம்',
        exercises: [
          mc('ta-u2-l1-e1', 'How do you say "Hello" in Tamil?', ['Vanakkam', 'Nandri', 'Poitu varen', 'Sari'], 0, { promptScript: 'வணக்கம்', promptTranslit: 'Vanakkam' }),
          mc('ta-u2-l1-e2', '"Nandri" means?', ['Hello', 'Goodbye', 'Thank you', 'Sorry'], 2, { promptScript: 'நன்றி' }),
          mc('ta-u2-l1-e3', '"Poitu varen" means?', ['Come back', 'I am going (and coming back)', 'Goodbye forever', 'See you'], 1, { hint: 'A polite Tamil farewell' }),
          wo('ta-u2-l1-e4', 'Arrange: "Hello, I am fine"', 'Vanakkam naan nalam'),
        ],
      },
      {
        id: 'ta-u2-l2', title: 'Introductions', titleNative: 'அறிமுகம்',
        exercises: [
          mc('ta-u2-l2-e1', '"En peyar ___" means?', ['I live in ___', 'My name is ___', 'I like ___', 'I am from ___'], 1),
          mc('ta-u2-l2-e2', '"Epdi irukkeenga?" means?', ['Where are you from?', 'What is your name?', 'How are you?', 'What time is it?'], 2),
          fb('ta-u2-l2-e3', 'Type the transliteration (romanized)', 'To say thank you in Tamil, say ___ (transliteration: nandri)', 'nandri', 'நன்றி — நன்றி = Nandri'),
          mp('ta-u2-l2-e4', 'Match Tamil phrases to meanings', [
            { left: 'வணக்கம்', right: 'Hello' },
            { left: 'நன்றி', right: 'Thank you' },
            { left: 'பரவாயில்லை', right: 'It\'s okay' },
            { left: 'போய் வருகிறேன்', right: 'I\'ll be back' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'ta-u3', title: 'Numbers', titleNative: 'எண்கள்', description: 'Count 1–10 in Tamil', color: '#8E44AD',
    lessons: [
      {
        id: 'ta-u3-l1', title: 'Numbers 1–5', titleNative: 'ஒன்று முதல் ஐந்து',
        exercises: [
          mc('ta-u3-l1-e1', '"ஒன்று" means?', ['Two', 'One', 'Three', 'Four'], 1, { promptScript: 'ஒன்று', promptTranslit: 'ondru' }),
          mc('ta-u3-l1-e2', '"மூன்று" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptScript: 'மூன்று' }),
          mp('ta-u3-l1-e3', 'Match numbers to Tamil', [
            { left: '1', right: 'ஒன்று' },
            { left: '2', right: 'இரண்டு' },
            { left: '3', right: 'மூன்று' },
            { left: '4', right: 'நான்கு' },
          ]),
          fb('ta-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Tamil is ___ (transliteration: ainthu)', 'ainthu', 'ஐந்து — Five = ஐந்து'),
        ],
      },
      {
        id: 'ta-u3-l2', title: 'Numbers 6–10', titleNative: 'ஆறு முதல் பத்து',
        exercises: [
          mc('ta-u3-l2-e1', '"ஏழு" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'ஏழு' }),
          mc('ta-u3-l2-e2', '10 in Tamil is?', ['எட்டு', 'ஒன்பது', 'பத்து', 'பதினொன்று'], 2, { promptScript: 'பத்து' }),
          mp('ta-u3-l2-e3', 'Match numbers to Tamil', [
            { left: '6', right: 'ஆறு' },
            { left: '7', right: 'ஏழு' },
            { left: '8', right: 'எட்டு' },
            { left: '9', right: 'ஒன்பது' },
          ]),
          wo('ta-u3-l2-e4', 'Arrange: "I need ten rupees"', 'Enakku pathu roobai vennum'),
        ],
      },
    ],
  },
  {
    id: 'ta-u4', title: 'Food & Daily Life', titleNative: 'உணவு மற்றும் வாழ்க்கை', description: 'Food and daily life in Tamil', color: '#2471A3',
    lessons: [
      {
        id: 'ta-u4-l1', title: 'Food Essentials', titleNative: 'உணவு',
        exercises: [
          mc('ta-u4-l1-e1', '"தண்ணீர்" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'தண்ணீர்', promptTranslit: 'thanneer' }),
          mc('ta-u4-l1-e2', 'How do you say "tea" in Tamil?', ['பால்', 'சோறு', 'தேநீர்', 'சப்பாத்தி'], 2, { promptScript: 'தேநீர்' }),
          mp('ta-u4-l1-e3', 'Match Tamil food words to English', [
            { left: 'தண்ணீர்', right: 'Water' },
            { left: 'பால்', right: 'Milk' },
            { left: 'தேநீர்', right: 'Tea' },
            { left: 'சோறு', right: 'Rice' },
          ]),
          fb('ta-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread/chapati in Tamil is ___ (transliteration: sappathi)', 'sappathi', 'சப்பாத்தி — Flatbread'),
        ],
      },
      {
        id: 'ta-u4-l2', title: 'Daily Phrases', titleNative: 'அன்றாட வாழ்க்கை',
        exercises: [
          mc('ta-u4-l2-e1', '"Naan saaptein" means?', ['I drank water', 'I ate (food)', 'I want tea', 'I sleep'], 1),
          mc('ta-u4-l2-e2', '"Pasikuthu" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('ta-u4-l2-e3', 'Arrange: "I want water"', 'Enakku thanneer vennum'),
          mp('ta-u4-l2-e4', 'Match Tamil verbs to meanings', [
            { left: 'சாப்பிட', right: 'To eat' },
            { left: 'குடிக்க', right: 'To drink' },
            { left: 'தூங்க', right: 'To sleep' },
            { left: 'போக', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 5. TELUGU — తెలుగు
// ══════════════════════════════════════════════════════════
const teluguCurriculum: Unit[] = [
  {
    id: 'te-u1', title: 'Telugu Script', titleNative: 'తెలుగు లిపి', description: 'Learn the Telugu alphabet', color: '#D68910',
    lessons: [
      {
        id: 'te-u1-l1', title: 'Script Intro', titleNative: 'పరిచయం',
        exercises: [
          mc('te-u1-l1-e1', 'Telugu script belongs to which family?', ['Brahmic', 'Arabic', 'Latin', 'Cyrillic'], 0),
          mc('te-u1-l1-e2', '"అ" in Telugu sounds like?', ['I', 'A', 'U', 'E'], 1, { promptScript: 'అ' }),
          mp('te-u1-l1-e3', 'Match Telugu letters to sounds', [
            { left: 'అ', right: 'A' },
            { left: 'ఆ', right: 'AA' },
            { left: 'క', right: 'Ka' },
            { left: 'మ', right: 'Ma' },
          ]),
          fb('te-u1-l1-e4', 'Transliterate', 'The Telugu letter "క" sounds like ___', 'ka', 'First consonant'),
        ],
      },
      {
        id: 'te-u1-l2', title: 'More Letters', titleNative: 'మరిన్ని అక్షరాలు',
        exercises: [
          mc('te-u1-l2-e1', '"క" sounds like?', ['Ga', 'Ka', 'Sa', 'Pa'], 1, { promptScript: 'క' }),
          mc('te-u1-l2-e2', 'Telugu script is closely related to?', ['Kannada script', 'Tamil script', 'Bengali script', 'Odia script'], 0),
          mp('te-u1-l2-e3', 'Match Telugu consonants to sounds', [
            { left: 'క', right: 'Ka' },
            { left: 'గ', right: 'Ga' },
            { left: 'త', right: 'Ta' },
            { left: 'న', right: 'Na' },
          ]),
          wo('te-u1-l2-e4', 'Spell: "Telugu"', 'Te lu gu'),
        ],
      },
    ],
  },
  {
    id: 'te-u2', title: 'Greetings & Phrases', titleNative: 'శుభాకాంక్షలు', description: 'Telugu greetings', color: '#F39C12',
    lessons: [
      {
        id: 'te-u2-l1', title: 'Hello & Thanks', titleNative: 'నమస్కారం',
        exercises: [
          mc('te-u2-l1-e1', 'How do you say "Hello" in Telugu?', ['Namaskaram', 'Dhanyavadalu', 'Bagunna', 'Randi'], 0, { promptScript: 'నమస్కారం', promptTranslit: 'Namaskaram' }),
          mc('te-u2-l1-e2', '"Dhanyavadalu" means?', ['Please', 'Hello', 'Thank you', 'Sorry'], 2, { promptScript: 'ధన్యవాదాలు' }),
          mc('te-u2-l1-e3', '"Mee peru emi?" means?', ['How are you?', 'What is your name?', 'Where do you live?', 'How old are you?'], 1),
          wo('te-u2-l1-e4', 'Arrange: "Hello, how are you?"', 'Namaskaram meeru ela unnaru'),
        ],
      },
      {
        id: 'te-u2-l2', title: 'Basic Phrases', titleNative: 'సాధారణ వాక్యాలు',
        exercises: [
          mc('te-u2-l2-e1', '"Nenu bagunna" means?', ['I am happy', 'I am fine', 'I am late', 'I am sleepy'], 1, { promptTranslit: 'Nenu bagunna' }),
          mc('te-u2-l2-e2', '"Sari" in Telugu means?', ['No', 'Maybe', 'OK / Fine', 'Hurry'], 2),
          fb('te-u2-l2-e3', 'Type the transliteration (romanized)', 'To say thank you in Telugu: ___ (transliteration: dhanyavadalu)', 'dhanyavadalu', 'ధన్యవాదాలు — ధ న్య వా దా లు'),
          mp('te-u2-l2-e4', 'Match Telugu phrases to meanings', [
            { left: 'నమస్కారం', right: 'Hello' },
            { left: 'ధన్యవాదాలు', right: 'Thank you' },
            { left: 'సరి', right: 'OK' },
            { left: 'క్షమించండి', right: 'Sorry' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'te-u3', title: 'Numbers', titleNative: 'సంఖ్యలు', description: 'Count 1–10 in Telugu', color: '#76448A',
    lessons: [
      {
        id: 'te-u3-l1', title: 'Numbers 1–5', titleNative: 'ఒకటి నుండి ఐదు',
        exercises: [
          mc('te-u3-l1-e1', '"ఒకటి" means?', ['Two', 'One', 'Three', 'Four'], 1, { promptScript: 'ఒకటి', promptTranslit: 'okati' }),
          mc('te-u3-l1-e2', '"మూడు" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptScript: 'మూడు' }),
          mp('te-u3-l1-e3', 'Match numbers to Telugu', [
            { left: '1', right: 'ఒకటి' },
            { left: '2', right: 'రెండు' },
            { left: '3', right: 'మూడు' },
            { left: '4', right: 'నాలుగు' },
          ]),
          fb('te-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Telugu is ___ (transliteration: aidu)', 'aidu', 'ఐదు — Five = ఐదు'),
        ],
      },
      {
        id: 'te-u3-l2', title: 'Numbers 6–10', titleNative: 'ఆరు నుండి పది',
        exercises: [
          mc('te-u3-l2-e1', '"ఏడు" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'ఏడు' }),
          mc('te-u3-l2-e2', '10 in Telugu is?', ['ఎనిమిది', 'తొమ్మిది', 'పది', 'పదకొండు'], 2, { promptScript: 'పది' }),
          mp('te-u3-l2-e3', 'Match numbers to Telugu', [
            { left: '6', right: 'ఆరు' },
            { left: '7', right: 'ఏడు' },
            { left: '8', right: 'ఎనిమిది' },
            { left: '9', right: 'తొమ్మిది' },
          ]),
          wo('te-u3-l2-e4', 'Arrange: "I have five rupees"', 'Naakku aidu rupayalu unnaayi'),
        ],
      },
    ],
  },
  {
    id: 'te-u4', title: 'Food & Daily Life', titleNative: 'ఆహారం మరియు జీవితం', description: 'Food and daily life in Telugu', color: '#1A5276',
    lessons: [
      {
        id: 'te-u4-l1', title: 'Food Essentials', titleNative: 'ఆహారం',
        exercises: [
          mc('te-u4-l1-e1', '"నీళ్ళు" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'నీళ్ళు', promptTranslit: 'neellu' }),
          mc('te-u4-l1-e2', 'Tea in Telugu is?', ['పాలు', 'అన్నం', 'చాయ్', 'రొట్టె'], 2, { promptScript: 'చాయ్' }),
          mp('te-u4-l1-e3', 'Match Telugu food words to English', [
            { left: 'నీళ్ళు', right: 'Water' },
            { left: 'పాలు', right: 'Milk' },
            { left: 'చాయ్', right: 'Tea' },
            { left: 'అన్నం', right: 'Rice' },
          ]),
          fb('te-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread/roti in Telugu is ___ (transliteration: rotte)', 'rotte', 'రొట్టె — Flatbread'),
        ],
      },
      {
        id: 'te-u4-l2', title: 'Daily Phrases', titleNative: 'రోజువారీ జీవితం',
        exercises: [
          mc('te-u4-l2-e1', '"Nenu annam tintanu" means?', ['I drink water', 'I eat rice', 'I want tea', 'I sleep'], 1),
          mc('te-u4-l2-e2', '"Akali ga undi" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('te-u4-l2-e3', 'Arrange: "I want water"', 'Naakku neellu kaavaali'),
          mp('te-u4-l2-e4', 'Match Telugu verbs to meanings', [
            { left: 'తినడం', right: 'To eat' },
            { left: 'తాగడం', right: 'To drink' },
            { left: 'నిద్రించడం', right: 'To sleep' },
            { left: 'వెళ్ళడం', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 6. GUJARATI — ગુજરાતી
// ══════════════════════════════════════════════════════════
const gujaratiCurriculum: Unit[] = [
  {
    id: 'gu-u1', title: 'Gujarati Script', titleNative: 'ગુજરાતી લિપિ', description: 'Learn Gujarati letters', color: '#8E44AD',
    lessons: [
      {
        id: 'gu-u1-l1', title: 'Script Basics', titleNative: 'મૂળ',
        exercises: [
          mc('gu-u1-l1-e1', 'Gujarati script descends from?', ['Arabic', 'Devanagari', 'Tamil', 'Chinese'], 1, { hint: 'Both share Brahmic origins' }),
          mc('gu-u1-l1-e2', 'Gujarati script lacks what compared to Devanagari?', ['Vowels', 'Consonants', 'The horizontal headline (shirorekha)', 'Numbers'], 2),
          mp('gu-u1-l1-e3', 'Match Gujarati letters to sounds', [
            { left: 'ક', right: 'Ka' },
            { left: 'ગ', right: 'Ga' },
            { left: 'મ', right: 'Ma' },
            { left: 'ન', right: 'Na' },
          ]),
          fb('gu-u1-l1-e4', 'Transliterate', 'The Gujarati letter "ક" sounds like ___', 'ka', 'First consonant'),
        ],
      },
      {
        id: 'gu-u1-l2', title: 'More Letters', titleNative: 'વધુ અક્ષરો',
        exercises: [
          mc('gu-u1-l2-e1', '"ક" in Gujarati sounds like?', ['Ga', 'Ka', 'Sa', 'Ja'], 1, { promptScript: 'ક' }),
          mc('gu-u1-l2-e2', '"અ" sounds like?', ['I', 'A', 'U', 'O'], 1, { promptScript: 'અ' }),
          mp('gu-u1-l2-e3', 'Match Gujarati vowels to sounds', [
            { left: 'અ', right: 'A' },
            { left: 'આ', right: 'AA' },
            { left: 'ઇ', right: 'I' },
            { left: 'ઉ', right: 'U' },
          ]),
          wo('gu-u1-l2-e4', 'Spell: "Gujarat"', 'Gu ja rat'),
        ],
      },
    ],
  },
  {
    id: 'gu-u2', title: 'Greetings & Phrases', titleNative: 'સ્વાગત', description: 'Say hello in Gujarati', color: '#9B59B6',
    lessons: [
      {
        id: 'gu-u2-l1', title: 'Hello & Thanks', titleNative: 'નમસ્તે',
        exercises: [
          mc('gu-u2-l1-e1', 'How do you greet in Gujarati?', ['Kem cho', 'Shukriya', 'Tamaro', 'Pachi'], 0, { promptScript: 'કેમ છો', promptTranslit: 'Kem cho', hint: '"How are you" also serves as a greeting!' }),
          mc('gu-u2-l1-e2', '"Shukriya" in Gujarati means?', ['Hello', 'Sorry', 'Thank you', 'Goodbye'], 2, { promptScript: 'શુક્રિયા' }),
          mc('gu-u2-l1-e3', '"Hu saaru chhu" means?', ['I am late', 'I am fine', 'I am going', 'I am here'], 1),
          wo('gu-u2-l1-e4', 'Arrange: "How are you, friend?"', 'Kem cho mara mitra'),
        ],
      },
      {
        id: 'gu-u2-l2', title: 'Introductions', titleNative: 'ઓળખ',
        exercises: [
          mc('gu-u2-l2-e1', '"Maru naam ___ chhe" means?', ['I live in ___', 'My name is ___', 'My age is ___', 'My friend is ___'], 1),
          mc('gu-u2-l2-e2', '"Aavjo" means?', ['Hello', 'Thank you', 'Goodbye', 'Please'], 2, { hint: 'A warm parting word in Gujarati' }),
          fb('gu-u2-l2-e3', 'Type the transliteration (romanized)', 'To say thank you in Gujarati: ___ (transliteration: shukriya)', 'shukriya', 'શુક્રિયા —  શ + ુ + ક + ્ + ર + િ + ય + ા'),
          mp('gu-u2-l2-e4', 'Match Gujarati phrases to meanings', [
            { left: 'કેમ છો', right: 'How are you?' },
            { left: 'શુક્રિયા', right: 'Thank you' },
            { left: 'આવજો', right: 'Goodbye' },
            { left: 'માફ કરજો', right: 'Sorry' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'gu-u3', title: 'Numbers', titleNative: 'સંખ્યા', description: 'Count 1–10 in Gujarati', color: '#1A5276',
    lessons: [
      {
        id: 'gu-u3-l1', title: 'Numbers 1–5', titleNative: 'એક થી પાંચ',
        exercises: [
          mc('gu-u3-l1-e1', '"એક" means?', ['Two', 'One', 'Three', 'Four'], 1, { promptScript: 'એક', promptTranslit: 'ek' }),
          mc('gu-u3-l1-e2', '"ત્રણ" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptScript: 'ત્રણ' }),
          mp('gu-u3-l1-e3', 'Match numbers to Gujarati', [
            { left: '1', right: 'એક' },
            { left: '2', right: 'બે' },
            { left: '3', right: 'ત્રણ' },
            { left: '4', right: 'ચાર' },
          ]),
          fb('gu-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Gujarati is ___ (transliteration: paanch)', 'paanch', 'પાંચ — Five'),
        ],
      },
      {
        id: 'gu-u3-l2', title: 'Numbers 6–10', titleNative: 'છ થી દસ',
        exercises: [
          mc('gu-u3-l2-e1', '"સાત" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'સાત' }),
          mc('gu-u3-l2-e2', '10 in Gujarati is?', ['આઠ', 'નવ', 'દસ', 'અગિયાર'], 2, { promptScript: 'દસ' }),
          mp('gu-u3-l2-e3', 'Match numbers to Gujarati', [
            { left: '6', right: 'છ' },
            { left: '7', right: 'સાત' },
            { left: '8', right: 'આઠ' },
            { left: '9', right: 'નવ' },
          ]),
          wo('gu-u3-l2-e4', 'Arrange: "I want five mangoes"', 'Mane paanch keri joie'),
        ],
      },
    ],
  },
  {
    id: 'gu-u4', title: 'Food & Daily Life', titleNative: 'ખોરાક અને જીવન', description: 'Food and daily life in Gujarati', color: '#117A65',
    lessons: [
      {
        id: 'gu-u4-l1', title: 'Food Essentials', titleNative: 'ખોરાક',
        exercises: [
          mc('gu-u4-l1-e1', '"પાણી" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'પાણી', promptTranslit: 'paani' }),
          mc('gu-u4-l1-e2', 'Tea in Gujarati is?', ['દૂધ', 'ભાત', 'ચા', 'રોટલી'], 2, { promptScript: 'ચા' }),
          mp('gu-u4-l1-e3', 'Match Gujarati food words to English', [
            { left: 'પાણી', right: 'Water' },
            { left: 'દૂધ', right: 'Milk' },
            { left: 'ચા', right: 'Tea' },
            { left: 'ભાત', right: 'Rice' },
          ]),
          fb('gu-u4-l1-e4', 'Type the transliteration (romanized)', 'Flatbread in Gujarati is ___ (transliteration: rotli)', 'rotli', 'રોટલી — Round bread'),
        ],
      },
      {
        id: 'gu-u4-l2', title: 'Daily Phrases', titleNative: 'રોજિંદા વ્યવહાર',
        exercises: [
          mc('gu-u4-l2-e1', '"Hu bhat khau chhu" means?', ['I drink water', 'I eat rice', 'I want tea', 'I sleep'], 1),
          mc('gu-u4-l2-e2', '"Bhukh lagi chhe" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('gu-u4-l2-e3', 'Arrange: "I want water please"', 'Mane paani aapso please'),
          mp('gu-u4-l2-e4', 'Match Gujarati verbs to meanings', [
            { left: 'ખાવું', right: 'To eat' },
            { left: 'પીવું', right: 'To drink' },
            { left: 'સૂવું', right: 'To sleep' },
            { left: 'જવું', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 7. PUNJABI — ਪੰਜਾਬੀ
// ══════════════════════════════════════════════════════════
const punjabiCurriculum: Unit[] = [
  {
    id: 'pa-u1', title: 'Gurmukhi Script', titleNative: 'ਗੁਰਮੁਖੀ', description: 'The Punjabi alphabet', color: '#1E8449',
    lessons: [
      {
        id: 'pa-u1-l1', title: 'Gurmukhi Basics', titleNative: 'ਮੂਲ',
        exercises: [
          mc('pa-u1-l1-e1', 'Punjabi in India is written in which script?', ['Devanagari', 'Gurmukhi', 'Shahmukhi', 'Both B and C'], 1, { hint: 'Gurmukhi in India, Shahmukhi in Pakistan' }),
          mc('pa-u1-l1-e2', 'Gurmukhi has how many base letters?', ['26', '35', '42', '50'], 1),
          mp('pa-u1-l1-e3', 'Match Gurmukhi letters to sounds', [
            { left: 'ਸ', right: 'Sa' },
            { left: 'ਕ', right: 'Ka' },
            { left: 'ਮ', right: 'Ma' },
            { left: 'ਨ', right: 'Na' },
          ]),
          fb('pa-u1-l1-e4', 'Transliterate', 'The Gurmukhi letter "ਸ" sounds like ___', 'sa', 'First letter of Gurmukhi'),
        ],
      },
      {
        id: 'pa-u1-l2', title: 'More Letters', titleNative: 'ਹੋਰ ਅੱਖਰ',
        exercises: [
          mc('pa-u1-l2-e1', '"ਪ" sounds like?', ['Ka', 'Pa', 'Ma', 'Ba'], 1, { promptScript: 'ਪ' }),
          mc('pa-u1-l2-e2', '"ਅ" sounds like?', ['I', 'A', 'U', 'O'], 1, { promptScript: 'ਅ' }),
          mp('pa-u1-l2-e3', 'Match Gurmukhi vowels/letters to sounds', [
            { left: 'ਅ', right: 'A' },
            { left: 'ਇ', right: 'I' },
            { left: 'ਉ', right: 'U' },
            { left: 'ਏ', right: 'E' },
          ]),
          wo('pa-u1-l2-e4', 'Spell: "Punjab"', 'Pun jab'),
        ],
      },
    ],
  },
  {
    id: 'pa-u2', title: 'Greetings & Phrases', titleNative: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', description: 'Punjabi greetings', color: '#27AE60',
    lessons: [
      {
        id: 'pa-u2-l1', title: 'Hello & Blessings', titleNative: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
        exercises: [
          mc('pa-u2-l1-e1', 'The traditional Punjabi greeting is?', ['Sat Sri Akal', 'Namaste', 'Shukriya', 'Theek hai'], 0, { promptScript: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', promptTranslit: 'Sat Sri Akal' }),
          mc('pa-u2-l1-e2', '"Shukriya" in Punjabi means?', ['Hello', 'Sorry', 'Thank you', 'Goodbye'], 2, { promptScript: 'ਸ਼ੁਕਰੀਆ' }),
          mc('pa-u2-l1-e3', '"Tusi kidaan ho?" means?', ['How old are you?', 'Where are you going?', 'How are you?', 'What is your name?'], 2),
          wo('pa-u2-l1-e4', 'Arrange: "I am fine, thank you"', 'Main theek haan shukriya'),
        ],
      },
      {
        id: 'pa-u2-l2', title: 'Daily Phrases', titleNative: 'ਰੋਜ਼ਾਨਾ ਗੱਲਬਾਤ',
        exercises: [
          mc('pa-u2-l2-e1', '"Fer milange" means?', ['Come here', 'See you later', 'Good morning', 'Good night'], 1, { hint: 'A common Punjabi farewell' }),
          mc('pa-u2-l2-e2', '"Waheguru" is?', ['A greeting', 'A divine name / blessing', 'A food', 'A city'], 1),
          fb('pa-u2-l2-e3', 'Fill in', 'To say "see you later" in Punjabi: ___ milange', 'fer', 'ਫੇਰ = again/later'),
          mp('pa-u2-l2-e4', 'Match Punjabi phrases to meanings', [
            { left: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', right: 'Hello/Goodbye' },
            { left: 'ਸ਼ੁਕਰੀਆ', right: 'Thank you' },
            { left: 'ਫੇਰ ਮਿਲਾਂਗੇ', right: 'See you later' },
            { left: 'ਕੋਈ ਗੱਲ ਨਹੀਂ', right: 'No problem' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'pa-u3', title: 'Numbers', titleNative: 'ਗਿਣਤੀ', description: 'Count 1–10 in Punjabi', color: '#76448A',
    lessons: [
      {
        id: 'pa-u3-l1', title: 'Numbers 1–5', titleNative: 'ਇੱਕ ਤੋਂ ਪੰਜ',
        exercises: [
          mc('pa-u3-l1-e1', '"ਇੱਕ" means?', ['Two', 'One', 'Three', 'Four'], 1, { promptScript: 'ਇੱਕ', promptTranslit: 'ikk' }),
          mc('pa-u3-l1-e2', '"ਤਿੰਨ" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptScript: 'ਤਿੰਨ' }),
          mp('pa-u3-l1-e3', 'Match numbers to Punjabi', [
            { left: '1', right: 'ਇੱਕ' },
            { left: '2', right: 'ਦੋ' },
            { left: '3', right: 'ਤਿੰਨ' },
            { left: '4', right: 'ਚਾਰ' },
          ]),
          fb('pa-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Punjabi is ___ (transliteration: panj)', 'panj', 'ਪੰਜ — Five = ਪੰਜ'),
        ],
      },
      {
        id: 'pa-u3-l2', title: 'Numbers 6–10', titleNative: 'ਛੇ ਤੋਂ ਦਸ',
        exercises: [
          mc('pa-u3-l2-e1', '"ਸੱਤ" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'ਸੱਤ' }),
          mc('pa-u3-l2-e2', '10 in Punjabi is?', ['ਅੱਠ', 'ਨੌ', 'ਦਸ', 'ਗਿਆਰਾਂ'], 2, { promptScript: 'ਦਸ' }),
          mp('pa-u3-l2-e3', 'Match numbers to Punjabi', [
            { left: '6', right: 'ਛੇ' },
            { left: '7', right: 'ਸੱਤ' },
            { left: '8', right: 'ਅੱਠ' },
            { left: '9', right: 'ਨੌ' },
          ]),
          wo('pa-u3-l2-e4', 'Arrange: "I have five rotis"', 'Mere kol panj rotiyaan hain'),
        ],
      },
    ],
  },
  {
    id: 'pa-u4', title: 'Food & Daily Life', titleNative: 'ਖਾਣਾ ਅਤੇ ਜ਼ਿੰਦਗੀ', description: 'Food and daily life in Punjabi', color: '#117A65',
    lessons: [
      {
        id: 'pa-u4-l1', title: 'Food Essentials', titleNative: 'ਖਾਣਾ',
        exercises: [
          mc('pa-u4-l1-e1', '"ਪਾਣੀ" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'ਪਾਣੀ', promptTranslit: 'paani' }),
          mc('pa-u4-l1-e2', 'Tea in Punjabi is?', ['ਦੁੱਧ', 'ਚਾਵਲ', 'ਚਾਹ', 'ਰੋਟੀ'], 2, { promptScript: 'ਚਾਹ' }),
          mp('pa-u4-l1-e3', 'Match Punjabi food words to English', [
            { left: 'ਪਾਣੀ', right: 'Water' },
            { left: 'ਦੁੱਧ', right: 'Milk' },
            { left: 'ਚਾਹ', right: 'Tea' },
            { left: 'ਚਾਵਲ', right: 'Rice' },
          ]),
          fb('pa-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread in Punjabi is ___ (transliteration: roti)', 'roti', 'ਰੋਟੀ — Flatbread'),
        ],
      },
      {
        id: 'pa-u4-l2', title: 'Daily Phrases', titleNative: 'ਰੋਜ਼ਾਨਾ ਜ਼ਿੰਦਗੀ',
        exercises: [
          mc('pa-u4-l2-e1', '"Main roti khaanda haan" means?', ['I drink water', 'I eat bread/roti', 'I want tea', 'I sleep'], 1),
          mc('pa-u4-l2-e2', '"Bhukh lagg gayi" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('pa-u4-l2-e3', 'Arrange: "Give me water please"', 'Manu paani deo please'),
          mp('pa-u4-l2-e4', 'Match Punjabi verbs to meanings', [
            { left: 'ਖਾਣਾ', right: 'To eat' },
            { left: 'ਪੀਣਾ', right: 'To drink' },
            { left: 'ਸੌਣਾ', right: 'To sleep' },
            { left: 'ਜਾਣਾ', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 8. KANNADA — ಕನ್ನಡ
// ══════════════════════════════════════════════════════════
const kannadaCurriculum: Unit[] = [
  {
    id: 'kn-u1', title: 'Kannada Script', titleNative: 'ಕನ್ನಡ ಲಿಪಿ', description: 'Learn Kannada letters', color: '#CA6F1E',
    lessons: [
      {
        id: 'kn-u1-l1', title: 'Script Intro', titleNative: 'ಪರಿಚಯ',
        exercises: [
          mc('kn-u1-l1-e1', 'Kannada script belongs to which family?', ['Brahmic', 'Arabic', 'Latin', 'Cyrillic'], 0),
          mc('kn-u1-l1-e2', '"ಅ" sounds like?', ['I', 'A', 'U', 'O'], 1, { promptScript: 'ಅ' }),
          mp('kn-u1-l1-e3', 'Match Kannada letters to sounds', [
            { left: 'ಅ', right: 'A' },
            { left: 'ಕ', right: 'Ka' },
            { left: 'ಮ', right: 'Ma' },
            { left: 'ನ', right: 'Na' },
          ]),
          fb('kn-u1-l1-e4', 'Transliterate', 'The Kannada letter "ಕ" sounds like ___', 'ka', 'First consonant'),
        ],
      },
      {
        id: 'kn-u1-l2', title: 'More Letters', titleNative: 'ಇನ್ನಷ್ಟು ಅಕ್ಷರಗಳು',
        exercises: [
          mc('kn-u1-l2-e1', '"ಕ" sounds like?', ['Ga', 'Ka', 'Sa', 'Ta'], 1, { promptScript: 'ಕ' }),
          mc('kn-u1-l2-e2', 'Kannada script is closely related to?', ['Telugu script', 'Bengali script', 'Odia script', 'Tamil script'], 0),
          mp('kn-u1-l2-e3', 'Match Kannada letters to sounds', [
            { left: 'ಕ', right: 'Ka' },
            { left: 'ಗ', right: 'Ga' },
            { left: 'ತ', right: 'Ta' },
            { left: 'ರ', right: 'Ra' },
          ]),
          wo('kn-u1-l2-e4', 'Spell: "Kannada"', 'Ka nn da'),
        ],
      },
    ],
  },
  {
    id: 'kn-u2', title: 'Greetings & Phrases', titleNative: 'ನಮಸ್ಕಾರ', description: 'Say hello in Kannada', color: '#E67E22',
    lessons: [
      {
        id: 'kn-u2-l1', title: 'Hello & Thanks', titleNative: 'ನಮಸ್ಕಾರ',
        exercises: [
          mc('kn-u2-l1-e1', 'How do you say "Hello" in Kannada?', ['Namaskara', 'Dhanyavada', 'Hogabeku', 'Sari'], 0, { promptScript: 'ನಮಸ್ಕಾರ', promptTranslit: 'Namaskara' }),
          mc('kn-u2-l1-e2', '"Dhanyavada" means?', ['Sorry', 'Hello', 'Thank you', 'Goodbye'], 2, { promptScript: 'ಧನ್ಯವಾದ' }),
          mc('kn-u2-l1-e3', '"Hegiddeera?" means?', ['Where are you?', 'How are you?', 'What is your name?', 'How old are you?'], 1),
          wo('kn-u2-l1-e4', 'Arrange: "Hello, how are you?"', 'Namaskara neevu hegiddeera'),
        ],
      },
      {
        id: 'kn-u2-l2', title: 'Introductions', titleNative: 'ಪರಿಚಯ',
        exercises: [
          mc('kn-u2-l2-e1', '"Nanna hesaru ___" means?', ['My age is ___', 'My name is ___', 'My friend is ___', 'My house is ___'], 1),
          mc('kn-u2-l2-e2', '"Chennagi aithu" means?', ['It is bad', 'It is good / Nice', 'It is late', 'It is here'], 1, { hint: 'Kannadigas say this often!' }),
          fb('kn-u2-l2-e3', 'Type the transliteration (romanized)', 'To say thank you in Kannada: ___ (transliteration: dhanyavada)', 'dhanyavada', 'ಧನ್ಯವಾದ — ಧ ನ್ಯ ವಾ ದ'),
          mp('kn-u2-l2-e4', 'Match Kannada phrases to meanings', [
            { left: 'ನಮಸ್ಕಾರ', right: 'Hello' },
            { left: 'ಧನ್ಯವಾದ', right: 'Thank you' },
            { left: 'ಚೆನ್ನಾಗಿ ಆಯ್ತು', right: 'That\'s good' },
            { left: 'ಹೋಗಬೇಕು', right: 'I must go' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'kn-u3', title: 'Numbers', titleNative: 'ಸಂಖ್ಯೆಗಳು', description: 'Count 1–10 in Kannada', color: '#76448A',
    lessons: [
      {
        id: 'kn-u3-l1', title: 'Numbers 1–5', titleNative: 'ಒಂದು ರಿಂದ ಐದು',
        exercises: [
          mc('kn-u3-l1-e1', '"ಒಂದು" means?', ['Two', 'One', 'Three', 'Four'], 1, { promptScript: 'ಒಂದು', promptTranslit: 'ondu' }),
          mc('kn-u3-l1-e2', '"ಮೂರು" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptScript: 'ಮೂರು' }),
          mp('kn-u3-l1-e3', 'Match numbers to Kannada', [
            { left: '1', right: 'ಒಂದು' },
            { left: '2', right: 'ಎರಡು' },
            { left: '3', right: 'ಮೂರು' },
            { left: '4', right: 'ನಾಲ್ಕು' },
          ]),
          fb('kn-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Kannada is ___ (transliteration: aidu)', 'aidu', 'ಐದು — Five'),
        ],
      },
      {
        id: 'kn-u3-l2', title: 'Numbers 6–10', titleNative: 'ಆರು ರಿಂದ ಹತ್ತು',
        exercises: [
          mc('kn-u3-l2-e1', '"ಏಳು" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'ಏಳು' }),
          mc('kn-u3-l2-e2', '10 in Kannada is?', ['ಎಂಟು', 'ಒಂಬತ್ತು', 'ಹತ್ತು', 'ಹನ್ನೊಂದು'], 2, { promptScript: 'ಹತ್ತು' }),
          mp('kn-u3-l2-e3', 'Match numbers to Kannada', [
            { left: '6', right: 'ಆರು' },
            { left: '7', right: 'ಏಳು' },
            { left: '8', right: 'ಎಂಟು' },
            { left: '9', right: 'ಒಂಬತ್ತು' },
          ]),
          wo('kn-u3-l2-e4', 'Arrange: "I need five rupees"', 'Nange aidu rupai beku'),
        ],
      },
    ],
  },
  {
    id: 'kn-u4', title: 'Food & Daily Life', titleNative: 'ಆಹಾರ ಮತ್ತು ಜೀವನ', description: 'Food and daily life in Kannada', color: '#117A65',
    lessons: [
      {
        id: 'kn-u4-l1', title: 'Food Essentials', titleNative: 'ಆಹಾರ',
        exercises: [
          mc('kn-u4-l1-e1', '"ನೀರು" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'ನೀರು', promptTranslit: 'neeru' }),
          mc('kn-u4-l1-e2', 'Tea in Kannada is?', ['ಹಾಲು', 'ಅನ್ನ', 'ಚಹಾ', 'ರೊಟ್ಟಿ'], 2, { promptScript: 'ಚಹಾ' }),
          mp('kn-u4-l1-e3', 'Match Kannada food words to English', [
            { left: 'ನೀರು', right: 'Water' },
            { left: 'ಹಾಲು', right: 'Milk' },
            { left: 'ಚಹಾ', right: 'Tea' },
            { left: 'ಅನ್ನ', right: 'Rice' },
          ]),
          fb('kn-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread/roti in Kannada is ___ (transliteration: rotti)', 'rotti', 'ರೊಟ್ಟಿ — Flatbread'),
        ],
      },
      {
        id: 'kn-u4-l2', title: 'Daily Phrases', titleNative: 'ದೈನಂದಿನ ಜೀವನ',
        exercises: [
          mc('kn-u4-l2-e1', '"Nanu annannu tinnutteene" means?', ['I drink water', 'I eat rice', 'I want tea', 'I sleep'], 1),
          mc('kn-u4-l2-e2', '"Hasi aagide" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('kn-u4-l2-e3', 'Arrange: "I want water"', 'Nange neeru beku'),
          mp('kn-u4-l2-e4', 'Match Kannada verbs to meanings', [
            { left: 'ತಿನ್ನು', right: 'To eat' },
            { left: 'ಕುಡಿ', right: 'To drink' },
            { left: 'ಮಲಗು', right: 'To sleep' },
            { left: 'ಹೋಗು', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 9. MALAYALAM — മലയാളം
// ══════════════════════════════════════════════════════════
const malayalamCurriculum: Unit[] = [
  {
    id: 'ml-u1', title: 'Malayalam Script', titleNative: 'മലയാളം ലിപി', description: 'The Malayalam alphabet', color: '#0E6655',
    lessons: [
      {
        id: 'ml-u1-l1', title: 'Script Intro', titleNative: 'പരിചയം',
        exercises: [
          mc('ml-u1-l1-e1', 'Malayalam script is known for being?', ['Very simple', 'One of the most complex scripts', 'Identical to Tamil', 'A Roman script'], 1),
          mc('ml-u1-l1-e2', '"അ" sounds like?', ['I', 'A', 'U', 'E'], 1, { promptScript: 'അ' }),
          mp('ml-u1-l1-e3', 'Match Malayalam letters to sounds', [
            { left: 'അ', right: 'A' },
            { left: 'ക', right: 'Ka' },
            { left: 'മ', right: 'Ma' },
            { left: 'ന', right: 'Na' },
          ]),
          fb('ml-u1-l1-e4', 'Transliterate', 'The Malayalam letter "ക" sounds like ___', 'ka', 'First consonant'),
        ],
      },
      {
        id: 'ml-u1-l2', title: 'More Letters', titleNative: 'കൂടുതൽ അക്ഷരങ്ങൾ',
        exercises: [
          mc('ml-u1-l2-e1', '"ക" sounds like?', ['Ga', 'Ka', 'Sa', 'Pa'], 1, { promptScript: 'ക' }),
          mc('ml-u1-l2-e2', 'Malayalam has how many basic letters?', ['26', '35', '51', '16'], 2, { hint: 'Rich vowel and consonant system' }),
          mp('ml-u1-l2-e3', 'Match Malayalam vowels to sounds', [
            { left: 'അ', right: 'A' },
            { left: 'ആ', right: 'AA' },
            { left: 'ഇ', right: 'I' },
            { left: 'ഉ', right: 'U' },
          ]),
          wo('ml-u1-l2-e4', 'Spell: "Kerala"', 'Ke ra la'),
        ],
      },
    ],
  },
  {
    id: 'ml-u2', title: 'Greetings & Phrases', titleNative: 'അഭിവാദനങ്ങൾ', description: 'Say hello in Malayalam', color: '#16A085',
    lessons: [
      {
        id: 'ml-u2-l1', title: 'Hello & Thanks', titleNative: 'നമസ്കാരം',
        exercises: [
          mc('ml-u2-l1-e1', 'How do you say "Hello" in Malayalam?', ['Namaskaram', 'Nandi', 'Poi varam', 'Sari'], 0, { promptScript: 'നമസ്കാരം', promptTranslit: 'Namaskaram' }),
          mc('ml-u2-l1-e2', '"Nandi" means?', ['Hello', 'Sorry', 'Thank you', 'Goodbye'], 2, { promptScript: 'നന്ദി' }),
          mc('ml-u2-l1-e3', '"Sughamaano?" means?', ['What is your name?', 'Are you well?', 'Where are you going?', 'How old are you?'], 1),
          wo('ml-u2-l1-e4', 'Arrange: "Hello, are you well?"', 'Namaskaram sughamaano'),
        ],
      },
      {
        id: 'ml-u2-l2', title: 'Basic Conversation', titleNative: 'സംഭാഷണം',
        exercises: [
          mc('ml-u2-l2-e1', '"Ente peru ___" means?', ['I live in ___', 'My name is ___', 'My age is ___', 'I want ___'], 1),
          mc('ml-u2-l2-e2', '"Sheriyanu" means?', ['Wrong', 'OK / Correct', 'I don\'t know', 'Hurry up'], 1, { hint: 'Said to confirm something is right' }),
          fb('ml-u2-l2-e3', 'Type the transliteration (romanized)', 'To say thank you in Malayalam: ___ (transliteration: nandi)', 'nandi', 'നന്ദി — നന്ദി = Nandi'),
          mp('ml-u2-l2-e4', 'Match Malayalam phrases to meanings', [
            { left: 'നമസ്കാരം', right: 'Hello' },
            { left: 'നന്ദി', right: 'Thank you' },
            { left: 'ശരിയാണ്', right: 'That\'s correct' },
            { left: 'പോയി വരാം', right: 'I\'ll be back' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'ml-u3', title: 'Numbers', titleNative: 'സംഖ്യകൾ', description: 'Count 1–10 in Malayalam', color: '#76448A',
    lessons: [
      {
        id: 'ml-u3-l1', title: 'Numbers 1–5', titleNative: 'ഒന്ന് മുതൽ അഞ്ച്',
        exercises: [
          mc('ml-u3-l1-e1', '"ഒന്ന്" means?', ['Two', 'One', 'Three', 'Four'], 1, { promptScript: 'ഒന്ന്', promptTranslit: 'onnu' }),
          mc('ml-u3-l1-e2', '"മൂന്ന്" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptScript: 'മൂന്ന്' }),
          mp('ml-u3-l1-e3', 'Match numbers to Malayalam', [
            { left: '1', right: 'ഒന്ന്' },
            { left: '2', right: 'രണ്ട്' },
            { left: '3', right: 'മൂന്ന്' },
            { left: '4', right: 'നാല്' },
          ]),
          fb('ml-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Malayalam is ___ (transliteration: anchu)', 'anchu', 'അഞ്ച് — Five'),
        ],
      },
      {
        id: 'ml-u3-l2', title: 'Numbers 6–10', titleNative: 'ആറ് മുതൽ പത്ത്',
        exercises: [
          mc('ml-u3-l2-e1', '"ഏഴ്" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'ഏഴ്' }),
          mc('ml-u3-l2-e2', '10 in Malayalam is?', ['എട്ട്', 'ഒൻപത്', 'പത്ത്', 'പതിനൊന്ന്'], 2, { promptScript: 'പത്ത്' }),
          mp('ml-u3-l2-e3', 'Match numbers to Malayalam', [
            { left: '6', right: 'ആറ്' },
            { left: '7', right: 'ഏഴ്' },
            { left: '8', right: 'എട്ട്' },
            { left: '9', right: 'ഒൻപത്' },
          ]),
          wo('ml-u3-l2-e4', 'Arrange: "I want five bananas"', 'Enikku anchu vaazha pazham venom'),
        ],
      },
    ],
  },
  {
    id: 'ml-u4', title: 'Food & Daily Life', titleNative: 'ഭക്ഷണവും ജീവിതവും', description: 'Food and daily life in Malayalam', color: '#1A5276',
    lessons: [
      {
        id: 'ml-u4-l1', title: 'Food Essentials', titleNative: 'ഭക്ഷണം',
        exercises: [
          mc('ml-u4-l1-e1', '"വെള്ളം" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'വെള്ളം', promptTranslit: 'vellam' }),
          mc('ml-u4-l1-e2', 'Tea in Malayalam is?', ['പാൽ', 'ചോറ്', 'ചായ', 'ചപ്പാത്തി'], 2, { promptScript: 'ചായ' }),
          mp('ml-u4-l1-e3', 'Match Malayalam food words to English', [
            { left: 'വെള്ളം', right: 'Water' },
            { left: 'പാൽ', right: 'Milk' },
            { left: 'ചായ', right: 'Tea' },
            { left: 'ചോറ്', right: 'Rice' },
          ]),
          fb('ml-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread/chapati in Malayalam is ___ (transliteration: chappathi)', 'chappathi', 'ചപ്പാത്തി — Flatbread'),
        ],
      },
      {
        id: 'ml-u4-l2', title: 'Daily Phrases', titleNative: 'ദൈനംദിന ജീവിതം',
        exercises: [
          mc('ml-u4-l2-e1', '"Njan choru kazhikkunnu" means?', ['I drink water', 'I eat rice', 'I want tea', 'I sleep'], 1),
          mc('ml-u4-l2-e2', '"Visha kazhikkunnu" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('ml-u4-l2-e3', 'Arrange: "I want water"', 'Enikku vellam veno'),
          mp('ml-u4-l2-e4', 'Match Malayalam verbs to meanings', [
            { left: 'കഴിക്കുക', right: 'To eat' },
            { left: 'കുടിക്കുക', right: 'To drink' },
            { left: 'ഉറങ്ങുക', right: 'To sleep' },
            { left: 'പോകുക', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 10. ODIA — ଓଡ଼ିଆ
// ══════════════════════════════════════════════════════════
const odiaCurriculum: Unit[] = [
  {
    id: 'or-u1', title: 'Odia Script', titleNative: 'ଓଡ଼ିଆ ଲିପି', description: 'Learn the Odia script', color: '#7D3C98',
    lessons: [
      {
        id: 'or-u1-l1', title: 'Script Basics', titleNative: 'ଆଧାର',
        exercises: [
          mc('or-u1-l1-e1', 'Odia script is known for its?', ['Pointed letters', 'Rounded letters', 'Square letters', 'Connected letters'], 1, { hint: 'Odia script has a beautiful circular style' }),
          mc('or-u1-l1-e2', '"ଅ" sounds like?', ['I', 'A', 'U', 'E'], 1, { promptScript: 'ଅ' }),
          mp('or-u1-l1-e3', 'Match Odia letters to sounds', [
            { left: 'ଅ', right: 'A' },
            { left: 'କ', right: 'Ka' },
            { left: 'ମ', right: 'Ma' },
            { left: 'ନ', right: 'Na' },
          ]),
          fb('or-u1-l1-e4', 'Transliterate', 'The Odia letter "କ" sounds like ___', 'ka', 'First consonant'),
        ],
      },
      {
        id: 'or-u1-l2', title: 'More Letters', titleNative: 'ଆଉ ଅକ୍ଷର',
        exercises: [
          mc('or-u1-l2-e1', '"କ" sounds like?', ['Ga', 'Ka', 'Sa', 'Ta'], 1, { promptScript: 'କ' }),
          mc('or-u1-l2-e2', 'Odia script is related to which other script?', ['Bengali script', 'Tamil', 'Arabic', 'Latin'], 0, { hint: 'Eastern Indian scripts share ancestry' }),
          mp('or-u1-l2-e3', 'Match Odia vowels to sounds', [
            { left: 'ଅ', right: 'A' },
            { left: 'ଆ', right: 'AA' },
            { left: 'ଇ', right: 'I' },
            { left: 'ଉ', right: 'U' },
          ]),
          wo('or-u1-l2-e4', 'Spell: "Odisha"', 'O di sha'),
        ],
      },
    ],
  },
  {
    id: 'or-u2', title: 'Greetings & Phrases', titleNative: 'ଅଭିବାଦନ', description: 'Say hello in Odia', color: '#8E44AD',
    lessons: [
      {
        id: 'or-u2-l1', title: 'Hello & Thanks', titleNative: 'ନମସ୍କାର',
        exercises: [
          mc('or-u2-l1-e1', 'How do you say "Hello" in Odia?', ['Namaskar', 'Dhanyabada', 'Deu', 'Thik'], 0, { promptScript: 'ନମସ୍କାର', promptTranslit: 'Namaskar' }),
          mc('or-u2-l1-e2', '"Dhanyabada" means?', ['Hello', 'Sorry', 'Thank you', 'Goodbye'], 2, { promptScript: 'ଧନ୍ୟବାଦ' }),
          mc('or-u2-l1-e3', '"Apana kana aachanti?" means?', ['How are you?', 'What is your name?', 'Where are you going?', 'What time is it?'], 0),
          wo('or-u2-l1-e4', 'Arrange: "Hello, thank you"', 'Namaskar dhanyabada'),
        ],
      },
      {
        id: 'or-u2-l2', title: 'Basic Phrases', titleNative: 'ସରଳ ବାକ୍ୟ',
        exercises: [
          mc('or-u2-l2-e1', '"Mora naama ___" means?', ['My age is ___', 'My name is ___', 'My home is ___', 'My friend is ___'], 1),
          mc('or-u2-l2-e2', '"Thik aachi" means?', ['I am late', 'I am fine', 'I am hungry', 'I am lost'], 1),
          fb('or-u2-l2-e3', 'Type the transliteration (romanized)', 'To say thank you in Odia: ___ (transliteration: dhanyabada)', 'dhanyabada', 'ଧନ୍ୟବାଦ — ଧ ନ୍ଯ ବା ଦ'),
          mp('or-u2-l2-e4', 'Match Odia phrases to meanings', [
            { left: 'ନମସ୍କାର', right: 'Hello' },
            { left: 'ଧନ୍ୟବାଦ', right: 'Thank you' },
            { left: 'ଠିକ ଅଛି', right: 'I am fine' },
            { left: 'ଆଉ ଦେଖା ହେବ', right: 'See you again' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'or-u3', title: 'Numbers', titleNative: 'ସଂଖ୍ୟା', description: 'Count 1–10 in Odia', color: '#1A5276',
    lessons: [
      {
        id: 'or-u3-l1', title: 'Numbers 1–5', titleNative: 'ଏକ ରୁ ପାଞ୍ଚ',
        exercises: [
          mc('or-u3-l1-e1', '"ଏକ" means?', ['Two', 'One', 'Three', 'Four'], 1, { promptScript: 'ଏକ', promptTranslit: 'eka' }),
          mc('or-u3-l1-e2', '"ତିନି" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptScript: 'ତିନି' }),
          mp('or-u3-l1-e3', 'Match numbers to Odia', [
            { left: '1', right: 'ଏକ' },
            { left: '2', right: 'ଦୁଇ' },
            { left: '3', right: 'ତିନି' },
            { left: '4', right: 'ଚାରି' },
          ]),
          fb('or-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Odia is ___ (transliteration: pancha)', 'pancha', 'ପାଞ୍ଚ — Five'),
        ],
      },
      {
        id: 'or-u3-l2', title: 'Numbers 6–10', titleNative: 'ଛଅ ରୁ ଦଶ',
        exercises: [
          mc('or-u3-l2-e1', '"ସାତ" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'ସାତ' }),
          mc('or-u3-l2-e2', '10 in Odia is?', ['ଆଠ', 'ନଅ', 'ଦଶ', 'ଏଗାର'], 2, { promptScript: 'ଦଶ' }),
          mp('or-u3-l2-e3', 'Match numbers to Odia', [
            { left: '6', right: 'ଛଅ' },
            { left: '7', right: 'ସାତ' },
            { left: '8', right: 'ଆଠ' },
            { left: '9', right: 'ନଅ' },
          ]),
          wo('or-u3-l2-e4', 'Arrange: "I have ten fingers"', 'Mora dasha angula achi'),
        ],
      },
    ],
  },
  {
    id: 'or-u4', title: 'Food & Daily Life', titleNative: 'ଖାଦ୍ୟ ଓ ଜୀବନ', description: 'Food and daily life in Odia', color: '#117A65',
    lessons: [
      {
        id: 'or-u4-l1', title: 'Food Essentials', titleNative: 'ଖାଦ୍ୟ',
        exercises: [
          mc('or-u4-l1-e1', '"ପାଣି" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'ପାଣି', promptTranslit: 'paani' }),
          mc('or-u4-l1-e2', 'Tea in Odia is?', ['ଦୁଧ', 'ଭାତ', 'ଚା', 'ରୁଟି'], 2, { promptScript: 'ଚା' }),
          mp('or-u4-l1-e3', 'Match Odia food words to English', [
            { left: 'ପାଣି', right: 'Water' },
            { left: 'ଦୁଧ', right: 'Milk' },
            { left: 'ଚା', right: 'Tea' },
            { left: 'ଭାତ', right: 'Rice' },
          ]),
          fb('or-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread in Odia is ___ (transliteration: ruti)', 'ruti', 'ରୁଟି — Flatbread'),
        ],
      },
      {
        id: 'or-u4-l2', title: 'Daily Phrases', titleNative: 'ଦୈନନ୍ଦିନ ଜୀବନ',
        exercises: [
          mc('or-u4-l2-e1', '"Mu bhata khauchi" means?', ['I drink water', 'I eat rice', 'I want tea', 'I sleep'], 1),
          mc('or-u4-l2-e2', '"Bhoka lagicha" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('or-u4-l2-e3', 'Arrange: "I want water"', 'Mora paani darkar'),
          mp('or-u4-l2-e4', 'Match Odia verbs to meanings', [
            { left: 'ଖାଇବା', right: 'To eat' },
            { left: 'ପିଇବା', right: 'To drink' },
            { left: 'ଶୋଇବା', right: 'To sleep' },
            { left: 'ଯିବା', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 11. ASSAMESE — অসমীয়া
// ══════════════════════════════════════════════════════════
const assameseCurriculum: Unit[] = [
  {
    id: 'as-u1', title: 'Assamese Script', titleNative: 'অসমীয়া লিপি', description: 'Learn the Assamese script', color: '#1A5276',
    lessons: [
      {
        id: 'as-u1-l1', title: 'Script Basics', titleNative: 'আধাৰ',
        exercises: [
          mc('as-u1-l1-e1', 'Assamese script is similar to which other script?', ['Devanagari', 'Bengali script', 'Gurmukhi', 'Tamil'], 1),
          mc('as-u1-l1-e2', '"অ" sounds like?', ['I', 'A', 'U', 'E'], 1, { promptScript: 'অ' }),
          mp('as-u1-l1-e3', 'Match Assamese letters to sounds', [
            { left: 'অ', right: 'A' },
            { left: 'ক', right: 'Ka' },
            { left: 'ম', right: 'Ma' },
            { left: 'ন', right: 'Na' },
          ]),
          fb('as-u1-l1-e4', 'Transliterate', 'The Assamese letter "ক" sounds like ___', 'ka', 'Same as Bengali ক'),
        ],
      },
      {
        id: 'as-u1-l2', title: 'Unique Features', titleNative: 'বিশেষত্ব',
        exercises: [
          mc('as-u1-l2-e1', 'Which unique feature does Assamese have?', ['Uses "ৱ" and "ৰ" not in Bengali', 'No vowels', 'Only 10 consonants', 'Uses Latin letters'], 0),
          mc('as-u1-l2-e2', 'Assamese is related most closely to?', ['Tamil', 'Bengali', 'Gujarati', 'Odia'], 1, { hint: 'Both use very similar scripts' }),
          mp('as-u1-l2-e3', 'Match Assamese vowels to sounds', [
            { left: 'অ', right: 'A' },
            { left: 'আ', right: 'AA' },
            { left: 'ই', right: 'I' },
            { left: 'উ', right: 'U' },
          ]),
          wo('as-u1-l2-e4', 'Spell: "Assam"', 'As sam'),
        ],
      },
    ],
  },
  {
    id: 'as-u2', title: 'Greetings & Phrases', titleNative: 'অভিবাদন', description: 'Say hello in Assamese', color: '#2980B9',
    lessons: [
      {
        id: 'as-u2-l1', title: 'Hello & Thanks', titleNative: 'নমস্কাৰ',
        exercises: [
          mc('as-u2-l1-e1', 'How do you say "Hello" in Assamese?', ['Namaskar', 'Dhanyabaad', 'Jai Ai', 'Thik'], 0, { promptScript: 'নমস্কাৰ', promptTranslit: 'Namaskar' }),
          mc('as-u2-l1-e2', '"Dhanyabaad" means?', ['Hello', 'Sorry', 'Thank you', 'Goodbye'], 2, { promptScript: 'ধন্যবাদ' }),
          mc('as-u2-l1-e3', '"Apuni kemon aasen?" means?', ['How are you?', 'What is your name?', 'Where are you from?', 'What time is it?'], 0),
          wo('as-u2-l1-e4', 'Arrange: "Hello, how are you?"', 'Namaskar apuni kemon aasen'),
        ],
      },
      {
        id: 'as-u2-l2', title: 'Basic Phrases', titleNative: 'সাধাৰণ বাক্য',
        exercises: [
          mc('as-u2-l2-e1', '"Mur naam ___" means?', ['My age is ___', 'My name is ___', 'My home is ___', 'My city is ___'], 1),
          mc('as-u2-l2-e2', '"Bhaal aasen" means?', ['I am late', 'I am fine', 'I am hungry', 'I am tired'], 1),
          fb('as-u2-l2-e3', 'Type the transliteration (romanized)', 'To say thank you in Assamese: ___ (transliteration: dhanyabaad)', 'dhanyabaad', 'ধন্যবাদ — ধ ন্য বা দ'),
          mp('as-u2-l2-e4', 'Match Assamese phrases to meanings', [
            { left: 'নমস্কাৰ', right: 'Hello' },
            { left: 'ধন্যবাদ', right: 'Thank you' },
            { left: 'ভাল থাকিব', right: 'Stay well' },
            { left: 'পিছত লগ পাম', right: 'See you later' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'as-u3', title: 'Numbers', titleNative: 'সংখ্যা', description: 'Count 1–10 in Assamese', color: '#76448A',
    lessons: [
      {
        id: 'as-u3-l1', title: 'Numbers 1–5', titleNative: 'এক ৰপৰা পাঁচ',
        exercises: [
          mc('as-u3-l1-e1', '"এক" means?', ['Two', 'One', 'Three', 'Four'], 1, { promptScript: 'এক', promptTranslit: 'ek' }),
          mc('as-u3-l1-e2', '"তিনি" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptScript: 'তিনি' }),
          mp('as-u3-l1-e3', 'Match numbers to Assamese', [
            { left: '1', right: 'এক' },
            { left: '2', right: 'দুই' },
            { left: '3', right: 'তিনি' },
            { left: '4', right: 'চাৰি' },
          ]),
          fb('as-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Assamese is ___ (transliteration: paanch)', 'paanch', 'পাঁচ — Five'),
        ],
      },
      {
        id: 'as-u3-l2', title: 'Numbers 6–10', titleNative: 'ছয় ৰপৰা দহ',
        exercises: [
          mc('as-u3-l2-e1', '"সাত" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'সাত' }),
          mc('as-u3-l2-e2', '10 in Assamese is?', ['আঠ', 'নয়', 'দহ', 'এঘাৰ'], 2, { promptScript: 'দহ' }),
          mp('as-u3-l2-e3', 'Match numbers to Assamese', [
            { left: '6', right: 'ছয়' },
            { left: '7', right: 'সাত' },
            { left: '8', right: 'আঠ' },
            { left: '9', right: 'নয়' },
          ]),
          wo('as-u3-l2-e4', 'Arrange: "I have five books"', 'Mur paanch khon boi aahe'),
        ],
      },
    ],
  },
  {
    id: 'as-u4', title: 'Food & Daily Life', titleNative: 'খাদ্য আৰু জীৱন', description: 'Food and daily life in Assamese', color: '#117A65',
    lessons: [
      {
        id: 'as-u4-l1', title: 'Food Essentials', titleNative: 'খাদ্য',
        exercises: [
          mc('as-u4-l1-e1', '"পানী" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'পানী', promptTranslit: 'paani' }),
          mc('as-u4-l1-e2', 'Tea in Assamese is?', ['গাখীৰ', 'ভাত', 'চাহ', 'ৰুটি'], 2, { promptScript: 'চাহ' }),
          mp('as-u4-l1-e3', 'Match Assamese food words to English', [
            { left: 'পানী', right: 'Water' },
            { left: 'গাখীৰ', right: 'Milk' },
            { left: 'চাহ', right: 'Tea' },
            { left: 'ভাত', right: 'Rice' },
          ]),
          fb('as-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread in Assamese is ___ (transliteration: ruti)', 'ruti', 'ৰুটি — Flatbread'),
        ],
      },
      {
        id: 'as-u4-l2', title: 'Daily Phrases', titleNative: 'দৈনন্দিন জীৱন',
        exercises: [
          mc('as-u4-l2-e1', '"Moi bhaat khaow" means?', ['I drink water', 'I eat rice', 'I want tea', 'I sleep'], 1),
          mc('as-u4-l2-e2', '"Bhok lagicha" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('as-u4-l2-e3', 'Arrange: "I drink tea in the morning"', 'Moi bhiyam chah khao'),
          mp('as-u4-l2-e4', 'Match Assamese verbs to meanings', [
            { left: 'খোৱা', right: 'To eat' },
            { left: 'পিয়া', right: 'To drink' },
            { left: 'শোৱা', right: 'To sleep' },
            { left: 'যোৱা', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 12. URDU — اردو
// ══════════════════════════════════════════════════════════
const urduCurriculum: Unit[] = [
  {
    id: 'ur-u1', title: 'Nastaliq Script', titleNative: 'نستعلیق', description: 'Learn Urdu Nastaliq script', color: '#148F77',
    lessons: [
      {
        id: 'ur-u1-l1', title: 'Script Basics', titleNative: 'بنیاد',
        exercises: [
          mc('ur-u1-l1-e1', 'Urdu uses which script?', ['Devanagari', 'Nastaliq (Perso-Arabic)', 'Gurmukhi', 'Latin'], 1),
          mc('ur-u1-l1-e2', 'Urdu is written from?', ['Left to right', 'Right to left', 'Up to down', 'Down to up'], 1),
          mp('ur-u1-l1-e3', 'Match Urdu letters to their names', [
            { left: 'ا', right: 'Alif (A)' },
            { left: 'ب', right: 'Be (B)' },
            { left: 'م', right: 'Meem (M)' },
            { left: 'ن', right: 'Noon (N)' },
          ]),
          fb('ur-u1-l1-e4', 'Transliterate', 'The Urdu letter "ا" (Alif) sounds like ___', 'a', 'First letter of Urdu alphabet'),
        ],
      },
      {
        id: 'ur-u1-l2', title: 'More Letters', titleNative: 'مزید حروف',
        exercises: [
          mc('ur-u1-l2-e1', '"ا" (Alif) sounds like?', ['B', 'A/Aa', 'T', 'S'], 1),
          mc('ur-u1-l2-e2', 'Urdu shares its script with?', ['Hindi', 'Bengali', 'Arabic and Persian', 'Tamil'], 2),
          mp('ur-u1-l2-e3', 'Match Urdu letters to sounds', [
            { left: 'پ', right: 'Pa' },
            { left: 'ت', right: 'Ta' },
            { left: 'س', right: 'Sa' },
            { left: 'ک', right: 'Ka' },
          ]),
          wo('ur-u1-l2-e4', 'Spell: "Urdu"', 'Ur du'),
        ],
      },
    ],
  },
  {
    id: 'ur-u2', title: 'Greetings & Phrases', titleNative: 'آداب', description: 'Say hello in Urdu', color: '#1ABC9C',
    lessons: [
      {
        id: 'ur-u2-l1', title: 'Hello & Thanks', titleNative: 'آداب',
        exercises: [
          mc('ur-u2-l1-e1', 'How do you say "Hello" in Urdu?', ['Adaab / As-salamu alaykum', 'Shukriya', 'Khuda Hafiz', 'Thik hai'], 0, { promptScript: 'آداب', promptTranslit: 'Adaab' }),
          mc('ur-u2-l1-e2', '"Shukriya" means?', ['Hello', 'Sorry', 'Thank you', 'Goodbye'], 2, { promptScript: 'شکریہ' }),
          mc('ur-u2-l1-e3', '"Aap kaisay hain?" means?', ['How are you? (formal)', 'What is your name?', 'Where are you going?', 'Good morning'], 0, { promptScript: 'آپ کیسے ہیں؟' }),
          wo('ur-u2-l1-e4', 'Arrange: "I am fine, thank you"', 'Main theek hoon shukriya'),
        ],
      },
      {
        id: 'ur-u2-l2', title: 'Basic Phrases', titleNative: 'سادہ جملے',
        exercises: [
          mc('ur-u2-l2-e1', '"Mera naam ___ hai" means?', ['My age is ___', 'My name is ___', 'My friend is ___', 'My home is ___'], 1),
          mc('ur-u2-l2-e2', '"Khuda Hafiz" means?', ['Hello', 'Thank you', 'Goodbye (God protect you)', 'Good morning'], 2, { hint: 'A traditional parting blessing' }),
          fb('ur-u2-l2-e3', 'Type the transliteration (romanized)', 'To say thank you in Urdu: ___ (transliteration: shukriya)', 'shukriya', 'شکریہ — ش + ک + ر + ی + ہ'),
          mp('ur-u2-l2-e4', 'Match Urdu phrases to meanings', [
            { left: 'آداب', right: 'Hello/Greetings' },
            { left: 'شکریہ', right: 'Thank you' },
            { left: 'خدا حافظ', right: 'Goodbye' },
            { left: 'معاف کرنا', right: 'Excuse me/Sorry' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'ur-u3', title: 'Numbers', titleNative: 'گنتی', description: 'Count 1–10 in Urdu', color: '#76448A',
    lessons: [
      {
        id: 'ur-u3-l1', title: 'Numbers 1–5', titleNative: 'ایک سے پانچ',
        exercises: [
          mc('ur-u3-l1-e1', '"ایک" means?', ['Two', 'One', 'Three', 'Four'], 1, { promptScript: 'ایک', promptTranslit: 'ek' }),
          mc('ur-u3-l1-e2', '"تین" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptScript: 'تین' }),
          mp('ur-u3-l1-e3', 'Match numbers to Urdu', [
            { left: '1', right: 'ایک' },
            { left: '2', right: 'دو' },
            { left: '3', right: 'تین' },
            { left: '4', right: 'چار' },
          ]),
          fb('ur-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Urdu is ___ (transliteration: paanch)', 'paanch', 'پانچ — Five'),
        ],
      },
      {
        id: 'ur-u3-l2', title: 'Numbers 6–10', titleNative: 'چھ سے دس',
        exercises: [
          mc('ur-u3-l2-e1', '"سات" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'سات' }),
          mc('ur-u3-l2-e2', '10 in Urdu is?', ['آٹھ', 'نو', 'دس', 'گیارہ'], 2, { promptScript: 'دس' }),
          mp('ur-u3-l2-e3', 'Match numbers to Urdu', [
            { left: '6', right: 'چھ' },
            { left: '7', right: 'سات' },
            { left: '8', right: 'آٹھ' },
            { left: '9', right: 'نو' },
          ]),
          wo('ur-u3-l2-e4', 'Arrange: "I have ten rupees"', 'Mere paas das rupaye hain'),
        ],
      },
    ],
  },
  {
    id: 'ur-u4', title: 'Food & Daily Life', titleNative: 'کھانا اور زندگی', description: 'Food and daily life in Urdu', color: '#117A65',
    lessons: [
      {
        id: 'ur-u4-l1', title: 'Food Essentials', titleNative: 'کھانا',
        exercises: [
          mc('ur-u4-l1-e1', '"پانی" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'پانی', promptTranslit: 'paani' }),
          mc('ur-u4-l1-e2', 'Tea in Urdu is?', ['دودھ', 'چاول', 'چائے', 'روٹی'], 2, { promptScript: 'چائے' }),
          mp('ur-u4-l1-e3', 'Match Urdu food words to English', [
            { left: 'پانی', right: 'Water' },
            { left: 'دودھ', right: 'Milk' },
            { left: 'چائے', right: 'Tea' },
            { left: 'چاول', right: 'Rice' },
          ]),
          fb('ur-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread in Urdu is ___ (transliteration: roti)', 'roti', 'روٹی — Flatbread'),
        ],
      },
      {
        id: 'ur-u4-l2', title: 'Daily Phrases', titleNative: 'روزمرہ کی زندگی',
        exercises: [
          mc('ur-u4-l2-e1', '"Main chawal khaata hoon" means?', ['I drink water', 'I eat rice', 'I want tea', 'I sleep'], 1),
          mc('ur-u4-l2-e2', '"Bhook lagi hai" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('ur-u4-l2-e3', 'Arrange: "I want water please"', 'Mujhe paani chahiye please'),
          mp('ur-u4-l2-e4', 'Match Urdu verbs to meanings', [
            { left: 'کھانا', right: 'To eat' },
            { left: 'پینا', right: 'To drink' },
            { left: 'سونا', right: 'To sleep' },
            { left: 'جانا', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 13. KASHMIRI — کٲشُر / कॉशुर
// ══════════════════════════════════════════════════════════
const kashmiriCurriculum: Unit[] = [
  {
    id: 'ks-u1', title: 'Kashmiri Script', titleNative: 'لیکھ', description: 'Nastaliq & Devanagari for Kashmiri', color: '#2471A3',
    lessons: [
      {
        id: 'ks-u1-l1', title: 'Script Basics', titleNative: 'آدار',
        exercises: [
          mc('ks-u1-l1-e1', 'In J&K, Kashmiri is officially written in?', ['Gurmukhi', 'Nastaliq (Perso-Arabic)', 'Bengali', 'Tamil'], 1),
          mc('ks-u1-l1-e2', 'Kashmiri can be written in which scripts?', ['Only Latin', 'Nastaliq and Devanagari', 'Only Gurmukhi', 'Only Odia'], 1),
          mp('ks-u1-l1-e3', 'Match script facts about Kashmiri', [
            { left: 'Nastaliq', right: 'Right to left' },
            { left: 'Devanagari', right: 'Left to right' },
            { left: 'Kashmiri vowels', right: 'Checked vowel system' },
            { left: 'Script origin', right: 'Perso-Arabic' },
          ]),
          fb('ks-u1-l1-e4', 'Fill in', 'The word "Kashmir" etymologically comes from Sanskrit "___ -mira"', 'Kashyapa', 'Named after sage Kashyapa'),
        ],
      },
      {
        id: 'ks-u1-l2', title: 'Key Letters', titleNative: 'حروف',
        exercises: [
          mc('ks-u1-l2-e1', 'Kashmiri has a unique sound called?', ['Retroflex nasal', 'Pharyngeal vowel', 'Checked vowel', 'Uvular stop'], 2, { hint: 'Kashmiri is known for its distinctive vowel system' }),
          mc('ks-u1-l2-e2', 'Kashmiri is primarily spoken in?', ['Rajasthan', 'Kashmir Valley', 'Punjab', 'Himachal'], 1),
          mp('ks-u1-l2-e3', 'Match Kashmiri vocabulary facts', [
            { left: 'Spoken in', right: 'Kashmir Valley' },
            { left: 'Family', right: 'Indo-Aryan' },
            { left: 'Speakers', right: '~7 million' },
            { left: 'Official status', right: 'Scheduled language of India' },
          ]),
          wo('ks-u1-l2-e4', 'Spell: "Kashmir"', 'Kash mir'),
        ],
      },
    ],
  },
  {
    id: 'ks-u2', title: 'Greetings & Phrases', titleNative: 'سلام', description: 'Say hello in Kashmiri', color: '#3498DB',
    lessons: [
      {
        id: 'ks-u2-l1', title: 'Hello & Thanks', titleNative: 'آداب',
        exercises: [
          mc('ks-u2-l1-e1', 'How do you say "Hello" in Kashmiri?', ['Adaab / As-salamu alaykum', 'Shukriya', 'Khuda Hafiz', 'Thik'], 0, { promptTranslit: 'Adaab', hint: 'Kashmiri shares many greeting phrases with Urdu' }),
          mc('ks-u2-l1-e2', '"Shukriya" in Kashmiri means?', ['Hello', 'Sorry', 'Thank you', 'Goodbye'], 2),
          mc('ks-u2-l1-e3', '"Kyazi cha?" means?', ['What is your name?', 'How are you?', 'Where are you from?', 'How old are you?'], 1, { promptTranslit: 'Kyazi cha?' }),
          wo('ks-u2-l1-e4', 'Arrange: "I am well, thank you"', 'Me chu theek shukriya'),
        ],
      },
      {
        id: 'ks-u2-l2', title: 'Basic Phrases', titleNative: 'آسان جملے',
        exercises: [
          mc('ks-u2-l2-e1', '"Myon naam ___ chu" means?', ['My age is ___', 'My name is ___', 'My home is ___', 'My friend is ___'], 1),
          mc('ks-u2-l2-e2', '"Khuda Hafiz" in Kashmiri means?', ['Hello', 'Thank you', 'Goodbye', 'Good morning'], 2),
          fb('ks-u2-l2-e3', 'Type the transliteration (romanized)', 'To say "How are you?" in Kashmiri: ___ cha? (transliteration: kyazi)', 'kyazi', 'کیازی — Question word'),
          mp('ks-u2-l2-e4', 'Match Kashmiri phrases to meanings', [
            { left: 'آداب', right: 'Hello' },
            { left: 'شکریہ', right: 'Thank you' },
            { left: 'خدا حافظ', right: 'Goodbye' },
            { left: 'کیازی چھا؟', right: 'How are you?' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'ks-u3', title: 'Numbers', titleNative: 'ہندسے', description: 'Count 1–10 in Kashmiri', color: '#76448A',
    lessons: [
      {
        id: 'ks-u3-l1', title: 'Numbers 1–5', titleNative: 'اکھ سے پانژ',
        exercises: [
          mc('ks-u3-l1-e1', '"اکھ" means?', ['Two', 'One', 'Three', 'Four'], 1, { promptScript: 'اکھ', promptTranslit: 'akha' }),
          mc('ks-u3-l1-e2', '"تر۪" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptTranslit: 'tre' }),
          mp('ks-u3-l1-e3', 'Match numbers to Kashmiri', [
            { left: '1', right: 'اکھ' },
            { left: '2', right: 'زٮ۪' },
            { left: '3', right: 'تر۪' },
            { left: '4', right: 'ژور' },
          ]),
          fb('ks-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Kashmiri is ___ (transliteration: paanz)', 'paanz', 'پانژ — Five'),
        ],
      },
      {
        id: 'ks-u3-l2', title: 'Numbers 6–10', titleNative: 'شے سے دَہ',
        exercises: [
          mc('ks-u3-l2-e1', '"ساتھ" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptTranslit: 'saath' }),
          mc('ks-u3-l2-e2', '10 in Kashmiri is?', ['اٹھ', 'نوٜ', 'دَہ', 'کانہ'], 2, { promptTranslit: 'dah' }),
          mp('ks-u3-l2-e3', 'Match numbers to Kashmiri', [
            { left: '6', right: 'شے' },
            { left: '7', right: 'ساتھ' },
            { left: '8', right: 'اٹھ' },
            { left: '9', right: 'نوٜ' },
          ]),
          wo('ks-u3-l2-e4', 'Arrange: "I have ten walnuts"', 'Myon paas dah von chi'),
        ],
      },
    ],
  },
  {
    id: 'ks-u4', title: 'Food & Daily Life', titleNative: 'کھانا تے زندگی', description: 'Food and daily life in Kashmiri', color: '#117A65',
    lessons: [
      {
        id: 'ks-u4-l1', title: 'Food Essentials', titleNative: 'کھانا',
        exercises: [
          mc('ks-u4-l1-e1', '"پانۍ" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'پانۍ', promptTranslit: 'paanyi' }),
          mc('ks-u4-l1-e2', 'Tea in Kashmiri is?', ['دۄدھ', 'برنٛز', 'چائے', 'کانہِ'], 2, { promptScript: 'چائے' }),
          mp('ks-u4-l1-e3', 'Match Kashmiri food words to English', [
            { left: 'پانۍ', right: 'Water' },
            { left: 'دۄدھ', right: 'Milk' },
            { left: 'چائے', right: 'Tea' },
            { left: 'برنٛز', right: 'Rice' },
          ]),
          fb('ks-u4-l1-e4', 'Type the transliteration (romanized)', 'Kashmiri bread (flatbread) is called ___ (transliteration: kaanh)', 'kaanh', 'کانہِ — Traditional Kashmiri bread'),
        ],
      },
      {
        id: 'ks-u4-l2', title: 'Daily Phrases', titleNative: 'روزانہ زندگی',
        exercises: [
          mc('ks-u4-l2-e1', '"Bae baath khyim" means?', ['I drink water', 'I ate rice', 'I want tea', 'I sleep'], 1),
          mc('ks-u4-l2-e2', '"Zan chu" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am cold'], 2, { hint: 'Kashmiri has words for being hungry' }),
          wo('ks-u4-l2-e3', 'Arrange: "I want water"', 'Bae paanyi rovaan chhe'),
          mp('ks-u4-l2-e4', 'Match Kashmiri verbs to meanings', [
            { left: 'کھییُن', right: 'To eat' },
            { left: 'پیُن', right: 'To drink' },
            { left: 'سۄنُن', right: 'To sleep' },
            { left: 'گژھُن', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 14. NEPALI — नेपाली
// ══════════════════════════════════════════════════════════
const nepaliCurriculum: Unit[] = [
  {
    id: 'ne-u1', title: 'Nepali Script', titleNative: 'लिपि', description: 'Devanagari for Nepali', color: '#C0392B',
    lessons: [
      {
        id: 'ne-u1-l1', title: 'Script Basics', titleNative: 'आधार',
        exercises: [
          mc('ne-u1-l1-e1', 'Nepali uses which script?', ['Gurmukhi', 'Devanagari', 'Bengali', 'Odia'], 1),
          mc('ne-u1-l1-e2', '"अ" in Nepali sounds like?', ['I', 'A', 'U', 'O'], 1, { promptScript: 'अ' }),
          mp('ne-u1-l1-e3', 'Match Nepali letters to sounds', [
            { left: 'अ', right: 'A' },
            { left: 'क', right: 'Ka' },
            { left: 'म', right: 'Ma' },
            { left: 'न', right: 'Na' },
          ]),
          fb('ne-u1-l1-e4', 'Transliterate', 'The Nepali letter "क" sounds like ___', 'ka', 'Same as Hindi क'),
        ],
      },
      {
        id: 'ne-u1-l2', title: 'Script Features', titleNative: 'विशेषता',
        exercises: [
          mc('ne-u1-l2-e1', 'Nepali and Hindi scripts look the same but pronunciations differ — True?', ['False, they are identical', 'True, some sounds differ', 'False, totally different script', 'True, completely different language'], 1),
          mc('ne-u1-l2-e2', 'Nepali script shares its system with?', ['Tamil', 'Bengali', 'Hindi', 'Gujarati'], 2, { hint: 'Both use Devanagari' }),
          mp('ne-u1-l2-e3', 'Match Nepali vowels to sounds', [
            { left: 'अ', right: 'A' },
            { left: 'आ', right: 'AA' },
            { left: 'इ', right: 'I' },
            { left: 'उ', right: 'U' },
          ]),
          wo('ne-u1-l2-e4', 'Spell: "Nepal"', 'Ne pal'),
        ],
      },
    ],
  },
  {
    id: 'ne-u2', title: 'Greetings & Phrases', titleNative: 'अभिवादन', description: 'Say hello in Nepali', color: '#E74C3C',
    lessons: [
      {
        id: 'ne-u2-l1', title: 'Hello & Thanks', titleNative: 'नमस्ते',
        exercises: [
          mc('ne-u2-l1-e1', 'How do you say "Hello" in Nepali?', ['Namaste', 'Dhanyabad', 'Bhetaula', 'Thik cha'], 0, { promptScript: 'नमस्ते', promptTranslit: 'Namaste' }),
          mc('ne-u2-l1-e2', '"Dhanyabad" means?', ['Hello', 'Sorry', 'Thank you', 'Goodbye'], 2, { promptScript: 'धन्यवाद' }),
          mc('ne-u2-l1-e3', '"Tapai kasto hunuhuncha?" means?', ['How are you? (formal)', 'What is your name?', 'Where are you going?', 'Where are you from?'], 0),
          wo('ne-u2-l1-e4', 'Arrange: "Hello, how are you?"', 'Namaste tapai kasto hunuhuncha'),
        ],
      },
      {
        id: 'ne-u2-l2', title: 'Basic Phrases', titleNative: 'सामान्य वाक्य',
        exercises: [
          mc('ne-u2-l2-e1', '"Mero naam ___ ho" means?', ['My age is ___', 'My name is ___', 'My home is ___', 'My city is ___'], 1),
          mc('ne-u2-l2-e2', '"Thik cha" means?', ['I am late', 'It is OK / I am fine', 'I am hungry', 'I am going'], 1),
          fb('ne-u2-l2-e3', 'Type the transliteration (romanized)', 'To say thank you in Nepali: ___ (transliteration: dhanyabad)', 'dhanyabad', 'धन्यवाद — ध + न्य + वा + द'),
          mp('ne-u2-l2-e4', 'Match Nepali phrases to meanings', [
            { left: 'नमस्ते', right: 'Hello' },
            { left: 'धन्यवाद', right: 'Thank you' },
            { left: 'ठिक छ', right: 'It\'s okay' },
            { left: 'फेरि भेटौँला', right: 'See you again' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'ne-u3', title: 'Numbers', titleNative: 'सङ्ख्या', description: 'Count 1–10 in Nepali', color: '#76448A',
    lessons: [
      {
        id: 'ne-u3-l1', title: 'Numbers 1–5', titleNative: 'एक देखि पाँच',
        exercises: [
          mc('ne-u3-l1-e1', '"एक" means?', ['Two', 'One', 'Three', 'Four'], 1, { promptScript: 'एक', promptTranslit: 'ek' }),
          mc('ne-u3-l1-e2', '"तीन" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptScript: 'तीन' }),
          mp('ne-u3-l1-e3', 'Match numbers to Nepali', [
            { left: '1', right: 'एक' },
            { left: '2', right: 'दुई' },
            { left: '3', right: 'तीन' },
            { left: '4', right: 'चार' },
          ]),
          fb('ne-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Nepali is ___ (transliteration: paanch)', 'paanch', 'पाँच — Five'),
        ],
      },
      {
        id: 'ne-u3-l2', title: 'Numbers 6–10', titleNative: 'छ देखि दस',
        exercises: [
          mc('ne-u3-l2-e1', '"सात" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptScript: 'सात' }),
          mc('ne-u3-l2-e2', '10 in Nepali is?', ['आठ', 'नौ', 'दस', 'एघार'], 2, { promptScript: 'दस' }),
          mp('ne-u3-l2-e3', 'Match numbers to Nepali', [
            { left: '6', right: 'छ' },
            { left: '7', right: 'सात' },
            { left: '8', right: 'आठ' },
            { left: '9', right: 'नौ' },
          ]),
          wo('ne-u3-l2-e4', 'Arrange: "I have five fingers"', 'Mero paanch aula cha'),
        ],
      },
    ],
  },
  {
    id: 'ne-u4', title: 'Food & Daily Life', titleNative: 'खाना र जीवन', description: 'Food and daily life in Nepali', color: '#117A65',
    lessons: [
      {
        id: 'ne-u4-l1', title: 'Food Essentials', titleNative: 'खाना',
        exercises: [
          mc('ne-u4-l1-e1', '"पानी" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'पानी', promptTranslit: 'paani' }),
          mc('ne-u4-l1-e2', 'Tea in Nepali is?', ['दूध', 'भात', 'चिया', 'रोटी'], 2, { promptScript: 'चिया' }),
          mp('ne-u4-l1-e3', 'Match Nepali food words to English', [
            { left: 'पानी', right: 'Water' },
            { left: 'दूध', right: 'Milk' },
            { left: 'चिया', right: 'Tea' },
            { left: 'भात', right: 'Rice' },
          ]),
          fb('ne-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread in Nepali is ___ (transliteration: roti)', 'roti', 'रोटी — Flatbread'),
        ],
      },
      {
        id: 'ne-u4-l2', title: 'Daily Phrases', titleNative: 'दैनिक जीवन',
        exercises: [
          mc('ne-u4-l2-e1', '"Ma bhat khanchhu" means?', ['I drink water', 'I eat rice', 'I want tea', 'I sleep'], 1),
          mc('ne-u4-l2-e2', '"Bhok laagyo" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('ne-u4-l2-e3', 'Arrange: "I want water"', 'Malai paani chahiyo'),
          mp('ne-u4-l2-e4', 'Match Nepali verbs to meanings', [
            { left: 'खानु', right: 'To eat' },
            { left: 'पिउनु', right: 'To drink' },
            { left: 'सुत्नु', right: 'To sleep' },
            { left: 'जानु', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
// 15. SINDHI — سنڌي / सिन्धी
// ══════════════════════════════════════════════════════════
const sindhiCurriculum: Unit[] = [
  {
    id: 'sd-u1', title: 'Sindhi Script', titleNative: 'لکت', description: 'Scripts used for Sindhi', color: '#D35400',
    lessons: [
      {
        id: 'sd-u1-l1', title: 'Script Intro', titleNative: 'تعارف',
        exercises: [
          mc('sd-u1-l1-e1', 'Sindhi in Pakistan is written in?', ['Devanagari', 'Perso-Arabic (Khudabadi)', 'Gurmukhi', 'Latin'], 1),
          mc('sd-u1-l1-e2', 'Sindhi is unique because?', ['It has no script', 'It uses two official scripts in India alone', 'It only uses Latin', 'It is a tonal language'], 1),
          mp('sd-u1-l1-e3', 'Match Sindhi script facts', [
            { left: 'In Pakistan', right: 'Perso-Arabic script' },
            { left: 'In India (official)', right: 'Devanagari' },
            { left: 'Perso-Arabic letters', right: '52 characters' },
            { left: 'Script direction', right: 'Right to left' },
          ]),
          fb('sd-u1-l1-e4', 'Fill in', 'The Sindhi Perso-Arabic script has ___ letters (more than standard Arabic)', '52', 'Extra letters for unique Sindhi sounds'),
        ],
      },
      {
        id: 'sd-u1-l2', title: 'Key Letters', titleNative: 'حروف',
        exercises: [
          mc('sd-u1-l2-e1', 'The Sindhi Perso-Arabic script has how many letters?', ['28', '36', '52', '26'], 2, { hint: 'More than standard Arabic due to unique Sindhi sounds' }),
          mc('sd-u1-l2-e2', 'Sindhi belongs to which language family?', ['Dravidian', 'Sino-Tibetan', 'Indo-Aryan', 'Austroasiatic'], 2),
          mp('sd-u1-l2-e3', 'Match Sindhi pronunciation facts', [
            { left: 'ھ (implosive)', right: 'Unique to Sindhi/Punjabi' },
            { left: 'ڊ (implosive D)', right: 'Retroflex implosive' },
            { left: 'ڳ (implosive G)', right: 'Very rare sound globally' },
            { left: 'ٻ (implosive B)', right: 'Found in few world languages' },
          ]),
          wo('sd-u1-l2-e4', 'Spell: "Sindhi"', 'Sin dhi'),
        ],
      },
    ],
  },
  {
    id: 'sd-u2', title: 'Greetings & Phrases', titleNative: 'سلام', description: 'Say hello in Sindhi', color: '#E67E22',
    lessons: [
      {
        id: 'sd-u2-l1', title: 'Hello & Thanks', titleNative: 'جي آيا',
        exercises: [
          mc('sd-u2-l1-e1', 'Common Sindhi greeting?', ['Salaam Alaikum / Jai Sindh', 'Namaste', 'Vanakkam', 'Namaskar'], 0, { promptTranslit: 'Salaam Alaikum', hint: 'Sindhi communities use both Islamic and regional greetings' }),
          mc('sd-u2-l1-e2', '"Meherbani" in Sindhi means?', ['Hello', 'Sorry', 'Thank you / Kindness', 'Goodbye'], 2, { promptTranslit: 'Meherbani' }),
          mc('sd-u2-l1-e3', '"Tho keaan aahin?" means?', ['How are you?', 'What is your name?', 'Where are you going?', 'Good morning'], 0),
          wo('sd-u2-l1-e4', 'Arrange: "I am fine, thank you"', 'Maan theek aahin meherbani'),
        ],
      },
      {
        id: 'sd-u2-l2', title: 'Basic Phrases', titleNative: 'بنيادي جملا',
        exercises: [
          mc('sd-u2-l2-e1', '"Mhjo naalo ___ aahe" means?', ['My age is ___', 'My name is ___', 'My home is ___', 'My friend is ___'], 1),
          mc('sd-u2-l2-e2', 'In India, Sindhi is officially written in?', ['Perso-Arabic script', 'Devanagari', 'Both A and B', 'Gurmukhi'], 2),
          fb('sd-u2-l2-e3', 'Type the transliteration (romanized)', 'To say thank you in Sindhi: ___ (transliteration: meherbani)', 'meherbani', 'مهرباني — م + ه + ر + ب + ا + ن + ي'),
          mp('sd-u2-l2-e4', 'Match Sindhi phrases to meanings', [
            { left: 'سلام عليڪم', right: 'Hello/Peace be upon you' },
            { left: 'مهرباني', right: 'Thank you' },
            { left: 'خدا حافظ', right: 'Goodbye' },
            { left: 'ٺيڪ آهين', right: 'I am fine' },
          ]),
        ],
      },
    ],
  },
  {
    id: 'sd-u3', title: 'Numbers', titleNative: 'انگ', description: 'Count 1–10 in Sindhi', color: '#76448A',
    lessons: [
      {
        id: 'sd-u3-l1', title: 'Numbers 1–5', titleNative: 'ھڪ کان پنج',
        exercises: [
          mc('sd-u3-l1-e1', '"ھڪ" means?', ['Two', 'One', 'Three', 'Four'], 1, { promptScript: 'ھڪ', promptTranslit: 'hikka' }),
          mc('sd-u3-l1-e2', '"ٽي" means?', ['Two', 'Three', 'Four', 'Five'], 1, { promptTranslit: 'tee' }),
          mp('sd-u3-l1-e3', 'Match numbers to Sindhi', [
            { left: '1', right: 'ھڪ' },
            { left: '2', right: 'ٻه' },
            { left: '3', right: 'ٽي' },
            { left: '4', right: 'چار' },
          ]),
          fb('sd-u3-l1-e4', 'Type the transliteration (romanized)', '5 in Sindhi is ___ (transliteration: panj)', 'panj', 'پنج — Five'),
        ],
      },
      {
        id: 'sd-u3-l2', title: 'Numbers 6–10', titleNative: 'ڇهه کان ڏهه',
        exercises: [
          mc('sd-u3-l2-e1', '"ست" means?', ['Six', 'Seven', 'Eight', 'Nine'], 1, { promptTranslit: 'sat' }),
          mc('sd-u3-l2-e2', '10 in Sindhi is?', ['اٺ', 'نوَ', 'ڏھ', 'يارھ'], 2, { promptTranslit: 'daha' }),
          mp('sd-u3-l2-e3', 'Match numbers to Sindhi', [
            { left: '6', right: 'ڇهه' },
            { left: '7', right: 'ست' },
            { left: '8', right: 'اٺ' },
            { left: '9', right: 'نوَ' },
          ]),
          wo('sd-u3-l2-e4', 'Arrange: "I have five rupees"', 'Maan khe panj rupiya aahyan'),
        ],
      },
    ],
  },
  {
    id: 'sd-u4', title: 'Food & Daily Life', titleNative: 'کاڌو ۽ زندگي', description: 'Food and daily life in Sindhi', color: '#117A65',
    lessons: [
      {
        id: 'sd-u4-l1', title: 'Food Essentials', titleNative: 'کاڌو',
        exercises: [
          mc('sd-u4-l1-e1', '"پاڻي" means?', ['Milk', 'Tea', 'Water', 'Rice'], 2, { promptScript: 'پاڻي', promptTranslit: 'paani' }),
          mc('sd-u4-l1-e2', 'Tea in Sindhi is?', ['کير', 'چانورُ', 'چانهه', 'ماني'], 2, { promptScript: 'چانهه' }),
          mp('sd-u4-l1-e3', 'Match Sindhi food words to English', [
            { left: 'پاڻي', right: 'Water' },
            { left: 'کير', right: 'Milk' },
            { left: 'چانهه', right: 'Tea' },
            { left: 'چانورُ', right: 'Rice' },
          ]),
          fb('sd-u4-l1-e4', 'Type the transliteration (romanized)', 'Bread in Sindhi is ___ (transliteration: maani)', 'maani', 'ماني — Traditional Sindhi bread'),
        ],
      },
      {
        id: 'sd-u4-l2', title: 'Daily Phrases', titleNative: 'روزاني زندگي',
        exercises: [
          mc('sd-u4-l2-e1', '"Maan chaanvar khaan-dusaan" means?', ['I drink water', 'I eat rice', 'I want tea', 'I sleep'], 1),
          mc('sd-u4-l2-e2', '"Bhukh aa" means?', ['I am thirsty', 'I am full', 'I am hungry', 'I am tired'], 2),
          wo('sd-u4-l2-e3', 'Arrange: "I want water"', 'Maan khe paani khappe'),
          mp('sd-u4-l2-e4', 'Match Sindhi verbs to meanings', [
            { left: 'کائڻ', right: 'To eat' },
            { left: 'پيئڻ', right: 'To drink' },
            { left: 'سمهڻ', right: 'To sleep' },
            { left: 'وڃڻ', right: 'To go' },
          ]),
        ],
      },
    ],
  },
];

// ──────────────────────────────────────────────────────────
// LANGUAGE DEFINITIONS
// ──────────────────────────────────────────────────────────
export const LANGUAGES: Language[] = [
  { id: 'hi', name: 'Hindi', nativeName: 'हिंदी', flagEmoji: '🇮🇳', scriptName: 'Devanagari', colorHex: '#E16735', available: true, curriculum: hindiCurriculum },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी', flagEmoji: '🏛️', scriptName: 'Devanagari', colorHex: '#F5922F', available: true, curriculum: marathiCurriculum },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', flagEmoji: '🎨', scriptName: 'Bengali Script', colorHex: '#2ECC71', available: true, curriculum: bengaliCurriculum },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flagEmoji: '🌺', scriptName: 'Tamil Script', colorHex: '#E74C3C', available: true, curriculum: tamilCurriculum },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', flagEmoji: '⭐', scriptName: 'Telugu Script', colorHex: '#F39C12', available: true, curriculum: teluguCurriculum },
  { id: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flagEmoji: '🦁', scriptName: 'Gujarati Script', colorHex: '#9B59B6', available: true, curriculum: gujaratiCurriculum },
  { id: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flagEmoji: '🌾', scriptName: 'Gurmukhi', colorHex: '#27AE60', available: true, curriculum: punjabiCurriculum },
  { id: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flagEmoji: '🐘', scriptName: 'Kannada Script', colorHex: '#E67E22', available: true, curriculum: kannadaCurriculum },
  { id: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flagEmoji: '🌴', scriptName: 'Malayalam Script', colorHex: '#16A085', available: true, curriculum: malayalamCurriculum },
  { id: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flagEmoji: '🌊', scriptName: 'Odia Script', colorHex: '#8E44AD', available: true, curriculum: odiaCurriculum },
  { id: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flagEmoji: '🦏', scriptName: 'Assamese Script', colorHex: '#2980B9', available: true, curriculum: assameseCurriculum },
  { id: 'ur', name: 'Urdu', nativeName: 'اردو', flagEmoji: '✨', scriptName: 'Nastaliq', colorHex: '#1ABC9C', available: true, curriculum: urduCurriculum },
  { id: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर', flagEmoji: '🏔️', scriptName: 'Nastaliq / Devanagari', colorHex: '#3498DB', available: true, curriculum: kashmiriCurriculum },
  { id: 'ne', name: 'Nepali', nativeName: 'नेपाली', flagEmoji: '🏔️', scriptName: 'Devanagari', colorHex: '#E74C3C', available: true, curriculum: nepaliCurriculum },
  { id: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flagEmoji: '🏺', scriptName: 'Perso-Arabic / Devanagari', colorHex: '#E67E22', available: true, curriculum: sindhiCurriculum },
];

// ──────────────────────────────────────────────────────────
// LOOKUP HELPERS
// ──────────────────────────────────────────────────────────
export function getLanguageById(id: string): Language | undefined {
  return LANGUAGES.find(l => l.id === id);
}

export function getLessonById(languageId: string, lessonId: string) {
  const lang = getLanguageById(languageId);
  if (!lang) return null;
  for (const unit of lang.curriculum) {
    const lesson = unit.lessons.find(l => l.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
}
