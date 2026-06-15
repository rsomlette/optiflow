"use client";

import { themes } from "@/lib/theme";
import { useThemeStore } from "@/stores/theme-store";
import { NativeSelect } from "@/components/ui/native-select";

const themeOptions = themes.map((t) => ({
  value: t.key,
  label: t.name,
}));

export function ThemeSwitcher() {
  const themeKey = useThemeStore((s) => s.themeKey);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <NativeSelect
      value={themeKey}
      onChange={(e) => setTheme(e.target.value)}
      options={themeOptions}
      className="w-28 h-8 text-xs"
    />
  );
}
