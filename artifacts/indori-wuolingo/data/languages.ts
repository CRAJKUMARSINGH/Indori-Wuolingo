export interface LanguageMeta {
  code: string;
  name: string;
  script: string;
  flag: string;
  speakers: string;
  region: string;
  emoji: string;
  speechLocale: string;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'hindi', name: 'Hindi', script: 'हिंदी', flag: '🇮🇳', speakers: '600M+ speakers', region: 'Pan-India', emoji: '🪷', speechLocale: 'hi-IN' },
  { code: 'bengali', name: 'Bengali', script: 'বাংলা', flag: '🇮🇳', speakers: '230M speakers', region: 'West Bengal', emoji: '🌾', speechLocale: 'bn-IN' },
  { code: 'telugu', name: 'Telugu', script: 'తెలుగు', flag: '🇮🇳', speakers: '96M speakers', region: 'Andhra & Telangana', emoji: '🌶️', speechLocale: 'te-IN' },
  { code: 'tamil', name: 'Tamil', script: 'தமிழ்', flag: '🇮🇳', speakers: '75M speakers', region: 'Tamil Nadu', emoji: '🐘', speechLocale: 'ta-IN' },
  { code: 'marathi', name: 'Marathi', script: 'मराठी', flag: '🇮🇳', speakers: '83M speakers', region: 'Maharashtra', emoji: '🦁', speechLocale: 'mr-IN' },
  { code: 'gujarati', name: 'Gujarati', script: 'ગુજરાતી', flag: '🇮🇳', speakers: '55M speakers', region: 'Gujarat', emoji: '🪁', speechLocale: 'gu-IN' },
  { code: 'kannada', name: 'Kannada', script: 'ಕನ್ನಡ', flag: '🇮🇳', speakers: '44M speakers', region: 'Karnataka', emoji: '🌻', speechLocale: 'kn-IN' },
  { code: 'malayalam', name: 'Malayalam', script: 'മലയാളം', flag: '🇮🇳', speakers: '38M speakers', region: 'Kerala', emoji: '🌴', speechLocale: 'ml-IN' },
  { code: 'punjabi', name: 'Punjabi', script: 'ਪੰਜਾਬੀ', flag: '🇮🇳', speakers: '33M speakers', region: 'Punjab', emoji: '🎺', speechLocale: 'pa-IN' },
  { code: 'odia', name: 'Odia', script: 'ଓଡ଼ିଆ', flag: '🇮🇳', speakers: '37M speakers', region: 'Odisha', emoji: '🛕', speechLocale: 'or-IN' },
  { code: 'urdu', name: 'Urdu', script: 'اردو', flag: '🇮🇳', speakers: '70M+ speakers', region: 'Pan-India', emoji: '🌙', speechLocale: 'ur-IN' },
  { code: 'indori', name: 'Indori', script: 'इंदौरी', flag: '🇮🇳', speakers: 'Indore community', region: 'Indore, MP', emoji: '🏙️', speechLocale: 'hi-IN' },
];

export const DEFAULT_LANGUAGE_CODE = 'hindi';

export function getLanguageByCode(code?: string | null) {
  return LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0];
}
