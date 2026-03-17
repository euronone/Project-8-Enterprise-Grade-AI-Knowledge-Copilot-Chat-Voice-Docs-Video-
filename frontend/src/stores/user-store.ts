import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserPreferences } from "@/types/user";

interface UserState {
  user: User | null;
  preferences: UserPreferences;
  setUser: (user: User | null) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  reset: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: "system",
  language: "en",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  notifications: {
    email: true,
    push: true,
    slack: false,
    inApp: true,
    digest: "realtime",
  },
  sidebarCollapsed: false,
  fontSize: "md",
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      preferences: defaultPreferences,
      setUser: (user) => set({ user }),
      updatePreferences: (prefs) =>
        set((s) => ({ preferences: { ...s.preferences, ...prefs } })),
      reset: () => set({ user: null, preferences: defaultPreferences }),
    }),
    { name: "kf-user-store", partialize: (s) => ({ preferences: s.preferences }) }
  )
);

