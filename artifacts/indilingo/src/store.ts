import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  userId: number | null;
  selectedLanguageId: number | null;
  setUserId: (id: number | null) => void;
  setSelectedLanguageId: (id: number | null) => void;
  clearState: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      userId: null,
      selectedLanguageId: null,
      setUserId: (id) => set({ userId: id }),
      setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
      clearState: () => set({ userId: null, selectedLanguageId: null }),
    }),
    {
      name: 'indilingo-storage',
    }
  )
);
