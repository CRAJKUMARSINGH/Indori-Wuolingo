import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface UserProfile {
  name: string;
  dailyGoalMinutes: number;
  targetLanguage: string;
  nativeLanguage: string;
  onboardingComplete: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  dailyGoalMinutes: 10,
  targetLanguage: "Hindi",
  nativeLanguage: "English",
  onboardingComplete: false,
};

interface UserContextValue {
  profile: UserProfile;
  setProfile: (p: UserProfile) => Promise<void>;
  completeOnboarding: (name: string, goalMinutes: number) => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

const STORAGE_KEY = "@wuolingo_user";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProfileState(JSON.parse(stored));
        }
      } catch {}
      setIsLoading(false);
    })();
  }, []);

  const setProfile = async (p: UserProfile) => {
    setProfileState(p);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {}
  };

  const completeOnboarding = async (name: string, goalMinutes: number) => {
    const updated: UserProfile = {
      ...profile,
      name,
      dailyGoalMinutes: goalMinutes,
      onboardingComplete: true,
    };
    await setProfile(updated);
  };

  return (
    <UserContext.Provider value={{ profile, setProfile, completeOnboarding, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
