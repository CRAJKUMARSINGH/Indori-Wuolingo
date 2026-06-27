export type ExerciseType = 'MULTIPLE_CHOICE' | 'WORD_ORDER';

export interface MultipleChoiceExercise {
  id: string;
  type: 'MULTIPLE_CHOICE';
  prompt: string;
  promptScript?: string;
  promptTranslit?: string;
  hint?: string;
  options: string[];
  correctIndex: number;
}

export interface WordOrderExercise {
  id: string;
  type: 'WORD_ORDER';
  instruction: string;
  words: string[];
  correctSentence: string;
}

export type Exercise = MultipleChoiceExercise | WordOrderExercise;

export interface Lesson {
  id: string;
  title: string;
  titleHindi: string;
  iconName: string;
  xpReward: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  color: string;
  lessons: Lesson[];
}

export const CURRICULUM: Unit[] = [
  {
    id: 'unit1',
    title: 'Foundations',
    titleHindi: 'आधार',
    description: 'Start your journey with the basics',
    color: '#4F46E5',
    lessons: [
      {
        id: 'u1l1',
        title: 'Greetings',
        titleHindi: 'अभिवादन',
        iconName: 'hand-right',
        xpReward: 10,
        exercises: [
          {
            id: 'u1l1e1',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Namaste',
            promptScript: 'नमस्ते',
            promptTranslit: 'Na-ma-ste',
            hint: 'A common Indian greeting',
            options: ['Hello', 'Goodbye', 'Please', 'Sorry'],
            correctIndex: 0,
          },
          {
            id: 'u1l1e2',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Thank you',
            hint: 'Express gratitude in Hindi',
            options: ['Namaste', 'Shukriya', 'Haan', 'Alvida'],
            correctIndex: 1,
          },
          {
            id: 'u1l1e3',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Haan',
            promptScript: 'हाँ',
            promptTranslit: 'Haan',
            options: ['No', 'Maybe', 'Yes', 'Please'],
            correctIndex: 2,
          },
          {
            id: 'u1l1e4',
            type: 'WORD_ORDER',
            instruction: 'Arrange to say "How are you?"',
            words: ['hain?', 'Aap', 'kaise'],
            correctSentence: 'Aap kaise hain?',
          },
          {
            id: 'u1l1e5',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Nahi',
            promptScript: 'नहीं',
            promptTranslit: 'Na-hee',
            options: ['Yes', 'No', 'Please', 'Thank you'],
            correctIndex: 1,
          },
          {
            id: 'u1l1e6',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Alvida',
            promptScript: 'अलविदा',
            promptTranslit: 'Al-vi-da',
            options: ['Hello', 'Welcome', 'Goodbye', 'Sorry'],
            correctIndex: 2,
          },
        ],
      },
      {
        id: 'u1l2',
        title: 'Numbers',
        titleHindi: 'संख्या',
        iconName: 'calculator',
        xpReward: 10,
        exercises: [
          {
            id: 'u1l2e1',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Ek',
            promptScript: 'एक',
            options: ['Two', 'Three', 'One', 'Four'],
            correctIndex: 2,
          },
          {
            id: 'u1l2e2',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Do',
            promptScript: 'दो',
            options: ['One', 'Two', 'Three', 'Four'],
            correctIndex: 1,
          },
          {
            id: 'u1l2e3',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Five',
            hint: 'Say it in Hindi',
            options: ['Teen', 'Char', 'Paanch', 'Chhe'],
            correctIndex: 2,
          },
          {
            id: 'u1l2e4',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Teen',
            promptScript: 'तीन',
            options: ['Two', 'Four', 'Five', 'Three'],
            correctIndex: 3,
          },
          {
            id: 'u1l2e5',
            type: 'WORD_ORDER',
            instruction: 'Count from one to three',
            words: ['Teen', 'Ek', 'Do'],
            correctSentence: 'Ek Do Teen',
          },
          {
            id: 'u1l2e6',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Das',
            promptScript: 'दस',
            options: ['Six', 'Eight', 'Ten', 'Nine'],
            correctIndex: 2,
          },
        ],
      },
      {
        id: 'u1l3',
        title: 'Colors',
        titleHindi: 'रंग',
        iconName: 'color-palette',
        xpReward: 10,
        exercises: [
          {
            id: 'u1l3e1',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Laal',
            promptScript: 'लाल',
            options: ['Blue', 'Green', 'Red', 'Yellow'],
            correctIndex: 2,
          },
          {
            id: 'u1l3e2',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Blue',
            hint: 'Color of the sky',
            options: ['Laal', 'Neela', 'Hara', 'Peela'],
            correctIndex: 1,
          },
          {
            id: 'u1l3e3',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Safed',
            promptScript: 'सफ़ेद',
            options: ['Black', 'White', 'Purple', 'Orange'],
            correctIndex: 1,
          },
          {
            id: 'u1l3e4',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Hara',
            promptScript: 'हरा',
            options: ['Red', 'Blue', 'Yellow', 'Green'],
            correctIndex: 3,
          },
          {
            id: 'u1l3e5',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Yellow',
            hint: 'Color of turmeric',
            options: ['Laal', 'Hara', 'Peela', 'Neela'],
            correctIndex: 2,
          },
          {
            id: 'u1l3e6',
            type: 'WORD_ORDER',
            instruction: 'Say "The sky is blue"',
            words: ['neela', 'Aasman', 'hai'],
            correctSentence: 'Aasman neela hai',
          },
        ],
      },
      {
        id: 'u1l4',
        title: 'Basic Phrases',
        titleHindi: 'बुनियादी वाक्यांश',
        iconName: 'chatbubbles',
        xpReward: 15,
        exercises: [
          {
            id: 'u1l4e1',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Mera naam ...',
            promptScript: 'मेरा नाम ...',
            hint: 'Complete this sentence',
            options: ['My name is', 'I am going', 'I like', 'Where is'],
            correctIndex: 0,
          },
          {
            id: 'u1l4e2',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Maafi kijiye',
            promptScript: 'माफी कीजिए',
            options: ['Thank you', 'Excuse me / Sorry', 'How much?', 'Welcome'],
            correctIndex: 1,
          },
          {
            id: 'u1l4e3',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Please',
            hint: 'Polite request in Hindi',
            options: ['Shukriya', 'Kripa karke', 'Haan', 'Nahi'],
            correctIndex: 1,
          },
          {
            id: 'u1l4e4',
            type: 'WORD_ORDER',
            instruction: 'Introduce yourself',
            words: ['naam', 'Mera', 'Arjun', 'hai'],
            correctSentence: 'Mera naam Arjun hai',
          },
          {
            id: 'u1l4e5',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Aap kahan se hain?',
            promptScript: 'आप कहाँ से हैं?',
            options: ['What is your name?', 'Where are you from?', 'How old are you?', 'What do you do?'],
            correctIndex: 1,
          },
          {
            id: 'u1l4e6',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Bilkul',
            promptScript: 'बिल्कुल',
            options: ['Never', 'Sometimes', 'Absolutely', 'Maybe'],
            correctIndex: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'unit2',
    title: 'Everyday Life',
    titleHindi: 'रोज़मर्रा की ज़िंदगी',
    description: 'Talk about daily life and family',
    color: '#0EA5E9',
    lessons: [
      {
        id: 'u2l1',
        title: 'Family',
        titleHindi: 'परिवार',
        iconName: 'people',
        xpReward: 15,
        exercises: [
          {
            id: 'u2l1e1',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Maa',
            promptScript: 'माँ',
            options: ['Father', 'Sister', 'Mother', 'Brother'],
            correctIndex: 2,
          },
          {
            id: 'u2l1e2',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Father',
            hint: 'Respectful term',
            options: ['Bhai', 'Behen', 'Pitaji', 'Dada'],
            correctIndex: 2,
          },
          {
            id: 'u2l1e3',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Bhai',
            promptScript: 'भाई',
            options: ['Sister', 'Brother', 'Mother', 'Uncle'],
            correctIndex: 1,
          },
          {
            id: 'u2l1e4',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Behen',
            promptScript: 'बहन',
            options: ['Brother', 'Aunt', 'Sister', 'Mother'],
            correctIndex: 2,
          },
          {
            id: 'u2l1e5',
            type: 'WORD_ORDER',
            instruction: 'Say "My family is big"',
            words: ['bara', 'Mera', 'hai', 'parivaar'],
            correctSentence: 'Mera parivaar bara hai',
          },
          {
            id: 'u2l1e6',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Ghar',
            promptScript: 'घर',
            options: ['School', 'Market', 'Home', 'Garden'],
            correctIndex: 2,
          },
        ],
      },
      {
        id: 'u2l2',
        title: 'Food & Drink',
        titleHindi: 'खाना पीना',
        iconName: 'restaurant',
        xpReward: 15,
        exercises: [
          {
            id: 'u2l2e1',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Roti',
            promptScript: 'रोटी',
            options: ['Rice', 'Bread/Flatbread', 'Lentils', 'Vegetables'],
            correctIndex: 1,
          },
          {
            id: 'u2l2e2',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Water',
            hint: 'Essential drink',
            options: ['Chai', 'Lassi', 'Paani', 'Doodh'],
            correctIndex: 2,
          },
          {
            id: 'u2l2e3',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Chai',
            promptScript: 'चाय',
            options: ['Coffee', 'Juice', 'Tea', 'Milk'],
            correctIndex: 2,
          },
          {
            id: 'u2l2e4',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Chawal',
            promptScript: 'चावल',
            options: ['Bread', 'Rice', 'Lentils', 'Curry'],
            correctIndex: 1,
          },
          {
            id: 'u2l2e5',
            type: 'WORD_ORDER',
            instruction: 'Say "I want tea"',
            words: ['chahiye', 'Mujhe', 'chai'],
            correctSentence: 'Mujhe chai chahiye',
          },
          {
            id: 'u2l2e6',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Khana khaya?',
            promptScript: 'खाना खाया?',
            options: ['Have you slept?', 'Have you eaten?', 'Are you hungry?', 'Do you want food?'],
            correctIndex: 1,
          },
        ],
      },
      {
        id: 'u2l3',
        title: 'Time & Days',
        titleHindi: 'समय और दिन',
        iconName: 'time',
        xpReward: 15,
        exercises: [
          {
            id: 'u2l3e1',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Aaj',
            promptScript: 'आज',
            options: ['Yesterday', 'Tomorrow', 'Today', 'Now'],
            correctIndex: 2,
          },
          {
            id: 'u2l3e2',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Tomorrow',
            options: ['Aaj', 'Kal', 'Parso', 'Abhi'],
            correctIndex: 1,
          },
          {
            id: 'u2l3e3',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Subah',
            promptScript: 'सुबह',
            options: ['Evening', 'Night', 'Afternoon', 'Morning'],
            correctIndex: 3,
          },
          {
            id: 'u2l3e4',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Raat',
            promptScript: 'रात',
            options: ['Day', 'Morning', 'Night', 'Afternoon'],
            correctIndex: 2,
          },
          {
            id: 'u2l3e5',
            type: 'WORD_ORDER',
            instruction: 'Say "Good morning"',
            words: ['Namaste', 'subah', 'Shubh'],
            correctSentence: 'Shubh subah Namaste',
          },
          {
            id: 'u2l3e6',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Somvar',
            promptScript: 'सोमवार',
            options: ['Tuesday', 'Monday', 'Wednesday', 'Sunday'],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'unit3',
    title: 'Getting Around',
    titleHindi: 'यात्रा',
    description: 'Navigate cities and ask for directions',
    color: '#10B981',
    lessons: [
      {
        id: 'u3l1',
        title: 'Directions',
        titleHindi: 'दिशाएँ',
        iconName: 'navigate',
        xpReward: 20,
        exercises: [
          {
            id: 'u3l1e1',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Baayi taraf',
            promptScript: 'बायीं तरफ',
            options: ['Right', 'Straight', 'Left', 'Behind'],
            correctIndex: 2,
          },
          {
            id: 'u3l1e2',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Right side',
            options: ['Seedha', 'Baayi taraf', 'Daayee taraf', 'Peeche'],
            correctIndex: 2,
          },
          {
            id: 'u3l1e3',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Paas',
            promptScript: 'पास',
            options: ['Far', 'Near', 'Here', 'There'],
            correctIndex: 1,
          },
          {
            id: 'u3l1e4',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Station kahan hai?',
            promptScript: 'स्टेशन कहाँ है?',
            options: ['How far is the station?', 'Where is the station?', 'Is there a station?', 'Go to the station'],
            correctIndex: 1,
          },
          {
            id: 'u3l1e5',
            type: 'WORD_ORDER',
            instruction: 'Ask "How do I get there?"',
            words: ['kaise', 'Wahan', 'jaaun?'],
            correctSentence: 'Wahan kaise jaaun?',
          },
          {
            id: 'u3l1e6',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Seedha jaao',
            promptScript: 'सीधा जाओ',
            options: ['Turn left', 'Go back', 'Go straight', 'Stop here'],
            correctIndex: 2,
          },
        ],
      },
      {
        id: 'u3l2',
        title: 'Transport',
        titleHindi: 'परिवहन',
        iconName: 'bus',
        xpReward: 20,
        exercises: [
          {
            id: 'u3l2e1',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Rickshaw',
            promptScript: 'रिक्शा',
            options: ['Bus', 'Auto-rickshaw', 'Train', 'Taxi'],
            correctIndex: 1,
          },
          {
            id: 'u3l2e2',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Train',
            options: ['Bus', 'Car', 'Gaadi / Rail', 'Cycle'],
            correctIndex: 2,
          },
          {
            id: 'u3l2e3',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Kitna time lagega?',
            promptScript: 'कितना टाइम लगेगा?',
            options: ['How much does it cost?', 'How long will it take?', 'Where does it go?', 'When does it leave?'],
            correctIndex: 1,
          },
          {
            id: 'u3l2e4',
            type: 'WORD_ORDER',
            instruction: 'Say "I want to go to Delhi"',
            words: ['jaana', 'Mujhe', 'hai', 'Delhi'],
            correctSentence: 'Mujhe Delhi jaana hai',
          },
          {
            id: 'u3l2e5',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Kitne ka hai?',
            promptScript: 'कितने का है?',
            options: ['How old is it?', 'How many are there?', 'How much does it cost?', 'What is that?'],
            correctIndex: 2,
          },
          {
            id: 'u3l2e6',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Airport',
            options: ['Hawai adda', 'Railway station', 'Bus stand', 'Hotel'],
            correctIndex: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'unit4',
    title: 'Shopping & Food',
    titleHindi: 'खरीदारी',
    description: 'Shop, bargain, and order food like a local',
    color: '#F59E0B',
    lessons: [
      {
        id: 'u4l1',
        title: 'At the Market',
        titleHindi: 'बाज़ार में',
        iconName: 'bag',
        xpReward: 20,
        exercises: [
          {
            id: 'u4l1e1',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Sasta',
            promptScript: 'सस्ता',
            options: ['Expensive', 'Old', 'Cheap', 'New'],
            correctIndex: 2,
          },
          {
            id: 'u4l1e2',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Expensive',
            options: ['Sasta', 'Mahanga', 'Naya', 'Purana'],
            correctIndex: 1,
          },
          {
            id: 'u4l1e3',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Kya aapke paas hai?',
            promptScript: 'क्या आपके पास है?',
            options: ['What is the price?', 'Do you have it?', 'Where is the market?', 'I want to buy'],
            correctIndex: 1,
          },
          {
            id: 'u4l1e4',
            type: 'WORD_ORDER',
            instruction: 'Bargain: "Give me a discount"',
            words: ['do', 'thodi', 'Mujhe', 'chhoot'],
            correctSentence: 'Mujhe thodi chhoot do',
          },
          {
            id: 'u4l1e5',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Yeh lo',
            promptScript: 'यह लो',
            options: ['Put this here', 'Take this', 'Look at this', 'This is mine'],
            correctIndex: 1,
          },
          {
            id: 'u4l1e6',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Rupaye',
            promptScript: 'रुपये',
            options: ['Dollar', 'Rupees', 'Euro', 'Pound'],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'unit5',
    title: 'Culture & Festivals',
    titleHindi: 'संस्कृति',
    description: 'Celebrate India\'s rich traditions',
    color: '#EC4899',
    lessons: [
      {
        id: 'u5l1',
        title: 'Festivals',
        titleHindi: 'त्योहार',
        iconName: 'sparkles',
        xpReward: 25,
        exercises: [
          {
            id: 'u5l1e1',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Diwali',
            promptScript: 'दीवाली',
            options: ['Harvest Festival', 'Festival of Lights', 'Spring Festival', 'Rain Festival'],
            correctIndex: 1,
          },
          {
            id: 'u5l1e2',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Festival of Colors',
            hint: 'Spring festival in India',
            options: ['Diwali', 'Eid', 'Holi', 'Navratri'],
            correctIndex: 2,
          },
          {
            id: 'u5l1e3',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Badhai ho!',
            promptScript: 'बधाई हो!',
            options: ['Good luck!', 'Congratulations!', 'Be careful!', 'Happy birthday!'],
            correctIndex: 1,
          },
          {
            id: 'u5l1e4',
            type: 'WORD_ORDER',
            instruction: 'Say "Happy Diwali"',
            words: ['ki', 'Diwali', 'Shubh', 'hardik', 'shubhkamnayen'],
            correctSentence: 'Shubh Diwali ki hardik shubhkamnayen',
          },
          {
            id: 'u5l1e5',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Puja',
            promptScript: 'पूजा',
            options: ['Offering / Prayer ritual', 'Celebration', 'Festival', 'Holiday'],
            correctIndex: 0,
          },
          {
            id: 'u5l1e6',
            type: 'MULTIPLE_CHOICE',
            prompt: 'Khushi',
            promptScript: 'खुशी',
            options: ['Sadness', 'Anger', 'Happiness / Joy', 'Peace'],
            correctIndex: 2,
          },
        ],
      },
    ],
  },
];

export function getLessonById(lessonId: string): Lesson | null {
  for (const unit of CURRICULUM) {
    for (const lesson of unit.lessons) {
      if (lesson.id === lessonId) return lesson;
    }
  }
  return null;
}

export function getUnitForLesson(lessonId: string): Unit | null {
  for (const unit of CURRICULUM) {
    for (const lesson of unit.lessons) {
      if (lesson.id === lessonId) return unit;
    }
  }
  return null;
}

export const LEADERBOARD_MOCK = [
  { id: '1', name: 'Priya S.', xp: 450, flag: '🇮🇳', streak: 12 },
  { id: '2', name: 'Arjun M.', xp: 380, flag: '🇮🇳', streak: 8 },
  { id: '3', name: 'Kavya R.', xp: 320, flag: '🇺🇸', streak: 15 },
  { id: '4', name: 'Rohan V.', xp: 290, flag: '🇬🇧', streak: 5 },
  { id: '5', name: 'Ananya K.', xp: 250, flag: '🇨🇦', streak: 7 },
  { id: '6', name: 'Vikram S.', xp: 220, flag: '🇦🇺', streak: 3 },
  { id: '7', name: 'Shreya P.', xp: 190, flag: '🇸🇬', streak: 9 },
  { id: '8', name: 'Aditya B.', xp: 160, flag: '🇩🇪', streak: 2 },
];

export const BADGES = [
  { id: 'first_lesson', title: 'First Step', description: 'Complete your first lesson', icon: 'star', xpRequired: 0, lessonsRequired: 1 },
  { id: 'streak_3', title: '3-Day Streak', description: 'Study 3 days in a row', icon: 'flame', xpRequired: 0, streakRequired: 3 },
  { id: 'xp_50', title: 'XP Hunter', description: 'Earn 50 XP', icon: 'trophy', xpRequired: 50, lessonsRequired: 0 },
  { id: 'unit1_complete', title: 'Foundation Builder', description: 'Complete Unit 1', icon: 'ribbon', xpRequired: 0, lessonsRequired: 4 },
  { id: 'xp_100', title: 'Century Club', description: 'Earn 100 XP', icon: 'medal', xpRequired: 100, lessonsRequired: 0 },
  { id: 'streak_7', title: 'Week Warrior', description: 'Study 7 days in a row', icon: 'calendar', xpRequired: 0, streakRequired: 7 },
];
