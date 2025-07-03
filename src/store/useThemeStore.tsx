import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface ThemeState {
  theme: "light" | "dark";
  user: User | null;
  accessToken: string | null;
}

interface ThemeActions {
  toggleTheme: () => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "dark",
      user: null,
      accessToken: null,

      // Actions
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),

      setUser: (user) => set({ user }),

      setAccessToken: (token) => set({ accessToken: token }),

      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "dishdash",
    }
  )
);
