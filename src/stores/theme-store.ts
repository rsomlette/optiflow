"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ThemeKey, type AppTheme, themes, DEFAULT_THEME } from "@/lib/theme";

interface ThemeState {
  themeKey: ThemeKey;
  setTheme: (key: ThemeKey) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeKey: DEFAULT_THEME,
      setTheme: (key) => set({ themeKey: key }),
    }),
    { name: "optiflow-theme" }
  )
);

export function useTheme(): AppTheme {
  const key = useThemeStore((s) => s.themeKey);
  return themes[key];
}
