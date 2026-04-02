// ─── Column Colors ───────────────────────────────────────────────

export interface ColumnColors {
  text: string;
  bg: string;
  border: string;
  ring: string;
}

// ─── Status Colors ───────────────────────────────────────────────

export interface StatusColors {
  ocrPending: string;
  ocrComplete: string;
  manual: string;
}

// ─── Theme Definition ────────────────────────────────────────────

export interface AppTheme {
  name: string;

  brand: string;
  brandBg: string;

  surface: string;
  surfaceMuted: string;
  surfaceOverlay: string;

  text: {
    primary: string;
    secondary: string;
    muted: string;
    dimmed: string;
    inverse: string;
  };

  border: {
    default: string;
    muted: string;
    input: string;
  };

  interactive: {
    focus: string;
    dragOver: string;
    hoverBg: string;
  };

  spacing: {
    card: string;
    column: string;
    section: string;
    page: string;
    gap: string;
  };

  radius: {
    card: string;
    column: string;
    badge: string;
    button: string;
  };

  shadow: {
    card: string;
    cardHover: string;
    overlay: string;
  };

  fontSize: {
    hero: string;
    heading: string;
    subheading: string;
    columnTitle: string;
    body: string;
    caption: string;
    label: string;
  };

  status: StatusColors;

  columns: [ColumnColors, ColumnColors, ColumnColors, ColumnColors, ColumnColors];
}

// ─── Ocean Theme (Default) ──────────────────────────────────────

export const oceanTheme: AppTheme = {
  name: "Ocean",

  brand: "text-blue-700",
  brandBg: "bg-blue-50",

  surface: "bg-white",
  surfaceMuted: "bg-gray-50",
  surfaceOverlay: "bg-gradient-to-br from-blue-50 via-white to-teal-50",

  text: {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    muted: "text-gray-500",
    dimmed: "text-gray-400",
    inverse: "text-white",
  },

  border: {
    default: "border-gray-200",
    muted: "border-gray-200/50",
    input: "border-gray-300",
  },

  interactive: {
    focus: "focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
    dragOver: "ring-2 ring-blue-400 ring-offset-2",
    hoverBg: "hover:bg-gray-50",
  },

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

  status: {
    ocrPending: "border-yellow-400 text-yellow-700 bg-yellow-50",
    ocrComplete: "border-green-400 text-green-700 bg-green-50",
    manual: "border-blue-400 text-blue-700 bg-blue-50",
  },

  columns: [
    { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-300", ring: "ring-blue-400" },
    { text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-300", ring: "ring-orange-400" },
    { text: "text-green-700", bg: "bg-green-50", border: "border-green-300", ring: "ring-green-400" },
    { text: "text-purple-700", bg: "bg-purple-50", border: "border-purple-300", ring: "ring-purple-400" },
    { text: "text-teal-700", bg: "bg-teal-50", border: "border-teal-300", ring: "ring-teal-400" },
  ],
};

// ─── Sunset Theme ───────────────────────────────────────────────

export const sunsetTheme: AppTheme = {
  name: "Sunset",

  brand: "text-rose-600",
  brandBg: "bg-rose-50",

  surface: "bg-white",
  surfaceMuted: "bg-amber-50/50",
  surfaceOverlay: "bg-gradient-to-br from-rose-50 via-white to-amber-50",

  text: {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    muted: "text-gray-500",
    dimmed: "text-gray-400",
    inverse: "text-white",
  },

  border: {
    default: "border-gray-200",
    muted: "border-gray-200/50",
    input: "border-gray-300",
  },

  interactive: {
    focus: "focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2",
    dragOver: "ring-2 ring-rose-400 ring-offset-2",
    hoverBg: "hover:bg-rose-50/50",
  },

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

  status: {
    ocrPending: "border-amber-400 text-amber-700 bg-amber-50",
    ocrComplete: "border-emerald-400 text-emerald-700 bg-emerald-50",
    manual: "border-rose-400 text-rose-700 bg-rose-50",
  },

  columns: [
    { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-300", ring: "ring-rose-400" },
    { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300", ring: "ring-amber-400" },
    { text: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-300", ring: "ring-yellow-400" },
    { text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-300", ring: "ring-orange-400" },
    { text: "text-red-700", bg: "bg-red-50", border: "border-red-300", ring: "ring-red-400" },
  ],
};

// ─── Forest Theme ───────────────────────────────────────────────

export const forestTheme: AppTheme = {
  name: "Forest",

  brand: "text-emerald-700",
  brandBg: "bg-emerald-50",

  surface: "bg-white",
  surfaceMuted: "bg-stone-50",
  surfaceOverlay: "bg-gradient-to-br from-emerald-50 via-white to-lime-50",

  text: {
    primary: "text-stone-900",
    secondary: "text-stone-600",
    muted: "text-stone-500",
    dimmed: "text-stone-400",
    inverse: "text-white",
  },

  border: {
    default: "border-stone-200",
    muted: "border-stone-200/50",
    input: "border-stone-300",
  },

  interactive: {
    focus: "focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
    dragOver: "ring-2 ring-emerald-400 ring-offset-2",
    hoverBg: "hover:bg-emerald-50/50",
  },

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

  status: {
    ocrPending: "border-yellow-400 text-yellow-700 bg-yellow-50",
    ocrComplete: "border-emerald-400 text-emerald-700 bg-emerald-50",
    manual: "border-teal-400 text-teal-700 bg-teal-50",
  },

  columns: [
    { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300", ring: "ring-emerald-400" },
    { text: "text-lime-700", bg: "bg-lime-50", border: "border-lime-300", ring: "ring-lime-400" },
    { text: "text-green-700", bg: "bg-green-50", border: "border-green-300", ring: "ring-green-400" },
    { text: "text-teal-700", bg: "bg-teal-50", border: "border-teal-300", ring: "ring-teal-400" },
    { text: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-300", ring: "ring-cyan-400" },
  ],
};

// ─── Slate Theme (Minimal) ──────────────────────────────────────

export const slateTheme: AppTheme = {
  name: "Slate",

  brand: "text-slate-800",
  brandBg: "bg-slate-100",

  surface: "bg-white",
  surfaceMuted: "bg-slate-50",
  surfaceOverlay: "bg-gradient-to-br from-slate-50 via-white to-zinc-50",

  text: {
    primary: "text-slate-900",
    secondary: "text-slate-600",
    muted: "text-slate-500",
    dimmed: "text-slate-400",
    inverse: "text-white",
  },

  border: {
    default: "border-slate-200",
    muted: "border-slate-200/50",
    input: "border-slate-300",
  },

  interactive: {
    focus: "focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
    dragOver: "ring-2 ring-slate-400 ring-offset-2",
    hoverBg: "hover:bg-slate-50",
  },

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

  status: {
    ocrPending: "border-amber-400 text-amber-700 bg-amber-50",
    ocrComplete: "border-green-400 text-green-700 bg-green-50",
    manual: "border-slate-400 text-slate-700 bg-slate-50",
  },

  columns: [
    { text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-300", ring: "ring-sky-400" },
    { text: "text-violet-700", bg: "bg-violet-50", border: "border-violet-300", ring: "ring-violet-400" },
    { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300", ring: "ring-emerald-400" },
    { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300", ring: "ring-amber-400" },
    { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-300", ring: "ring-rose-400" },
  ],
};

// ─── Atol Theme (Green/Teal, inspired by Atol stores) ───────────

export const atolTheme: AppTheme = {
  name: "Atol",

  brand: "text-teal-600",
  brandBg: "bg-teal-50",

  surface: "bg-white",
  surfaceMuted: "bg-teal-50/50",
  surfaceOverlay: "bg-gradient-to-br from-teal-50 via-white to-emerald-50",

  text: {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    muted: "text-gray-500",
    dimmed: "text-gray-400",
    inverse: "text-white",
  },

  border: {
    default: "border-gray-200",
    muted: "border-gray-200/50",
    input: "border-gray-300",
  },

  interactive: {
    focus: "focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2",
    dragOver: "ring-2 ring-teal-400 ring-offset-2",
    hoverBg: "hover:bg-teal-50/50",
  },

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

  status: {
    ocrPending: "border-yellow-400 text-yellow-700 bg-yellow-50",
    ocrComplete: "border-teal-400 text-teal-700 bg-teal-50",
    manual: "border-sky-400 text-sky-700 bg-sky-50",
  },

  columns: [
    { text: "text-teal-700", bg: "bg-teal-50", border: "border-teal-300", ring: "ring-teal-400" },
    { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300", ring: "ring-emerald-400" },
    { text: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-300", ring: "ring-cyan-400" },
    { text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-300", ring: "ring-sky-400" },
    { text: "text-green-700", bg: "bg-green-50", border: "border-green-300", ring: "ring-green-400" },
  ],
};

// ─── Midnight Theme (Dark) ──────────────────────────────────────

export const midnightTheme: AppTheme = {
  name: "Midnight",

  brand: "text-blue-400",
  brandBg: "bg-blue-950",

  surface: "bg-slate-800",
  surfaceMuted: "bg-slate-900",
  surfaceOverlay: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",

  text: {
    primary: "text-slate-100",
    secondary: "text-slate-300",
    muted: "text-slate-400",
    dimmed: "text-slate-500",
    inverse: "text-slate-900",
  },

  border: {
    default: "border-slate-700",
    muted: "border-slate-700/50",
    input: "border-slate-600",
  },

  interactive: {
    focus: "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800",
    dragOver: "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-800",
    hoverBg: "hover:bg-slate-700",
  },

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
    card: "shadow-sm shadow-black/20",
    cardHover: "shadow-md shadow-black/30",
    overlay: "shadow-xl shadow-black/40",
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

  status: {
    ocrPending: "border-yellow-500/50 text-yellow-400 bg-yellow-950/30",
    ocrComplete: "border-green-500/50 text-green-400 bg-green-950/30",
    manual: "border-blue-500/50 text-blue-400 bg-blue-950/30",
  },

  columns: [
    { text: "text-blue-400", bg: "bg-blue-950/30", border: "border-blue-800", ring: "ring-blue-500" },
    { text: "text-orange-400", bg: "bg-orange-950/30", border: "border-orange-800", ring: "ring-orange-500" },
    { text: "text-green-400", bg: "bg-green-950/30", border: "border-green-800", ring: "ring-green-500" },
    { text: "text-purple-400", bg: "bg-purple-950/30", border: "border-purple-800", ring: "ring-purple-500" },
    { text: "text-teal-400", bg: "bg-teal-950/30", border: "border-teal-800", ring: "ring-teal-500" },
  ],
};

// ─── All themes ─────────────────────────────────────────────────

export const themes = {
  ocean: oceanTheme,
  sunset: sunsetTheme,
  forest: forestTheme,
  slate: slateTheme,
  atol: atolTheme,
  midnight: midnightTheme,
} as const;

export type ThemeKey = keyof typeof themes;

export const DEFAULT_THEME: ThemeKey = "ocean";
