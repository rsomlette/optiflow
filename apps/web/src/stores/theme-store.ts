"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_THEME } from "@/lib/theme";

interface ThemeState {
  themeKey: string;
  setTheme: (key: string) => void;
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

export function useThemeHydrated(): boolean {
  return useSyncExternalStore(
    useThemeStore.persist.onFinishHydration,
    useThemeStore.persist.hasHydrated,
    () => false,
  );
}
