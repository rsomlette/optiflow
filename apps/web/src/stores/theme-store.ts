"use client";

import { useEffect, useState } from "react";
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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useThemeStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useThemeStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return unsub;
  }, []);

  return hydrated;
}
