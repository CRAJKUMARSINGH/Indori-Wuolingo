export type ExerciseType =
  | "translate_mc"
  | "en_to_hi_mc"
  | "script_mc"
  | "match_pair";

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options: string[];
  correct: string;
  hint?: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  xpReward: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  colorKey: "unit1" | "unit2" | "unit3" | "unit4";
  lessons: Lesson[];
}

export const curriculum: Unit[] = [
  {
    id: "unit1",
    title: "Namaste!",
    titleHindi: "नमस्ते!",
    description: "Greetings & basic phrases",
    colorKey: "unit1",
    lessons: [
      {
        id: "u1l1",
        title: "Hello & Goodbye",
        subtitle: "Your first words",
        xpReward: 10,
        exercises: [
          {
            id: "u1l1e1",
            type: "translate_mc",
            question: "What does नमस्ते mean?",
            options: ["Hello / Namaste", "Goodbye", "Thank you", "Sorry"],
            correct: "Hello / Namaste",
          },
          {
            id: "u1l1e2",
            type: "en_to_hi_mc",
            question: "How do you say 'Hello' in Hindi?",
            options: ["नमस्ते", "अलविदा", "धन्यवाद", "माफ़ करना"],
            correct: "नमस्ते",
            hint: "Namaste — a universal Indian greeting",
          },
          {
            id: "u1l1e3",
            type: "translate_mc",
            question: "What does अलविदा mean?",
            options: ["Goodbye", "Hello", "Please", "Yes"],
            correct: "Goodbye",
          },
          {
            id: "u1l1e4",
            type: "en_to_hi_mc",
            question: "How do you say 'Goodbye' in Hindi?",
            options: ["अलविदा", "नमस्ते", "हाँ", "नहीं"],
            correct: "अलविदा",
          },
          {
            id: "u1l1e5",
            type: "translate_mc",
            question: "What does फिर मिलेंगे mean?",
            options: ["See you again", "Good morning", "How are you?", "Thank you"],
            correct: "See you again",
            hint: "Phir milenge — used at parting",
          },
          {
            id: "u1l1e6",
            type: "script_mc",
            question: "Which is the correct Hindi script for 'Namaste'?",
            options: ["नमस्ते", "नमसते", "नमस्टे", "नमस्त"],
            correct: "नमस्ते",
          },
        ],
      },
      {
        id: "u1l2",
        title: "How Are You?",
        subtitle: "Basic conversation",
        xpReward: 10,
        exercises: [
          {
            id: "u1l2e1",
            type: "translate_mc",
            question: "What does आप कैसे हैं? mean?",
            options: ["How are you?", "What is your name?", "Where are you from?", "How old are you?"],
            correct: "How are you?",
          },
          {
            id: "u1l2e2",
            type: "en_to_hi_mc",
            question: "How do you say 'I am fine' in Hindi?",
            options: ["मैं ठीक हूँ", "मैं खुश हूँ", "मैं यहाँ हूँ", "मैं थक गया हूँ"],
            correct: "मैं ठीक हूँ",
            hint: "Main theek hoon",
          },
          {
            id: "u1l2e3",
            type: "translate_mc",
            question: "What does आपका नाम क्या है? mean?",
            options: ["What is your name?", "How are you?", "How old are you?", "Where do you live?"],
            correct: "What is your name?",
          },
          {
            id: "u1l2e4",
            type: "translate_mc",
            question: "What does धन्यवाद mean?",
            options: ["Thank you", "Sorry", "Please", "Welcome"],
            correct: "Thank you",
          },
          {
            id: "u1l2e5",
            type: "en_to_hi_mc",
            question: "How do you say 'Thank you' in Hindi?",
            options: ["धन्यवाद", "माफ़ करना", "कृपया", "स्वागत"],
            correct: "धन्यवाद",
          },
          {
            id: "u1l2e6",
            type: "translate_mc",
            question: "What does माफ़ करना mean?",
            options: ["Sorry / Excuse me", "Thank you", "Please", "You're welcome"],
            correct: "Sorry / Excuse me",
          },
        ],
      },
      {
        id: "u1l3",
        title: "Yes & No",
        subtitle: "Agreement & refusal",
        xpReward: 15,
        exercises: [
          {
            id: "u1l3e1",
            type: "translate_mc",
            question: "What does हाँ mean?",
            options: ["Yes", "No", "Maybe", "Sometimes"],
            correct: "Yes",
          },
          {
            id: "u1l3e2",
            type: "translate_mc",
            question: "What does नहीं mean?",
            options: ["No", "Yes", "Never", "Not now"],
            correct: "No",
          },
          {
            id: "u1l3e3",
            type: "en_to_hi_mc",
            question: "How do you say 'Please' in Hindi?",
            options: ["कृपया", "धन्यवाद", "माफ़ करना", "हाँ"],
            correct: "कृपया",
          },
          {
            id: "u1l3e4",
            type: "translate_mc",
            question: "What does बिल्कुल mean?",
            options: ["Absolutely / Of course", "Never", "Sometimes", "Almost"],
            correct: "Absolutely / Of course",
          },
          {
            id: "u1l3e5",
            type: "script_mc",
            question: "Which is the correct Hindi script for 'No'?",
            options: ["नहीं", "नही", "नाहीं", "नहिं"],
            correct: "नहीं",
          },
          {
            id: "u1l3e6",
            type: "en_to_hi_mc",
            question: "How do you say 'Welcome' in Hindi?",
            options: ["स्वागत है", "धन्यवाद", "नमस्ते", "अलविदा"],
            correct: "स्वागत है",
          },
        ],
      },
    ],
  },
  {
    id: "unit2",
    title: "Numbers",
    titleHindi: "संख्याएँ",
    description: "Count in Hindi",
    colorKey: "unit2",
    lessons: [
      {
        id: "u2l1",
        title: "One to Five",
        subtitle: "Your first numbers",
        xpReward: 10,
        exercises: [
          {
            id: "u2l1e1",
            type: "translate_mc",
            question: "What does एक mean?",
            options: ["One", "Two", "Three", "Four"],
            correct: "One",
          },
          {
            id: "u2l1e2",
            type: "translate_mc",
            question: "What does दो mean?",
            options: ["Two", "One", "Four", "Six"],
            correct: "Two",
          },
          {
            id: "u2l1e3",
            type: "en_to_hi_mc",
            question: "How do you say 'Three' in Hindi?",
            options: ["तीन", "दो", "चार", "पाँच"],
            correct: "तीन",
          },
          {
            id: "u2l1e4",
            type: "translate_mc",
            question: "What does चार mean?",
            options: ["Four", "Five", "Two", "Three"],
            correct: "Four",
          },
          {
            id: "u2l1e5",
            type: "en_to_hi_mc",
            question: "How do you say 'Five' in Hindi?",
            options: ["पाँच", "चार", "छह", "तीन"],
            correct: "पाँच",
          },
          {
            id: "u2l1e6",
            type: "script_mc",
            question: "Which is the correct Hindi for 'One'?",
            options: ["एक", "ऐक", "एक़", "अक"],
            correct: "एक",
          },
        ],
      },
      {
        id: "u2l2",
        title: "Six to Ten",
        subtitle: "Complete your first ten",
        xpReward: 10,
        exercises: [
          {
            id: "u2l2e1",
            type: "translate_mc",
            question: "What does छह mean?",
            options: ["Six", "Seven", "Eight", "Nine"],
            correct: "Six",
          },
          {
            id: "u2l2e2",
            type: "en_to_hi_mc",
            question: "How do you say 'Seven' in Hindi?",
            options: ["सात", "आठ", "छह", "नौ"],
            correct: "सात",
          },
          {
            id: "u2l2e3",
            type: "translate_mc",
            question: "What does आठ mean?",
            options: ["Eight", "Six", "Nine", "Ten"],
            correct: "Eight",
          },
          {
            id: "u2l2e4",
            type: "translate_mc",
            question: "What does नौ mean?",
            options: ["Nine", "New", "Now", "Eight"],
            correct: "Nine",
          },
          {
            id: "u2l2e5",
            type: "en_to_hi_mc",
            question: "How do you say 'Ten' in Hindi?",
            options: ["दस", "नौ", "ग्यारह", "बारह"],
            correct: "दस",
          },
          {
            id: "u2l2e6",
            type: "script_mc",
            question: "Which is the correct Hindi for 'Ten'?",
            options: ["दस", "डस", "दास", "दश"],
            correct: "दस",
          },
        ],
      },
    ],
  },
  {
    id: "unit3",
    title: "Family",
    titleHindi: "परिवार",
    description: "Talk about your family",
    colorKey: "unit3",
    lessons: [
      {
        id: "u3l1",
        title: "Parents & Siblings",
        subtitle: "Close family",
        xpReward: 15,
        exercises: [
          {
            id: "u3l1e1",
            type: "translate_mc",
            question: "What does माँ mean?",
            options: ["Mother", "Father", "Sister", "Brother"],
            correct: "Mother",
          },
          {
            id: "u3l1e2",
            type: "translate_mc",
            question: "What does पिताजी mean?",
            options: ["Father", "Mother", "Uncle", "Grandfather"],
            correct: "Father",
          },
          {
            id: "u3l1e3",
            type: "en_to_hi_mc",
            question: "How do you say 'Brother' in Hindi?",
            options: ["भाई", "बहन", "माँ", "पिताजी"],
            correct: "भाई",
            hint: "Bhai — you might have heard this in Bollywood films!",
          },
          {
            id: "u3l1e4",
            type: "translate_mc",
            question: "What does बहन mean?",
            options: ["Sister", "Brother", "Mother", "Friend"],
            correct: "Sister",
          },
          {
            id: "u3l1e5",
            type: "en_to_hi_mc",
            question: "How do you say 'Family' in Hindi?",
            options: ["परिवार", "दोस्त", "घर", "शहर"],
            correct: "परिवार",
          },
          {
            id: "u3l1e6",
            type: "script_mc",
            question: "Which is the correct Hindi for 'Mother'?",
            options: ["माँ", "मां", "माऍ", "मा"],
            correct: "माँ",
          },
          {
            id: "u3l1e7",
            type: "translate_mc",
            question: "What does दादा mean?",
            options: ["Paternal grandfather", "Uncle", "Father", "Elder brother"],
            correct: "Paternal grandfather",
          },
        ],
      },
      {
        id: "u3l2",
        title: "Extended Family",
        subtitle: "The bigger family",
        xpReward: 15,
        exercises: [
          {
            id: "u3l2e1",
            type: "translate_mc",
            question: "What does चाचा mean?",
            options: ["Paternal uncle", "Elder brother", "Grandfather", "Cousin"],
            correct: "Paternal uncle",
          },
          {
            id: "u3l2e2",
            type: "en_to_hi_mc",
            question: "How do you say 'Friend' in Hindi?",
            options: ["दोस्त", "परिवार", "भाई", "चाचा"],
            correct: "दोस्त",
          },
          {
            id: "u3l2e3",
            type: "translate_mc",
            question: "What does नाना mean?",
            options: ["Maternal grandfather", "Father", "Uncle", "Elder brother"],
            correct: "Maternal grandfather",
          },
          {
            id: "u3l2e4",
            type: "translate_mc",
            question: "What does बच्चे mean?",
            options: ["Children", "Parents", "Family", "Friends"],
            correct: "Children",
          },
          {
            id: "u3l2e5",
            type: "en_to_hi_mc",
            question: "How do you say 'Home' in Hindi?",
            options: ["घर", "शहर", "देश", "गाँव"],
            correct: "घर",
          },
          {
            id: "u3l2e6",
            type: "translate_mc",
            question: "What does पति mean?",
            options: ["Husband", "Wife", "Father", "Brother"],
            correct: "Husband",
          },
        ],
      },
    ],
  },
];

export function getAllLessons(): Lesson[] {
  return curriculum.flatMap((unit) => unit.lessons);
}

export function getLessonById(id: string): { lesson: Lesson; unit: Unit } | null {
  for (const unit of curriculum) {
    const lesson = unit.lessons.find((l) => l.id === id);
    if (lesson) return { lesson, unit };
  }
  return null;
}

export function getNextLessonId(currentId: string): string | null {
  const all = getAllLessons();
  const idx = all.findIndex((l) => l.id === currentId);
  if (idx === -1 || idx === all.length - 1) return null;
  return all[idx + 1].id;
}

export const BADGES = [
  { id: "first_lesson", title: "First Step", description: "Complete your first lesson", icon: "star" },
  { id: "streak_3", title: "On Fire!", description: "Maintain a 3-day streak", icon: "flame" },
  { id: "streak_7", title: "Week Warrior", description: "Maintain a 7-day streak", icon: "award" },
  { id: "xp_50", title: "XP Collector", description: "Earn 50 XP", icon: "zap" },
  { id: "xp_100", title: "Century Club", description: "Earn 100 XP", icon: "shield" },
  { id: "unit1_complete", title: "Namaste Master", description: "Complete Unit 1", icon: "check-circle" },
  { id: "unit2_complete", title: "Number Ninja", description: "Complete Unit 2", icon: "hash" },
  { id: "unit3_complete", title: "Family Ties", description: "Complete Unit 3", icon: "heart" },
];

export type BadgeId = typeof BADGES[number]["id"];
