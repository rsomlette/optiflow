// ─── Theme metadata ─────────────────────────────────────────────
// Colors are defined as CSS custom properties in globals.css
// per [data-theme="..."] selector. Components use Tailwind classes
// like bg-surface, text-brand, bg-col-1-bg, etc.
//
// This file defines non-color design tokens and theme names.

export interface AppTheme {
  name: string;
  key: string;
}

export const themes: AppTheme[] = [
  { name: "Ocean", key: "ocean" },
  { name: "Sunset", key: "sunset" },
  { name: "Forest", key: "forest" },
  { name: "Slate", key: "slate" },
  { name: "Atol", key: "atol" },
  { name: "Midnight", key: "midnight" },
];

export type ThemeKey = string;
export const DEFAULT_THEME = "ocean";

// ─── Non-color design tokens (shared across all themes) ─────────

export const tokens = {
  spacing: {
    card: "p-3",
    column: "p-2",
    section: "p-4",
    page: "px-6 py-4",
    gap: "gap-3",
  },

  radius: {
    card: "rounded-lg",
    column: "rounded-xl",
    badge: "rounded-full",
    button: "rounded-lg",
  },

  shadow: {
    card: "shadow-sm",
    cardHover: "shadow-md",
    overlay: "shadow-xl",
  },

  fontSize: {
    hero: "text-5xl font-bold tracking-tight",
    heading: "text-2xl font-bold",
    subheading: "text-lg font-semibold",
    columnTitle: "text-sm font-semibold",
    body: "text-sm",
    caption: "text-xs",
    label: "text-sm font-medium",
  },
} as const;

// ─── Column helpers ─────────────────────────────────────────────
// Static array so Tailwind JIT can find all class strings at scan time.

export const columnClasses = [
  { text: "text-col-1", bg: "bg-col-1-bg", border: "border-col-1-border", ring: "ring-col-1-ring" },
  { text: "text-col-2", bg: "bg-col-2-bg", border: "border-col-2-border", ring: "ring-col-2-ring" },
  { text: "text-col-3", bg: "bg-col-3-bg", border: "border-col-3-border", ring: "ring-col-3-ring" },
  { text: "text-col-4", bg: "bg-col-4-bg", border: "border-col-4-border", ring: "ring-col-4-ring" },
  { text: "text-col-5", bg: "bg-col-5-bg", border: "border-col-5-border", ring: "ring-col-5-ring" },
] as const;
