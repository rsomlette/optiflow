"use client";

import { themes, type ThemeKey } from "@/lib/theme";
import { useThemeStore } from "@/stores/theme-store";
import { NativeSelect } from "@/components/ui/native-select";

const themeOptions = Object.entries(themes).map(([key, theme]) => ({
  value: key,
  label: theme.name,
}));

export function ThemeSwitcher() {
  const themeKey = useThemeStore((s) => s.themeKey);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <NativeSelect
      value={themeKey}
      onChange={(e) => setTheme(e.target.value as ThemeKey)}
      options={themeOptions}
      className="w-28 h-8 text-xs"
    />
  );
}
