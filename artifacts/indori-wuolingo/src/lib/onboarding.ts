export type ProficiencyLevel = "beginner" | "intermediate" | "advanced";

export interface OnboardingProfile {
  name: string;
  targetLanguage: string;
  dailyGoalMinutes: number;
  proficiency: ProficiencyLevel;
  completedAt?: string;
}

export const ONBOARDING_STORAGE_KEY = "iw_web_onboarding_profile";

export const LANGUAGES = [
  { code: "hindi", name: "Hindi", script: "Hindi", speakers: "600M+ speakers" },
  { code: "marathi", name: "Marathi", script: "Marathi", speakers: "83M speakers", comingSoon: true },
  { code: "bengali", name: "Bengali", script: "Bengali", speakers: "230M speakers", comingSoon: true },
  { code: "tamil", name: "Tamil", script: "Tamil", speakers: "75M speakers", comingSoon: true },
  { code: "telugu", name: "Telugu", script: "Telugu", speakers: "82M speakers", comingSoon: true },
  { code: "kannada", name: "Kannada", script: "Kannada", speakers: "44M speakers", comingSoon: true },
  { code: "gujarati", name: "Gujarati", script: "Gujarati", speakers: "55M speakers", comingSoon: true },
] as const;

export const GOALS = [
  { minutes: 5, label: "Casual", description: "5 min / day" },
  { minutes: 10, label: "Regular", description: "10 min / day" },
  { minutes: 15, label: "Serious", description: "15 min / day" },
  { minutes: 20, label: "Intense", description: "20 min / day" },
] as const;

export const PROFICIENCY_LEVELS = [
  { level: "beginner" as const, label: "Complete Beginner", description: "Never studied this language" },
  { level: "intermediate" as const, label: "Some Knowledge", description: "Know a few words or phrases" },
  { level: "advanced" as const, label: "Conversational", description: "Can hold basic conversations" },
] as const;

const defaultProfile: OnboardingProfile = {
  name: "",
  targetLanguage: "hindi",
  dailyGoalMinutes: 10,
  proficiency: "beginner",
};

export function readOnboardingProfile(): OnboardingProfile {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  const rawValue = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
  if (!rawValue) {
    return defaultProfile;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<OnboardingProfile>;
    return {
      ...defaultProfile,
      ...parsed,
      name: typeof parsed.name === "string" ? parsed.name : "",
      targetLanguage: typeof parsed.targetLanguage === "string" ? parsed.targetLanguage : "hindi",
      dailyGoalMinutes:
        typeof parsed.dailyGoalMinutes === "number" ? parsed.dailyGoalMinutes : 10,
      proficiency:
        parsed.proficiency === "intermediate" || parsed.proficiency === "advanced"
          ? parsed.proficiency
          : "beginner",
    };
  } catch {
    return defaultProfile;
  }
}

export function saveOnboardingProfile(profile: OnboardingProfile): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(profile));
}
