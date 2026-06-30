import { BADGES, CURRICULUM as HINDI_CURRICULUM, LEADERBOARD_MOCK, type Lesson, type Unit } from './curriculum';
import { DEFAULT_LANGUAGE_CODE, LANGUAGES } from './languages';

interface PromptCard {
  latin: string;
  script: string;
  translit: string;
  english: string;
}

interface TrackConfig {
  code: string;
  unitTitles: [string, string, string];
  lessonTitles: [string, string, string];
  greeting: PromptCard;
  thanks: PromptCard;
  yesWord: PromptCard;
  introWords: string[];
  introSentence: string;
  dish: PromptCard;
  tea: PromptCard;
  price: PromptCard;
  teaSentenceWords: string[];
  teaSentence: string;
  celebration: PromptCard;
  culture: PromptCard;
  slang: PromptCard;
  celebrateWords: string[];
  celebrateSentence: string;
}

function createStarterCurriculum(track: TrackConfig): Unit[] {
  const prefix = track.code;

  return [
    {
      id: `${prefix}_unit1`,
      title: 'Starter',
      titleHindi: track.unitTitles[0],
      description: 'Learn your first everyday phrases',
      color: '#4F46E5',
      lessons: [
        {
          id: `${prefix}_u1l1`,
          title: 'Greetings',
          titleHindi: track.lessonTitles[0],
          iconName: 'hand-right',
          xpReward: 12,
          exercises: [
            {
              id: `${prefix}_u1l1e1`,
              type: 'MULTIPLE_CHOICE',
              prompt: track.greeting.latin,
              promptScript: track.greeting.script,
              promptTranslit: track.greeting.translit,
              hint: 'A common local greeting',
              options: ['Hello', 'Goodbye', 'Please', 'Sorry'],
              correctIndex: 0,
            },
            {
              id: `${prefix}_u1l1e2`,
              type: 'MULTIPLE_CHOICE',
              prompt: track.thanks.latin,
              promptScript: track.thanks.script,
              promptTranslit: track.thanks.translit,
              options: ['Thank you', 'Tomorrow', 'Food', 'Teacher'],
              correctIndex: 0,
            },
            {
              id: `${prefix}_u1l1e3`,
              type: 'MULTIPLE_CHOICE',
              prompt: track.yesWord.latin,
              promptScript: track.yesWord.script,
              promptTranslit: track.yesWord.translit,
              options: ['Maybe', 'No', 'Yes', 'Later'],
              correctIndex: 2,
            },
            {
              id: `${prefix}_u1l1e4`,
              type: 'WORD_ORDER',
              instruction: 'Introduce yourself',
              words: track.introWords,
              correctSentence: track.introSentence,
            },
          ],
        },
      ],
    },
    {
      id: `${prefix}_unit2`,
      title: 'Daily Life',
      titleHindi: track.unitTitles[1],
      description: 'Talk about food, tea, and prices',
      color: '#0EA5E9',
      lessons: [
        {
          id: `${prefix}_u2l1`,
          title: 'Food Trail',
          titleHindi: track.lessonTitles[1],
          iconName: 'restaurant',
          xpReward: 14,
          exercises: [
            {
              id: `${prefix}_u2l1e1`,
              type: 'MULTIPLE_CHOICE',
              prompt: track.dish.latin,
              promptScript: track.dish.script,
              promptTranslit: track.dish.translit,
              hint: 'A signature regional dish',
              options: ['Street food / dish', 'Train station', 'Rain', 'Festival'],
              correctIndex: 0,
            },
            {
              id: `${prefix}_u2l1e2`,
              type: 'MULTIPLE_CHOICE',
              prompt: track.tea.latin,
              promptScript: track.tea.script,
              promptTranslit: track.tea.translit,
              options: ['Tea', 'Water', 'Salt', 'Book'],
              correctIndex: 0,
            },
            {
              id: `${prefix}_u2l1e3`,
              type: 'MULTIPLE_CHOICE',
              prompt: track.price.latin,
              promptScript: track.price.script,
              promptTranslit: track.price.translit,
              options: ['Where are you going?', 'How much is this?', 'Please sit down', 'I am tired'],
              correctIndex: 1,
            },
            {
              id: `${prefix}_u2l1e4`,
              type: 'WORD_ORDER',
              instruction: 'Say "I want tea"',
              words: track.teaSentenceWords,
              correctSentence: track.teaSentence,
            },
          ],
        },
      ],
    },
    {
      id: `${prefix}_unit3`,
      title: 'Culture',
      titleHindi: track.unitTitles[2],
      description: 'Explore festivals, arts, and local flavor',
      color: '#EC4899',
      lessons: [
        {
          id: `${prefix}_u3l1`,
          title: 'Cultural Gems',
          titleHindi: track.lessonTitles[2],
          iconName: 'sparkles',
          xpReward: 16,
          exercises: [
            {
              id: `${prefix}_u3l1e1`,
              type: 'MULTIPLE_CHOICE',
              prompt: track.celebration.latin,
              promptScript: track.celebration.script,
              promptTranslit: track.celebration.translit,
              hint: 'A festive greeting',
              options: ['Festival wishes', 'Good night', 'See you later', 'What is your name?'],
              correctIndex: 0,
            },
            {
              id: `${prefix}_u3l1e2`,
              type: 'MULTIPLE_CHOICE',
              prompt: track.culture.latin,
              promptScript: track.culture.script,
              promptTranslit: track.culture.translit,
              options: ['Cultural gem / art form', 'Market street', 'School bus', 'Weather report'],
              correctIndex: 0,
            },
            {
              id: `${prefix}_u3l1e3`,
              type: 'MULTIPLE_CHOICE',
              prompt: track.slang.latin,
              promptScript: track.slang.script,
              promptTranslit: track.slang.translit,
              options: ['Too slow', 'Awesome!', 'Very late', 'Too expensive'],
              correctIndex: 1,
            },
            {
              id: `${prefix}_u3l1e4`,
              type: 'WORD_ORDER',
              instruction: 'Send a festive wish',
              words: track.celebrateWords,
              correctSentence: track.celebrateSentence,
            },
          ],
        },
      ],
    },
  ];
}

const STARTER_TRACKS: TrackConfig[] = [
  {
    code: 'bengali',
    unitTitles: ['শুরু', 'প্রতিদিন', 'সংস্কৃতি'],
    lessonTitles: ['শুভেচ্ছা', 'খাবারপথ', 'সাংস্কৃতিক রত্ন'],
    greeting: { latin: 'Nomoshkar', script: 'নমস্কার', translit: 'No-mo-shkar', english: 'Hello' },
    thanks: { latin: 'Dhonnobad', script: 'ধন্যবাদ', translit: 'Dhon-no-baad', english: 'Thank you' },
    yesWord: { latin: 'Hya', script: 'হ্যাঁ', translit: 'Hyaa', english: 'Yes' },
    introWords: ['Amar', 'naam', 'Arjun'],
    introSentence: 'Amar naam Arjun',
    dish: { latin: 'Roshogolla', script: 'রসগোল্লা', translit: 'Ro-sho-gol-la', english: 'Sweet dish' },
    tea: { latin: 'Cha', script: 'চা', translit: 'Chaa', english: 'Tea' },
    price: { latin: 'Eta koto?', script: 'এটা কত?', translit: 'Eh-ta ko-to', english: 'How much is this?' },
    teaSentenceWords: ['Ami', 'cha', 'chai'],
    teaSentence: 'Ami cha chai',
    celebration: { latin: 'Shubho Durga Pujo', script: 'শুভ দুর্গাপূজা', translit: 'Shu-bho dur-ga pu-jo', english: 'Festival wishes' },
    culture: { latin: 'Adda', script: 'আড্ডা', translit: 'Ad-da', english: 'Cultural gem' },
    slang: { latin: 'Darun', script: 'দারুণ', translit: 'Da-run', english: 'Awesome!' },
    celebrateWords: ['Shubho', 'Pujo'],
    celebrateSentence: 'Shubho Pujo',
  },
  {
    code: 'telugu',
    unitTitles: ['ప్రారంభం', 'రోజువారీ', 'సంస్కృతి'],
    lessonTitles: ['అభివాదాలు', 'రుచులు', 'సాంస్కృతిక మాణిక్యాలు'],
    greeting: { latin: 'Namaskaram', script: 'నమస్కారం', translit: 'Na-ma-ska-ram', english: 'Hello' },
    thanks: { latin: 'Dhanyavadalu', script: 'ధన్యవాదాలు', translit: 'Dhan-ya-vaa-da-lu', english: 'Thank you' },
    yesWord: { latin: 'Avunu', script: 'అవును', translit: 'A-vu-nu', english: 'Yes' },
    introWords: ['Naa', 'peru', 'Arjun'],
    introSentence: 'Naa peru Arjun',
    dish: { latin: 'Pulihora', script: 'పులిహోర', translit: 'Pu-li-ho-ra', english: 'Street food / dish' },
    tea: { latin: 'Chai', script: 'చాయ్', translit: 'Chaai', english: 'Tea' },
    price: { latin: 'Idi entha?', script: 'ఇది ఎంత?', translit: 'I-di en-tha', english: 'How much is this?' },
    teaSentenceWords: ['Naaku', 'chai', 'kaavali'],
    teaSentence: 'Naaku chai kaavali',
    celebration: { latin: 'Sankranti subhakankshalu', script: 'సంక్రాంతి శుభాకాంక్షలు', translit: 'San-kraan-ti shu-bha-kan-ksha-lu', english: 'Festival wishes' },
    culture: { latin: 'Kuchipudi', script: 'కూచిపూడి', translit: 'Koo-chi-poo-di', english: 'Cultural gem' },
    slang: { latin: 'Bagundi', script: 'బాగుంది', translit: 'Baa-gun-di', english: 'Awesome!' },
    celebrateWords: ['Sankranti', 'subhakankshalu'],
    celebrateSentence: 'Sankranti subhakankshalu',
  },
  {
    code: 'tamil',
    unitTitles: ['தொடக்கம்', 'தினசரி', 'கலாசாரம்'],
    lessonTitles: ['வாழ்த்துகள்', 'சுவைகள்', 'பண்பாட்டு முத்துகள்'],
    greeting: { latin: 'Vanakkam', script: 'வணக்கம்', translit: 'Va-na-k-kam', english: 'Hello' },
    thanks: { latin: 'Nandri', script: 'நன்றி', translit: 'Nan-dri', english: 'Thank you' },
    yesWord: { latin: 'Aam', script: 'ஆம்', translit: 'Aam', english: 'Yes' },
    introWords: ['En', 'peyar', 'Arjun'],
    introSentence: 'En peyar Arjun',
    dish: { latin: 'Idli', script: 'இட்லி', translit: 'Id-li', english: 'Street food / dish' },
    tea: { latin: 'Theneer', script: 'தேநீர்', translit: 'The-neer', english: 'Tea' },
    price: { latin: 'Ithu evvalavu?', script: 'இது எவ்வளவு?', translit: 'I-thu ev-va-la-vu', english: 'How much is this?' },
    teaSentenceWords: ['Enakku', 'theneer', 'venum'],
    teaSentence: 'Enakku theneer venum',
    celebration: { latin: 'Iniya Pongal vazhthukkal', script: 'இனிய பொங்கல் வாழ்த்துகள்', translit: 'I-ni-ya pon-gal vaazh-thu-k-kal', english: 'Festival wishes' },
    culture: { latin: 'Kolam', script: 'கோலம்', translit: 'Ko-lam', english: 'Cultural gem' },
    slang: { latin: 'Semma', script: 'செம்ம', translit: 'Sem-ma', english: 'Awesome!' },
    celebrateWords: ['Iniya', 'Pongal', 'vazhthukkal'],
    celebrateSentence: 'Iniya Pongal vazhthukkal',
  },
  {
    code: 'marathi',
    unitTitles: ['सुरुवात', 'दैनंदिन', 'संस्कृती'],
    lessonTitles: ['अभिवादन', 'चविष्ट वाट', 'सांस्कृतिक रत्ने'],
    greeting: { latin: 'Namaskar', script: 'नमस्कार', translit: 'Na-mas-kaar', english: 'Hello' },
    thanks: { latin: 'Dhanyavaad', script: 'धन्यवाद', translit: 'Dhan-ya-vaad', english: 'Thank you' },
    yesWord: { latin: 'Ho', script: 'हो', translit: 'Ho', english: 'Yes' },
    introWords: ['Majhe', 'nav', 'Arjun', 'aahe'],
    introSentence: 'Majhe nav Arjun aahe',
    dish: { latin: 'Puran Poli', script: 'पुरणपोळी', translit: 'Pu-ran po-li', english: 'Street food / dish' },
    tea: { latin: 'Chaha', script: 'चहा', translit: 'Cha-ha', english: 'Tea' },
    price: { latin: 'He kiti?', script: 'हे किती?', translit: 'He ki-ti', english: 'How much is this?' },
    teaSentenceWords: ['Mala', 'chaha', 'hava'],
    teaSentence: 'Mala chaha hava',
    celebration: { latin: 'Ganpati Bappa Morya', script: 'गणपती बाप्पा मोरया', translit: 'Gan-pa-ti bap-pa mo-rya', english: 'Festival wishes' },
    culture: { latin: 'Lavani', script: 'लावणी', translit: 'La-va-ni', english: 'Cultural gem' },
    slang: { latin: 'Jhakaas', script: 'झकास', translit: 'Jha-kaas', english: 'Awesome!' },
    celebrateWords: ['Ganpati', 'Bappa', 'Morya'],
    celebrateSentence: 'Ganpati Bappa Morya',
  },
  {
    code: 'gujarati',
    unitTitles: ['શરૂઆત', 'દરરોજ', 'સંસ્કૃતિ'],
    lessonTitles: ['અભિવાદન', 'સ્વાદ', 'સાંસ્કૃતિક રત્નો'],
    greeting: { latin: 'Namaste', script: 'નમસ્તે', translit: 'Na-mas-te', english: 'Hello' },
    thanks: { latin: 'Aabhar', script: 'આભાર', translit: 'Aa-bhaar', english: 'Thank you' },
    yesWord: { latin: 'Haan', script: 'હા', translit: 'Haa', english: 'Yes' },
    introWords: ['Maru', 'naam', 'Arjun', 'che'],
    introSentence: 'Maru naam Arjun che',
    dish: { latin: 'Dhokla', script: 'ઢોકળા', translit: 'Dho-kla', english: 'Street food / dish' },
    tea: { latin: 'Cha', script: 'ચા', translit: 'Chaa', english: 'Tea' },
    price: { latin: 'Aa ketlu?', script: 'આ કેટલું?', translit: 'Aa ket-lu', english: 'How much is this?' },
    teaSentenceWords: ['Mane', 'cha', 'joie'],
    teaSentence: 'Mane cha joie',
    celebration: { latin: 'Shubh Uttarayan', script: 'શુભ ઉત્તરાયણ', translit: 'Shubh ut-ta-ra-yan', english: 'Festival wishes' },
    culture: { latin: 'Garba', script: 'ગરબા', translit: 'Gar-baa', english: 'Cultural gem' },
    slang: { latin: 'Majama', script: 'મજામાં', translit: 'Ma-ja-maa', english: 'Awesome!' },
    celebrateWords: ['Shubh', 'Uttarayan'],
    celebrateSentence: 'Shubh Uttarayan',
  },
  {
    code: 'kannada',
    unitTitles: ['ಆರಂಭ', 'ದಿನನಿತ್ಯ', 'ಸಂಸ್ಕೃತಿ'],
    lessonTitles: ['ನಮನಗಳು', 'ರುಚಿಗಳು', 'ಸಾಂಸ್ಕೃತಿಕ ರತ್ನಗಳು'],
    greeting: { latin: 'Namaskara', script: 'ನಮಸ್ಕಾರ', translit: 'Na-mas-ka-ra', english: 'Hello' },
    thanks: { latin: 'Dhanyavadagalu', script: 'ಧನ್ಯವಾದಗಳು', translit: 'Dhan-ya-vaa-da-ga-lu', english: 'Thank you' },
    yesWord: { latin: 'Haudu', script: 'ಹೌದು', translit: 'Hau-du', english: 'Yes' },
    introWords: ['Nanna', 'hesaru', 'Arjun'],
    introSentence: 'Nanna hesaru Arjun',
    dish: { latin: 'Bisi Bele Bath', script: 'ಬಿಸಿ ಬೆಳೆ ಬಾತ್', translit: 'Bi-si be-le baath', english: 'Street food / dish' },
    tea: { latin: 'Chaha', script: 'ಚಹಾ', translit: 'Cha-haa', english: 'Tea' },
    price: { latin: 'Idu eshtu?', script: 'ಇದು ಎಷ್ಟು?', translit: 'I-du esh-tu', english: 'How much is this?' },
    teaSentenceWords: ['Nanage', 'chaha', 'beku'],
    teaSentence: 'Nanage chaha beku',
    celebration: { latin: 'Dasara shubhashayagalu', script: 'ದಸರಾ ಶುಭಾಶಯಗಳು', translit: 'Da-sa-ra shu-bha-sha-ya-ga-lu', english: 'Festival wishes' },
    culture: { latin: 'Yakshagana', script: 'ಯಕ್ಷಗಾನ', translit: 'Yak-sha-ga-na', english: 'Cultural gem' },
    slang: { latin: 'Super', script: 'ಸೂಪರ್', translit: 'Soo-par', english: 'Awesome!' },
    celebrateWords: ['Dasara', 'shubhashayagalu'],
    celebrateSentence: 'Dasara shubhashayagalu',
  },
  {
    code: 'malayalam',
    unitTitles: ['തുടക്കം', 'ദൈനംദിനം', 'സംസ്കാരം'],
    lessonTitles: ['ആശംസകൾ', 'രുചികൾ', 'സാംസ്കാരിക മുത്തുകൾ'],
    greeting: { latin: 'Namaskaram', script: 'നമസ്കാരം', translit: 'Na-mas-ka-ram', english: 'Hello' },
    thanks: { latin: 'Nandi', script: 'നന്ദി', translit: 'Nan-di', english: 'Thank you' },
    yesWord: { latin: 'Athe', script: 'അതെ', translit: 'A-the', english: 'Yes' },
    introWords: ['Ente', 'peru', 'Arjun', 'aanu'],
    introSentence: 'Ente peru Arjun aanu',
    dish: { latin: 'Appam', script: 'അപ്പം', translit: 'Ap-pam', english: 'Street food / dish' },
    tea: { latin: 'Chaya', script: 'ചായ', translit: 'Chaa-ya', english: 'Tea' },
    price: { latin: 'Ithu ethra?', script: 'ഇത് എത്ര?', translit: 'I-thu eth-ra', english: 'How much is this?' },
    teaSentenceWords: ['Enikku', 'chaya', 'venam'],
    teaSentence: 'Enikku chaya venam',
    celebration: { latin: 'Onam ashamsakal', script: 'ഓണം ആശംസകൾ', translit: 'O-nam a-sham-sa-kal', english: 'Festival wishes' },
    culture: { latin: 'Kathakali', script: 'കഥകളി', translit: 'Ka-tha-ka-li', english: 'Cultural gem' },
    slang: { latin: 'Poli', script: 'പൊളി', translit: 'Po-li', english: 'Awesome!' },
    celebrateWords: ['Onam', 'ashamsakal'],
    celebrateSentence: 'Onam ashamsakal',
  },
  {
    code: 'punjabi',
    unitTitles: ['ਸ਼ੁਰੂਆਤ', 'ਰੋਜ਼ਾਨਾ', 'ਸਭਿਆਚਾਰ'],
    lessonTitles: ['ਸਤਿਕਾਰ', 'ਸੁਆਦ', 'ਸੱਭਿਆਚਾਰਕ ਹੀਰੇ'],
    greeting: { latin: 'Sat Sri Akaal', script: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', translit: 'Sat sree a-kaal', english: 'Hello' },
    thanks: { latin: 'Dhannvaad', script: 'ਧੰਨਵਾਦ', translit: 'Dhan-n-vaad', english: 'Thank you' },
    yesWord: { latin: 'Haan', script: 'ਹਾਂ', translit: 'Haan', english: 'Yes' },
    introWords: ['Mera', 'naa', 'Arjun', 'hai'],
    introSentence: 'Mera naa Arjun hai',
    dish: { latin: 'Sarson da saag', script: 'ਸਰਸੋਂ ਦਾ ਸਾਗ', translit: 'Sar-son da saag', english: 'Street food / dish' },
    tea: { latin: 'Chaa', script: 'ਚਾਹ', translit: 'Chaa', english: 'Tea' },
    price: { latin: 'Eh kinna?', script: 'ਇਹ ਕਿੰਨਾ?', translit: 'Eh kin-na', english: 'How much is this?' },
    teaSentenceWords: ['Mainu', 'chaa', 'chaidi'],
    teaSentence: 'Mainu chaa chaidi',
    celebration: { latin: 'Vaisakhi mubarak', script: 'ਵਿਸਾਖੀ ਮੁਬਾਰਕ', translit: 'Vai-sa-khi mu-ba-rak', english: 'Festival wishes' },
    culture: { latin: 'Giddha', script: 'ਗਿੱਧਾ', translit: 'Gid-dha', english: 'Cultural gem' },
    slang: { latin: 'Vadhiya', script: 'ਵਧੀਆ', translit: 'Va-dhi-ya', english: 'Awesome!' },
    celebrateWords: ['Vaisakhi', 'mubarak'],
    celebrateSentence: 'Vaisakhi mubarak',
  },
  {
    code: 'odia',
    unitTitles: ['ଆରମ୍ଭ', 'ଦୈନନ୍ଦିନ', 'ସଂସ୍କୃତି'],
    lessonTitles: ['ଅଭିବାଦନ', 'ସ୍ୱାଦ', 'ସାଂସ୍କୃତିକ ରତ୍ନ'],
    greeting: { latin: 'Namaskara', script: 'ନମସ୍କାର', translit: 'Na-mas-ka-ra', english: 'Hello' },
    thanks: { latin: 'Dhanyabad', script: 'ଧନ୍ୟବାଦ', translit: 'Dhan-ya-baad', english: 'Thank you' },
    yesWord: { latin: 'Han', script: 'ହଁ', translit: 'Haan', english: 'Yes' },
    introWords: ['Mora', 'naa', 'Arjun'],
    introSentence: 'Mora naa Arjun',
    dish: { latin: 'Pakhala', script: 'ପଖାଳା', translit: 'Pa-khaa-la', english: 'Street food / dish' },
    tea: { latin: 'Cha', script: 'ଚା', translit: 'Chaa', english: 'Tea' },
    price: { latin: 'Eha kete?', script: 'ଏହା କେତେ?', translit: 'E-ha ke-te', english: 'How much is this?' },
    teaSentenceWords: ['Mate', 'cha', 'darkar'],
    teaSentence: 'Mate cha darkar',
    celebration: { latin: 'Rathyatra subhechha', script: 'ରଥଯାତ୍ରା ଶୁଭେଚ୍ଛା', translit: 'Rath-ya-tra shu-bhech-ha', english: 'Festival wishes' },
    culture: { latin: 'Odissi', script: 'ଓଡ଼ିଶୀ', translit: 'O-di-si', english: 'Cultural gem' },
    slang: { latin: 'Mast', script: 'ମସ୍ତ', translit: 'Mas-ta', english: 'Awesome!' },
    celebrateWords: ['Rathyatra', 'subhechha'],
    celebrateSentence: 'Rathyatra subhechha',
  },
  {
    code: 'urdu',
    unitTitles: ['آغاز', 'روزمرہ', 'ثقافت'],
    lessonTitles: ['سلام', 'ذائقے', 'ثقافتی نگینے'],
    greeting: { latin: 'Salaam', script: 'سلام', translit: 'Sa-laam', english: 'Hello' },
    thanks: { latin: 'Shukriya', script: 'شکریہ', translit: 'Shu-kri-ya', english: 'Thank you' },
    yesWord: { latin: 'Haan', script: 'ہاں', translit: 'Haan', english: 'Yes' },
    introWords: ['Mera', 'naam', 'Arjun', 'hai'],
    introSentence: 'Mera naam Arjun hai',
    dish: { latin: 'Biryani', script: 'بریانی', translit: 'Bir-ya-ni', english: 'Street food / dish' },
    tea: { latin: 'Chai', script: 'چائے', translit: 'Chaa-e', english: 'Tea' },
    price: { latin: 'Yeh kitne ka hai?', script: 'یہ کتنے کا ہے؟', translit: 'Yeh kit-ne ka hai', english: 'How much is this?' },
    teaSentenceWords: ['Mujhe', 'chai', 'chahiye'],
    teaSentence: 'Mujhe chai chahiye',
    celebration: { latin: 'Eid Mubarak', script: 'عید مبارک', translit: 'Eid mu-ba-rak', english: 'Festival wishes' },
    culture: { latin: 'Ghazal', script: 'غزل', translit: 'Gha-zal', english: 'Cultural gem' },
    slang: { latin: 'Zabardast', script: 'زبردست', translit: 'Za-bar-dast', english: 'Awesome!' },
    celebrateWords: ['Eid', 'Mubarak'],
    celebrateSentence: 'Eid Mubarak',
  },
  {
    code: 'indori',
    unitTitles: ['शुरुआत', 'रोज़मर्रा', 'इंदौरी रंग'],
    lessonTitles: ['राम राम', 'खाऊ-पीऊ', 'लोकल ठाठ'],
    greeting: { latin: 'Ram Ram', script: 'राम राम', translit: 'Raam raam', english: 'Hello' },
    thanks: { latin: 'Shukriya bhia', script: 'शुक्रिया भिया', translit: 'Shuk-ri-ya bhi-ya', english: 'Thank you' },
    yesWord: { latin: 'Hao', script: 'हाओ', translit: 'Hao', english: 'Yes' },
    introWords: ['Mera', 'naam', 'Arjun', 'hai'],
    introSentence: 'Mera naam Arjun hai',
    dish: { latin: 'Poha Jalebi', script: 'पोहे जलेबी', translit: 'Po-ha ja-le-bi', english: 'Street food / dish' },
    tea: { latin: 'Chai', script: 'चाय', translit: 'Chaai', english: 'Tea' },
    price: { latin: 'Kitna bhia?', script: 'कितना भिया?', translit: 'Kit-na bhi-ya', english: 'How much is this?' },
    teaSentenceWords: ['Mereko', 'chai', 'chahiye'],
    teaSentence: 'Mereko chai chahiye',
    celebration: { latin: 'Rangpanchami mubarak', script: 'रंगपंचमी मुबारक', translit: 'Rang-pan-cha-mi mu-ba-rak', english: 'Festival wishes' },
    culture: { latin: 'Sarafa', script: 'सराफा', translit: 'Sa-ra-fa', english: 'Cultural gem' },
    slang: { latin: 'Badiya', script: 'बढ़िया', translit: 'Ba-dhi-ya', english: 'Awesome!' },
    celebrateWords: ['Rangpanchami', 'mubarak'],
    celebrateSentence: 'Rangpanchami mubarak',
  },
];

const GENERATED_CURRICULA: Record<string, Unit[]> = STARTER_TRACKS.reduce<Record<string, Unit[]>>((acc, track) => {
  acc[track.code] = createStarterCurriculum(track);
  return acc;
}, {
  [DEFAULT_LANGUAGE_CODE]: HINDI_CURRICULUM,
});

export { BADGES, LEADERBOARD_MOCK, HINDI_CURRICULUM as CURRICULUM };

export function getCurriculumForLanguage(languageCode?: string | null) {
  return GENERATED_CURRICULA[languageCode ?? DEFAULT_LANGUAGE_CODE] ?? HINDI_CURRICULUM;
}

export function getLessonById(lessonId: string, curriculum?: Unit[]): Lesson | null {
  const activeCurriculum = curriculum ?? HINDI_CURRICULUM;

  for (const unit of activeCurriculum) {
    for (const lesson of unit.lessons) {
      if (lesson.id === lessonId) {
        return lesson;
      }
    }
  }

  return null;
}

export function getUnitForLesson(lessonId: string, curriculum?: Unit[]): Unit | null {
  const activeCurriculum = curriculum ?? HINDI_CURRICULUM;

  for (const unit of activeCurriculum) {
    if (unit.lessons.some((lesson) => lesson.id === lessonId)) {
      return unit;
    }
  }

  return null;
}

export function getCourseTotals(languageCode?: string | null) {
  const curriculum = getCurriculumForLanguage(languageCode);
  const lessons = curriculum.flatMap((unit) => unit.lessons);

  return {
    totalUnits: curriculum.length,
    totalLessons: lessons.length,
    totalExercises: lessons.reduce((count, lesson) => count + lesson.exercises.length, 0),
  };
}

export function getLanguageCourseSummary(languageCode?: string | null) {
  const language = LANGUAGES.find((item) => item.code === languageCode) ?? LANGUAGES[0];
  const totals = getCourseTotals(language.code);

  return {
    language,
    ...totals,
  };
}
