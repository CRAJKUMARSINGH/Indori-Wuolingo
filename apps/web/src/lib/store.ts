import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  userId: string | null;
  selectedLanguageId: string | null;
  setUserId: (id: string | null) => void;
  setSelectedLanguageId: (id: string | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      userId: null,
      selectedLanguageId: null,
      setUserId: (id) => set({ userId: id }),
      setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
    }),
    {
      name: 'indilingo-user-id',
    }
  )
);
