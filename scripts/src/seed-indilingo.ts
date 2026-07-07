import { db } from "@workspace/db";
import {
  languagesTable,
  unitsTable,
  lessonsTable,
  exercisesTable,
  usersTable,
} from "@workspace/db";

type ExerciseType = "script_practice" | "multiple_choice" | "translate" | "fill_blank" | "match_pairs";

  interface ExerciseSeed {
    type: ExerciseType;
    question: string;
    correctAnswer: string;
    options: string[];
    nativeScript?: string;
    romanization?: string;
    videoUrl?: string;
  }
  type: ExerciseType;
  question: string;
  correctAnswer: string;
  options: string[];
  nativeScript?: string;
  romanization?: string;
}

interface LessonSeed {
  title: string;
  xpReward: number;
  exercises: ExerciseSeed[];
}

interface UnitSeed {
  title: string;
  description: string;
  unitType: "script" | "vocabulary" | "phrases" | "conversation";
  lessons: LessonSeed[];
}

interface LanguageSeed {
  name: string;
  nativeName: string;
  flagEmoji: string;
  scriptName: string;
  colorHex: string;
  units: UnitSeed[];
}

function mc(q: string, correct: string, wrong: string[]): ExerciseSeed {
  return { type: "multiple_choice", question: q, correctAnswer: correct, options: [correct, ...wrong].sort(() => Math.random() - 0.5) };
}

function trans(q: string, correct: string, wrong: string[]): ExerciseSeed {
  return { type: "translate", question: q, correctAnswer: correct, options: [correct, ...wrong].sort(() => Math.random() - 0.5) };
}

function fill(q: string, correct: string, wrong: string[]): ExerciseSeed {
  return { type: "fill_blank", question: q, correctAnswer: correct, options: [correct, ...wrong].sort(() => Math.random() - 0.5) };
}

function script(native: string, roman: string, wrongRoman: string[]): ExerciseSeed {
  return {
    type: "script_practice",
    question: `What is the romanization of this character?`,
    correctAnswer: roman,
    options: [roman, ...wrongRoman].sort(() => Math.random() - 0.5),
    nativeScript: native,
    romanization: roman,
  };
}

function matchPairs(question: string, left: string[], right: string[]): ExerciseSeed {
  if (left.length !== right.length) {
    throw new Error("matchPairs requires equal-length left and right columns");
  }
  return {
    type: "match_pairs",
    question,
    options: [...left, ...right],
    correctAnswer: JSON.stringify(left.map((item, index) => [item, right[index]])),
  };
}

const LANGUAGES: LanguageSeed[] = [
  {
    name: "Hindi",
    nativeName: "हिन्दी",
    flagEmoji: "🇮🇳",
    scriptName: "Devanagari",
    colorHex: "#FF6B35",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn to read Devanagari — the script of Hindi",
        unitType: "script",
        lessons: [
          {
            title: "Vowels Part 1",
            xpReward: 15,
            exercises: [
              script("अ", "a", ["i", "u", "e"]),
              script("आ", "aa", ["a", "i", "u"]),
              script("इ", "i", ["a", "aa", "u"]),
              script("ई", "ii", ["i", "a", "e"]),
              script("उ", "u", ["a", "i", "o"]),
              script("ऊ", "uu", ["u", "a", "i"]),
            ],
          },
          {
            title: "Vowels Part 2",
            xpReward: 15,
            exercises: [
              script("ए", "e", ["a", "i", "o"]),
              script("ऐ", "ai", ["e", "a", "o"]),
              script("ओ", "o", ["u", "e", "a"]),
              script("औ", "au", ["o", "u", "a"]),
              script("अं", "an", ["a", "in", "un"]),
              script("अः", "ah", ["a", "an", "ih"]),
            ],
          },
          {
            title: "Consonants — क to च",
            xpReward: 15,
            exercises: [
              script("क", "ka", ["ga", "kha", "ta"]),
              script("ख", "kha", ["ka", "ga", "cha"]),
              script("ग", "ga", ["ka", "gha", "da"]),
              script("घ", "gha", ["ga", "kha", "dha"]),
              script("च", "cha", ["ja", "ka", "sha"]),
            ],
          },
          {
            title: "Consonants — ट to ण",
            xpReward: 15,
            exercises: [
              script("ट", "ta", ["da", "tha", "na"]),
              script("ड", "da", ["ta", "dha", "ba"]),
              script("त", "ta", ["da", "tha", "na"]),
              script("द", "da", ["ta", "dha", "ba"]),
              script("न", "na", ["ma", "la", "ra"]),
            ],
          },
          {
            title: "Consonants — प to म",
            xpReward: 15,
            exercises: [
              script("प", "pa", ["ba", "pha", "ma"]),
              script("ब", "ba", ["pa", "bha", "da"]),
              script("म", "ma", ["na", "pa", "ra"]),
              script("य", "ya", ["ra", "la", "va"]),
              script("र", "ra", ["la", "ya", "na"]),
            ],
          },
          {
            title: "Consonants — ल to ह",
            xpReward: 15,
            exercises: [
              script("ल", "la", ["ra", "va", "na"]),
              script("व", "va", ["ba", "la", "ya"]),
              script("श", "sha", ["sa", "ha", "cha"]),
              script("ष", "sha", ["sa", "sha", "ha"]),
              script("स", "sa", ["sha", "ha", "cha"]),
              script("ह", "ha", ["sa", "sha", "ra"]),
            ],
          },
        ],
      },
      {
        title: "Greetings & Phrases",
        description: "Essential greetings in Hindi",
        unitType: "phrases",
        lessons: [
          {
            title: "Namaskar",
            xpReward: 10,
            exercises: [
              mc("What does नमस्ते (Namaste) mean?", "Hello / Greetings", ["Goodbye", "Thank you", "Sorry"]),
              trans("How do you say 'Thank you' in Hindi?", "धन्यवाद (Dhanyavaad)", ["माफ़ करना", "नमस्ते", "शुभ रात्रि"]),
              fill("मेरा नाम ___ है। (My name is ___)", "राज (Raj)", ["सूरज", "कमल", "नदी"]),
              mc("What does 'शुभ प्रभात' mean?", "Good morning", ["Good night", "Good evening", "See you"]),
            ],
          },
          {
            title: "Basic Conversation",
            xpReward: 10,
            exercises: [
              mc("How do you ask 'How are you?' in Hindi?", "आप कैसे हैं?", ["आप कहाँ हैं?", "आपका नाम क्या है?", "क्या हाल है?"]),
              trans("Translate: 'I am fine'", "मैं ठीक हूँ", ["मैं यहाँ हूँ", "मैं जाता हूँ", "मुझे भूख है"]),
            ],
          },
        ],
      },
      {
        title: "Numbers",
        description: "Count in Hindi",
        unitType: "vocabulary",
        lessons: [
          {
            title: "1 to 10",
            xpReward: 10,
            exercises: [
              mc("What is 'एक' in numbers?", "1", ["2", "3", "5"]),
              mc("What is 'पाँच' in numbers?", "5", ["3", "7", "10"]),
              mc("What is 'दस' in numbers?", "10", ["8", "6", "4"]),
              fill("___ + दो = तीन", "एक", ["दो", "चार", "पाँच"]),
              matchPairs("Match Hindi numbers to digits", ["1", "2", "3", "5"], ["एक", "दो", "तीन", "पाँच"]),
            ],
          },
        ],
      },
      {
        title: "Food & Daily Life",
        description: "Common words in everyday Hindi",
        unitType: "vocabulary",
        lessons: [
          {
            title: "Food Words",
            xpReward: 10,
            exercises: [
              mc("What is 'रोटी'?", "Bread / Flatbread", ["Rice", "Water", "Milk"]),
              mc("What is 'पानी'?", "Water", ["Milk", "Tea", "Bread"]),
              trans("Translate: 'I am hungry'", "मुझे भूख है", ["मुझे प्यास है", "मैं थका हूँ", "मुझे नींद है"]),
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Marathi",
    nativeName: "मराठी",
    flagEmoji: "🇮🇳",
    scriptName: "Devanagari",
    colorHex: "#F4A261",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn Devanagari for Marathi",
        unitType: "script",
        lessons: [
          {
            title: "Core Characters",
            xpReward: 15,
            exercises: [
              script("अ", "a", ["i", "u", "e"]),
              script("आ", "aa", ["a", "i", "o"]),
              script("क", "ka", ["ga", "ta", "pa"]),
              script("म", "ma", ["na", "pa", "ra"]),
              script("ज", "ja", ["cha", "za", "ga"]),
              script("र", "ra", ["la", "ya", "na"]),
            ],
          },
          {
            title: "More Characters",
            xpReward: 15,
            exercises: [
              script("ण", "na", ["na", "la", "ra"]),
              script("ळ", "la", ["ra", "la", "ya"]),
              script("ट", "ta", ["da", "tha", "na"]),
              script("ठ", "tha", ["ta", "da", "pa"]),
            ],
          },
        ],
      },
      {
        title: "Greetings",
        description: "Marathi greetings",
        unitType: "phrases",
        lessons: [
          {
            title: "Hello & Goodbye",
            xpReward: 10,
            exercises: [
              mc("What does 'नमस्कार' mean in Marathi?", "Hello / Greetings", ["Goodbye", "Thank you", "Please"]),
              trans("How do you say 'Thank you' in Marathi?", "धन्यवाद", ["नमस्कार", "माफ करा", "आपण कसे आहात"]),
              fill("माझं नाव ___ आहे", "राज", ["सूर्य", "कमल", "आकाश"]),
            ],
          },
        ],
      },
      { title: "Numbers", description: "Count in Marathi", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'एक'?", "1", ["2", "3", "4"]), mc("What is 'पाच'?", "5", ["3", "7", "9"]), matchPairs("Match Marathi numbers to digits", ["1", "5"], ["एक", "पाच"])] }] },
      { title: "Food & Daily Life", description: "Everyday Marathi words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'पाणी'?", "Water", ["Milk", "Bread", "Tea"]), mc("What is 'भाकरी'?", "Flatbread", ["Rice", "Curry", "Milk"])] }] },
    ],
  },
  {
    name: "Bengali",
    nativeName: "বাংলা",
    flagEmoji: "🇧🇩",
    scriptName: "Bengali Script",
    colorHex: "#2A9D8F",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn the Bengali script",
        unitType: "script",
        lessons: [
          { title: "Vowels", xpReward: 15, exercises: [script("অ", "o/a", ["i", "u", "e"]), script("আ", "aa", ["a", "i", "u"]), script("ই", "i", ["a", "e", "u"]), script("উ", "u", ["a", "i", "o"]), script("এ", "e", ["a", "i", "o"])] },
          { title: "Consonants", xpReward: 15, exercises: [script("ক", "ka", ["ga", "kha", "ta"]), script("গ", "ga", ["ka", "kha", "da"]), script("ম", "ma", ["na", "pa", "ra"]), script("র", "ra", ["la", "ya", "na"]), script("স", "sha/sa", ["ha", "cha", "ka"])] },
        ],
      },
      { title: "Greetings", description: "Bengali greetings", unitType: "phrases", lessons: [{ title: "Hello & Thank you", xpReward: 10, exercises: [mc("What does 'নমস্কার' mean?", "Hello / Greetings", ["Goodbye", "Thank you", "Sorry"]), trans("How do you say 'Thank you'?", "ধন্যবাদ", ["নমস্কার", "আমি ভালো", "শুভ সকাল"])] }] },
      { title: "Numbers", description: "Count in Bengali", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'এক'?", "1", ["2", "3", "5"]), mc("What is 'পাঁচ'?", "5", ["3", "7", "10"]), matchPairs("Match Bengali numbers to digits", ["1", "5"], ["এক", "পাঁচ"])] }] },
      { title: "Food & Daily Life", description: "Daily Bengali words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'জল'?", "Water", ["Milk", "Rice", "Tea"]), mc("What is 'ভাত'?", "Rice", ["Bread", "Water", "Fish"])] }] },
    ],
  },
  {
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    flagEmoji: "🇮🇳",
    scriptName: "Gujarati Script",
    colorHex: "#E9C46A",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn the Gujarati script",
        unitType: "script",
        lessons: [
          { title: "Core Vowels", xpReward: 15, exercises: [script("અ", "a", ["i", "u", "e"]), script("આ", "aa", ["a", "i", "o"]), script("ઇ", "i", ["a", "e", "u"]), script("ઉ", "u", ["a", "i", "o"])] },
          { title: "Core Consonants", xpReward: 15, exercises: [script("ક", "ka", ["ga", "ta", "pa"]), script("ગ", "ga", ["ka", "da", "ba"]), script("મ", "ma", ["na", "pa", "ra"]), script("ર", "ra", ["la", "ya", "na"])] },
        ],
      },
      { title: "Greetings", description: "Gujarati greetings", unitType: "phrases", lessons: [{ title: "Hello & Thank you", xpReward: 10, exercises: [mc("What does 'નમસ્તે' mean?", "Hello", ["Goodbye", "Thank you", "Sorry"]), mc("How to say 'Thank you' in Gujarati?", "આભાર (Aabhar)", ["નમસ્તે", "સારું", "ચાલો"])] }] },
      { title: "Numbers", description: "Count in Gujarati", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'એક'?", "1", ["2", "3", "5"]), mc("What is 'પાંચ'?", "5", ["3", "7", "9"]), matchPairs("Match Gujarati numbers to digits", ["1", "5"], ["એક", "પાંચ"])] }] },
      { title: "Food & Daily Life", description: "Daily Gujarati words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'પાણી'?", "Water", ["Milk", "Bread", "Tea"]), mc("What is 'ખાવું'?", "To eat", ["To drink", "To sleep", "To walk"])] }] },
    ],
  },
  {
    name: "Tamil",
    nativeName: "தமிழ்",
    flagEmoji: "🇮🇳",
    scriptName: "Tamil Script",
    colorHex: "#E76F51",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn Tamil script — one of the world's oldest",
        unitType: "script",
        lessons: [
          { title: "Vowels (Uyir)", xpReward: 15, exercises: [script("அ", "a", ["i", "u", "e"]), script("ஆ", "aa", ["a", "i", "o"]), script("இ", "i", ["a", "e", "u"]), script("உ", "u", ["a", "i", "o"]), script("எ", "e", ["a", "i", "u"])] },
          { title: "Consonants (Mey)", xpReward: 15, exercises: [script("க", "ka", ["ga", "ta", "pa"]), script("ம", "ma", ["na", "pa", "ra"]), script("ர", "ra", ["la", "ya", "na"]), script("ல", "la", ["ra", "va", "na"]), script("வ", "va", ["ba", "la", "ya"])] },
        ],
      },
      { title: "Greetings", description: "Tamil greetings", unitType: "phrases", lessons: [{ title: "Hello & Vanakkam", xpReward: 10, exercises: [mc("What does 'வணக்கம்' (Vanakkam) mean?", "Hello / Greetings", ["Goodbye", "Thank you", "Sorry"]), trans("How to say 'Thank you' in Tamil?", "நன்றி (Nandri)", ["வணக்கம்", "வாருங்கள்", "செல்கிறேன்"])] }] },
      { title: "Numbers", description: "Count in Tamil", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'ஒன்று' (Ondru)?", "1", ["2", "3", "5"]), mc("What is 'ஐந்து' (Aindhu)?", "5", ["3", "7", "10"]), matchPairs("Match Tamil numbers to digits", ["1", "5"], ["ஒன்று", "ஐந்து"])] }] },
      { title: "Food & Daily Life", description: "Daily Tamil words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'தண்ணீர்' (Thanneer)?", "Water", ["Milk", "Rice", "Tea"]), mc("What is 'சோறு' (Soru)?", "Rice", ["Bread", "Water", "Curry"])] }] },
    ],
  },
  {
    name: "Telugu",
    nativeName: "తెలుగు",
    flagEmoji: "🇮🇳",
    scriptName: "Telugu Script",
    colorHex: "#264653",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn Telugu script",
        unitType: "script",
        lessons: [
          { title: "Vowels", xpReward: 15, exercises: [script("అ", "a", ["i", "u", "e"]), script("ఆ", "aa", ["a", "i", "o"]), script("ఇ", "i", ["a", "e", "u"]), script("ఉ", "u", ["a", "i", "o"])] },
          { title: "Consonants", xpReward: 15, exercises: [script("క", "ka", ["ga", "ta", "pa"]), script("మ", "ma", ["na", "pa", "ra"]), script("ర", "ra", ["la", "ya", "na"]), script("వ", "va", ["ba", "la", "ya"])] },
        ],
      },
      { title: "Greetings", description: "Telugu greetings", unitType: "phrases", lessons: [{ title: "Namaskaram", xpReward: 10, exercises: [mc("What does 'నమస్కారం' mean?", "Hello / Greetings", ["Goodbye", "Thank you", "Sorry"]), mc("How to say 'Thank you' in Telugu?", "ధన్యవాదాలు", ["నమస్కారం", "వస్తాను", "పోయివస్తాను"])] }] },
      { title: "Numbers", description: "Count in Telugu", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'ఒకటి' (Okati)?", "1", ["2", "3", "5"]), mc("What is 'అయిదు' (Aidu)?", "5", ["3", "7", "10"]), matchPairs("Match Telugu numbers to digits", ["1", "5"], ["ఒకటి", "అయిదు"])] }] },
      { title: "Food & Daily Life", description: "Daily Telugu words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'నీళ్ళు' (Neellu)?", "Water", ["Milk", "Rice", "Tea"]), mc("What is 'అన్నం' (Annam)?", "Rice", ["Bread", "Water", "Curry"])] }] },
    ],
  },
  {
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    flagEmoji: "🇮🇳",
    scriptName: "Gurmukhi",
    colorHex: "#6A0572",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn Gurmukhi script of Punjabi",
        unitType: "script",
        lessons: [
          { title: "Core Vowel Signs", xpReward: 15, exercises: [script("ਅ", "a", ["i", "u", "e"]), script("ਆ", "aa", ["a", "i", "o"]), script("ਇ", "i", ["a", "e", "u"]), script("ਉ", "u", ["a", "i", "o"])] },
          { title: "Core Consonants", xpReward: 15, exercises: [script("ਕ", "ka", ["ga", "ta", "pa"]), script("ਮ", "ma", ["na", "pa", "ra"]), script("ਰ", "ra", ["la", "ya", "na"]), script("ਵ", "va", ["ba", "la", "ya"])] },
        ],
      },
      { title: "Greetings", description: "Punjabi greetings", unitType: "phrases", lessons: [{ title: "Sat Sri Akal", xpReward: 10, exercises: [mc("What does 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ' (Sat Sri Akal) mean?", "Hello / Greetings (Sikh)", ["Goodbye", "Thank you", "Please"]), mc("How to say 'Thank you' in Punjabi?", "ਧੰਨਵਾਦ (Dhanyavaad)", ["ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "ਠੀਕ ਹੈ", "ਚੰਗਾ"])] }] },
      { title: "Numbers", description: "Count in Punjabi", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'ਇੱਕ' (Ikk)?", "1", ["2", "3", "5"]), mc("What is 'ਪੰਜ' (Panj)?", "5", ["3", "7", "10"]), matchPairs("Match Punjabi numbers to digits", ["1", "5"], ["ਇੱਕ", "ਪੰਜ"])] }] },
      { title: "Food & Daily Life", description: "Daily Punjabi words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'ਪਾਣੀ' (Paani)?", "Water", ["Milk", "Bread", "Tea"]), mc("What is 'ਰੋਟੀ' (Roti)?", "Bread", ["Rice", "Curry", "Water"])] }] },
    ],
  },
  {
    name: "Malayalam",
    nativeName: "മലയാളം",
    flagEmoji: "🇮🇳",
    scriptName: "Malayalam Script",
    colorHex: "#1B7A34",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn the flowing Malayalam script",
        unitType: "script",
        lessons: [
          { title: "Vowels", xpReward: 15, exercises: [script("അ", "a", ["i", "u", "e"]), script("ആ", "aa", ["a", "i", "o"]), script("ഇ", "i", ["a", "e", "u"]), script("ഉ", "u", ["a", "i", "o"])] },
          { title: "Consonants", xpReward: 15, exercises: [script("ക", "ka", ["ga", "ta", "pa"]), script("മ", "ma", ["na", "pa", "ra"]), script("ര", "ra", ["la", "ya", "na"]), script("വ", "va", ["ba", "la", "ya"])] },
        ],
      },
      { title: "Greetings", description: "Malayalam greetings", unitType: "phrases", lessons: [{ title: "Namaskaram", xpReward: 10, exercises: [mc("What does 'നമസ്കാരം' (Namaskaram) mean?", "Hello / Greetings", ["Goodbye", "Thank you", "Sorry"]), mc("How to say 'Thank you'?", "നന്ദി (Nandi)", ["നമസ്കാരം", "ശരി", "പോകൂ"])] }] },
      { title: "Numbers", description: "Count in Malayalam", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'ഒന്ന്' (Onnu)?", "1", ["2", "3", "5"]), mc("What is 'അഞ്ച്' (Anchu)?", "5", ["3", "7", "10"]), matchPairs("Match Malayalam numbers to digits", ["1", "5"], ["ഒന്ന്", "അഞ്ച്"])] }] },
      { title: "Food & Daily Life", description: "Daily Malayalam words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'വെള്ളം' (Vellam)?", "Water", ["Milk", "Rice", "Tea"]), mc("What is 'ചോറ്' (Choru)?", "Rice", ["Bread", "Water", "Curry"])] }] },
    ],
  },
  {
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    flagEmoji: "🇮🇳",
    scriptName: "Kannada Script",
    colorHex: "#D62828",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn the Kannada script",
        unitType: "script",
        lessons: [
          { title: "Vowels", xpReward: 15, exercises: [script("ಅ", "a", ["i", "u", "e"]), script("ಆ", "aa", ["a", "i", "o"]), script("ಇ", "i", ["a", "e", "u"]), script("ಉ", "u", ["a", "i", "o"])] },
          { title: "Consonants", xpReward: 15, exercises: [script("ಕ", "ka", ["ga", "ta", "pa"]), script("ಮ", "ma", ["na", "pa", "ra"]), script("ರ", "ra", ["la", "ya", "na"]), script("ವ", "va", ["ba", "la", "ya"])] },
        ],
      },
      { title: "Greetings", description: "Kannada greetings", unitType: "phrases", lessons: [{ title: "Namaskara", xpReward: 10, exercises: [mc("What does 'ನಮಸ್ಕಾರ' (Namaskara) mean?", "Hello / Greetings", ["Goodbye", "Thank you", "Sorry"]), mc("How to say 'Thank you'?", "ಧನ್ಯವಾದ (Dhanyavaada)", ["ನಮಸ್ಕಾರ", "ಸರಿ", "ಹೋಗಿ"])] }] },
      { title: "Numbers", description: "Count in Kannada", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'ಒಂದು' (Ondu)?", "1", ["2", "3", "5"]), mc("What is 'ಐದು' (Aidu)?", "5", ["3", "7", "10"]), matchPairs("Match Kannada numbers to digits", ["1", "5"], ["ಒಂದು", "ಐದು"])] }] },
      { title: "Food & Daily Life", description: "Daily Kannada words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'ನೀರು' (Neeru)?", "Water", ["Milk", "Rice", "Tea"]), mc("What is 'ಅನ್ನ' (Anna)?", "Rice", ["Bread", "Water", "Curry"])] }] },
    ],
  },
  {
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    flagEmoji: "🇮🇳",
    scriptName: "Odia Script",
    colorHex: "#7B2D8B",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn the distinctive Odia script",
        unitType: "script",
        lessons: [
          { title: "Vowels", xpReward: 15, exercises: [script("ଅ", "a", ["i", "u", "e"]), script("ଆ", "aa", ["a", "i", "o"]), script("ଇ", "i", ["a", "e", "u"]), script("ଉ", "u", ["a", "i", "o"])] },
          { title: "Consonants", xpReward: 15, exercises: [script("କ", "ka", ["ga", "ta", "pa"]), script("ମ", "ma", ["na", "pa", "ra"]), script("ର", "ra", ["la", "ya", "na"]), script("ବ", "ba", ["pa", "va", "da"])] },
        ],
      },
      { title: "Greetings", description: "Odia greetings", unitType: "phrases", lessons: [{ title: "Namaskar", xpReward: 10, exercises: [mc("How do you say 'Hello' in Odia?", "ନମସ୍କାର (Namaskar)", ["ଧନ୍ୟବାଦ", "ବିଦାୟ", "ଅନୁଗ୍ରହ"]), mc("How to say 'Thank you'?", "ଧନ୍ୟବାଦ (Dhanyavaad)", ["ନମସ୍କାର", "ଭଲ", "ଚାଲ"])] }] },
      { title: "Numbers", description: "Count in Odia", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'ଗୋଟିଏ' (Gotie)?", "1", ["2", "3", "5"]), mc("What is 'ପାଞ୍ଚ' (Pancha)?", "5", ["3", "7", "10"]), matchPairs("Match Odia numbers to digits", ["1", "5"], ["ଗୋଟିଏ", "ପାଞ୍ଚ"])] }] },
      { title: "Food & Daily Life", description: "Daily Odia words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'ପାଣି' (Paani)?", "Water", ["Milk", "Rice", "Tea"]), mc("What is 'ଭାତ' (Bhaat)?", "Rice", ["Bread", "Water", "Curry"])] }] },
    ],
  },
  {
    name: "Assamese",
    nativeName: "অসমীয়া",
    flagEmoji: "🇮🇳",
    scriptName: "Assamese Script",
    colorHex: "#3D7EAA",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn the Assamese script",
        unitType: "script",
        lessons: [
          { title: "Vowels", xpReward: 15, exercises: [script("অ", "o/a", ["i", "u", "e"]), script("আ", "aa", ["a", "i", "o"]), script("ই", "i", ["a", "e", "u"]), script("উ", "u", ["a", "i", "o"])] },
          { title: "Consonants", xpReward: 15, exercises: [script("ক", "ka", ["ga", "ta", "pa"]), script("ম", "ma", ["na", "pa", "ra"]), script("ৰ", "ra", ["la", "ya", "na"]), script("ব", "ba", ["pa", "va", "da"])] },
        ],
      },
      { title: "Greetings", description: "Assamese greetings", unitType: "phrases", lessons: [{ title: "Namaskar", xpReward: 10, exercises: [mc("How to say 'Hello' in Assamese?", "নমস্কাৰ (Namaskar)", ["ধন্যবাদ", "বিদায়", "অনুগ্রহ"]), mc("How to say 'Thank you'?", "ধন্যবাদ (Dhanyavaad)", ["নমস্কাৰ", "ভাল", "যাওঁ"])] }] },
      { title: "Numbers", description: "Count in Assamese", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'এক' (Ek)?", "1", ["2", "3", "5"]), mc("What is 'পাঁচ' (Panch)?", "5", ["3", "7", "10"]), matchPairs("Match Assamese numbers to digits", ["1", "5"], ["এক", "পাঁচ"])] }] },
      { title: "Food & Daily Life", description: "Daily Assamese words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'পানী' (Pani)?", "Water", ["Milk", "Rice", "Tea"]), mc("What is 'ভাত' (Bhat)?", "Rice", ["Bread", "Water", "Fish"])] }] },
    ],
  },
  {
    name: "Urdu",
    nativeName: "اردو",
    flagEmoji: "🇵🇰",
    scriptName: "Nastaliq (Perso-Arabic)",
    colorHex: "#006B6B",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn Urdu's flowing Nastaliq script",
        unitType: "script",
        lessons: [
          { title: "Basic Letters", xpReward: 15, exercises: [script("ا", "alif (a)", ["b", "p", "t"]), script("ب", "be (b)", ["p", "t", "n"]), script("پ", "pe (p)", ["b", "t", "f"]), script("ت", "te (t)", ["d", "p", "n"])] },
          { title: "More Letters", xpReward: 15, exercises: [script("م", "meem (m)", ["n", "b", "r"]), script("ن", "noon (n)", ["m", "b", "r"]), script("ر", "re (r)", ["l", "n", "z"]), script("ل", "laam (l)", ["r", "n", "m"])] },
        ],
      },
      { title: "Greetings", description: "Urdu greetings", unitType: "phrases", lessons: [{ title: "Assalamu Alaikum", xpReward: 10, exercises: [mc("What does 'السلام علیکم' (Assalamu Alaikum) mean?", "Peace be upon you (Hello)", ["Goodbye", "Thank you", "Please"]), mc("How to say 'Thank you' in Urdu?", "شکریہ (Shukriya)", ["السلام علیکم", "خدا حافظ", "ٹھیک ہے"])] }] },
      { title: "Numbers", description: "Count in Urdu", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'ایک' (Ek)?", "1", ["2", "3", "5"]), mc("What is 'پانچ' (Paanch)?", "5", ["3", "7", "10"]), matchPairs("Match Urdu numbers to digits", ["1", "5"], ["ایک", "پانچ"])] }] },
      { title: "Food & Daily Life", description: "Daily Urdu words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'پانی' (Paani)?", "Water", ["Milk", "Bread", "Tea"]), mc("What is 'روٹی' (Roti)?", "Bread", ["Rice", "Curry", "Water"])] }] },
    ],
  },
  {
    name: "Kashmiri",
    nativeName: "कॉशुर",
    flagEmoji: "🇮🇳",
    scriptName: "Devanagari / Nastaliq",
    colorHex: "#89CFF0",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn Kashmiri script",
        unitType: "script",
        lessons: [
          { title: "Basic Characters", xpReward: 15, exercises: [script("अ", "a", ["i", "u", "e"]), script("आ", "aa", ["a", "i", "o"]), script("क", "ka", ["ga", "ta", "pa"]), script("म", "ma", ["na", "pa", "ra"])] },
          { title: "More Characters", xpReward: 15, exercises: [script("र", "ra", ["la", "ya", "na"]), script("व", "va", ["ba", "la", "ya"]), script("ल", "la", ["ra", "va", "na"]), script("ह", "ha", ["sa", "sha", "ra"])] },
        ],
      },
      { title: "Greetings", description: "Kashmiri greetings", unitType: "phrases", lessons: [{ title: "Adaab", xpReward: 10, exercises: [mc("How to say 'Hello' in Kashmiri?", "اَداب (Adaab)", ["Thank you", "Goodbye", "Sorry"]), mc("How to say 'Thank you'?", "شُکریہ (Shukriya)", ["اَداب", "خُدا حافِظ", "ٹھیک"])] }] },
      { title: "Numbers", description: "Count in Kashmiri", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'اَکھ' (Akh)?", "1", ["2", "3", "5"]), mc("What is 'پانژ' (Paanz)?", "5", ["3", "7", "10"]), matchPairs("Match Kashmiri numbers to digits", ["1", "5"], ["اَکھ", "پانژ"])] }] },
      { title: "Food & Daily Life", description: "Daily Kashmiri words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'پانی' (Paani)?", "Water", ["Milk", "Rice", "Tea"]), mc("What is 'ژان' (Zaan)?", "Bread", ["Rice", "Curry", "Water"])] }] },
    ],
  },
  {
    name: "Nepali",
    nativeName: "नेपाली",
    flagEmoji: "🇳🇵",
    scriptName: "Devanagari",
    colorHex: "#C0392B",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn Devanagari for Nepali",
        unitType: "script",
        lessons: [
          { title: "Core Characters", xpReward: 15, exercises: [script("अ", "a", ["i", "u", "e"]), script("आ", "aa", ["a", "i", "o"]), script("क", "ka", ["ga", "ta", "pa"]), script("म", "ma", ["na", "pa", "ra"])] },
          { title: "More Characters", xpReward: 15, exercises: [script("र", "ra", ["la", "ya", "na"]), script("ल", "la", ["ra", "va", "na"]), script("ह", "ha", ["sa", "sha", "ra"]), script("ग", "ga", ["ka", "da", "ba"])] },
        ],
      },
      { title: "Greetings", description: "Nepali greetings", unitType: "phrases", lessons: [{ title: "Namaskar", xpReward: 10, exercises: [mc("What does 'नमस्ते' (Namaste) mean in Nepali?", "Hello / Greetings", ["Goodbye", "Thank you", "Sorry"]), mc("How to say 'Thank you' in Nepali?", "धन्यवाद (Dhanyavaad)", ["नमस्ते", "राम्रो", "जानुस्"])] }] },
      { title: "Numbers", description: "Count in Nepali", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'एक' (Ek)?", "1", ["2", "3", "5"]), mc("What is 'पाँच' (Paanch)?", "5", ["3", "7", "10"]), matchPairs("Match Nepali numbers to digits", ["1", "5"], ["एक", "पाँच"])] }] },
      { title: "Food & Daily Life", description: "Daily Nepali words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'पानी' (Paani)?", "Water", ["Milk", "Bread", "Tea"]), mc("What is 'भात' (Bhaat)?", "Rice", ["Bread", "Water", "Curry"])] }] },
    ],
  },
  {
    name: "Sindhi",
    nativeName: "سنڌي",
    flagEmoji: "🇮🇳",
    scriptName: "Perso-Arabic / Devanagari",
    colorHex: "#8E44AD",
    units: [
      {
        title: "Script & Alphabet",
        description: "Learn Sindhi script",
        unitType: "script",
        lessons: [
          { title: "Basic Letters", xpReward: 15, exercises: [script("ا", "alif (a)", ["b", "p", "t"]), script("ب", "be (b)", ["p", "t", "n"]), script("م", "meem (m)", ["n", "b", "r"]), script("ر", "re (r)", ["l", "n", "z"])] },
          { title: "Sindhi Letters", xpReward: 15, exercises: [script("ڄ", "ja (j)", ["cha", "za", "ya"]), script("ڙ", "ra (retroflex r)", ["ra", "la", "za"]), script("ڌ", "da (retroflex d)", ["da", "ta", "ba"]), script("ڻ", "na (retroflex n)", ["na", "ma", "la"])] },
        ],
      },
      { title: "Greetings", description: "Sindhi greetings", unitType: "phrases", lessons: [{ title: "Adaab", xpReward: 10, exercises: [mc("How to say 'Hello' in Sindhi?", "اَداب (Adaab)", ["شُڪريو", "خُدا حافِظ", "ٺيڪ"]), mc("How to say 'Thank you' in Sindhi?", "شُڪريو (Shukriyo)", ["اَداب", "خُدا حافِظ", "ٺيڪ"])] }] },
      { title: "Numbers", description: "Count in Sindhi", unitType: "vocabulary", lessons: [{ title: "1 to 10", xpReward: 10, exercises: [mc("What is 'ھڪ' (Hik)?", "1", ["2", "3", "5"]), mc("What is 'پنج' (Panj)?", "5", ["3", "7", "10"]), matchPairs("Match Sindhi numbers to digits", ["1", "5"], ["ھڪ", "پنج"])] }] },
      { title: "Food & Daily Life", description: "Daily Sindhi words", unitType: "vocabulary", lessons: [{ title: "Food", xpReward: 10, exercises: [mc("What is 'پاڻي' (Paani)?", "Water", ["Milk", "Bread", "Tea"]), mc("What is 'ماني' (Maani)?", "Bread", ["Rice", "Curry", "Water"])] }] },
    ],
  },
];

async function seed() {
  console.log("Clearing existing data...");
  await db.delete(exercisesTable);
  await db.delete(lessonsTable);
  await db.delete(unitsTable);
  await db.delete(languagesTable);

  console.log("Seeding 15 languages with full curriculum...");

  for (const langData of LANGUAGES) {
    const [lang] = await db
      .insert(languagesTable)
      .values({
        name: langData.name,
        nativeName: langData.nativeName,
        flagEmoji: langData.flagEmoji,
        scriptName: langData.scriptName,
        colorHex: langData.colorHex,
      })
      .returning();

    console.log(`  Language: ${lang.name}`);

    for (let ui = 0; ui < langData.units.length; ui++) {
      const unitData = langData.units[ui];
      const [unit] = await db
        .insert(unitsTable)
        .values({
          languageId: lang.id,
          title: unitData.title,
          description: unitData.description,
          orderIndex: ui + 1,
          unitType: unitData.unitType,
        })
        .returning();

      for (let li = 0; li < unitData.lessons.length; li++) {
        const lessonData = unitData.lessons[li];
        const [lesson] = await db
          .insert(lessonsTable)
          .values({
            unitId: unit.id,
            title: lessonData.title,
            orderIndex: li + 1,
            xpReward: lessonData.xpReward,
          })
          .returning();

        for (const exData of lessonData.exercises) {
          await db.insert(exercisesTable).values({
            lessonId: lesson.id,
            type: exData.type,
            question: exData.question,
            correctAnswer: exData.correctAnswer,
            options: exData.options,
            nativeScript: exData.nativeScript ?? null,
            romanization: exData.romanization ?? null,
          });
        }
      }
    }
  }

  // Seed 3 demo users for leaderboard
  await db.delete(usersTable);
  await db.insert(usersTable).values([
    { name: "Priya S.", xp: 450, streak: 14, lastActiveDate: new Date().toISOString().slice(0, 10) },
    { name: "Arjun K.", xp: 320, streak: 7, lastActiveDate: new Date().toISOString().slice(0, 10) },
    { name: "Meera D.", xp: 180, streak: 3, lastActiveDate: new Date().toISOString().slice(0, 10) },
  ]);

  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
