/**
 * This file exists solely so Tailwind's JIT scanner can find all classes
 * used in our dynamic theme tokens. Never import this at runtime.
 *
 * Every Tailwind class referenced in theme.ts MUST appear here as a
 * complete, static string.
 */

export const _safelist = [
  // ─── Brand ─────────────────────────────────────────────
  "text-blue-700", "bg-blue-50",
  "text-rose-600", "bg-rose-50",
  "text-emerald-700", "bg-emerald-50",
  "text-slate-800", "bg-slate-100",
  "text-teal-600", "bg-teal-50",
  "text-blue-400", "bg-blue-950",

  // ─── Surfaces ──────────────────────────────────────────
  "bg-white", "bg-gray-50", "bg-stone-50", "bg-slate-50",
  "bg-amber-50/50", "bg-teal-50/50", "bg-slate-800", "bg-slate-900",
  "bg-gradient-to-br",
  "from-blue-50", "via-white", "to-teal-50",
  "from-rose-50", "to-amber-50",
  "from-emerald-50", "to-lime-50",
  "from-slate-50", "to-zinc-50",
  "from-teal-50", "to-emerald-50",
  "from-slate-900", "via-slate-800", "to-slate-900",

  // ─── Text ──────────────────────────────────────────────
  "text-gray-900", "text-gray-600", "text-gray-500", "text-gray-400", "text-white",
  "text-stone-900", "text-stone-600", "text-stone-500", "text-stone-400",
  "text-slate-900", "text-slate-600", "text-slate-500", "text-slate-400",
  "text-slate-100", "text-slate-300", "text-slate-500",

  // ─── Borders ───────────────────────────────────────────
  "border-gray-200", "border-gray-200/50", "border-gray-300",
  "border-stone-200", "border-stone-200/50", "border-stone-300",
  "border-slate-200", "border-slate-200/50", "border-slate-300",
  "border-slate-700", "border-slate-700/50", "border-slate-600",

  // ─── Interactive ───────────────────────────────────────
  "focus-visible:ring-2", "focus-visible:ring-offset-2",
  "focus-visible:ring-blue-400", "focus-visible:ring-rose-400",
  "focus-visible:ring-emerald-400", "focus-visible:ring-slate-400",
  "focus-visible:ring-teal-400", "focus-visible:ring-blue-500",
  "focus-visible:ring-offset-slate-800",
  "ring-2", "ring-offset-2", "ring-offset-slate-800",
  "ring-blue-400", "ring-rose-400", "ring-emerald-400",
  "ring-slate-400", "ring-teal-400", "ring-blue-500",
  "hover:bg-gray-50", "hover:bg-rose-50/50", "hover:bg-emerald-50/50",
  "hover:bg-slate-50", "hover:bg-teal-50/50", "hover:bg-slate-700",

  // ─── Shadows ───────────────────────────────────────────
  "shadow-sm", "shadow-md", "shadow-xl",
  "shadow-sm shadow-black/20", "shadow-md shadow-black/30", "shadow-xl shadow-black/40",

  // ─── Radii ─────────────────────────────────────────────
  "rounded-lg", "rounded-xl", "rounded-full",

  // ─── Spacing ───────────────────────────────────────────
  "p-2", "p-3", "p-4", "px-6", "py-4", "gap-3",

  // ─── Status badges ─────────────────────────────────────
  "border-yellow-400", "text-yellow-700", "bg-yellow-50",
  "border-green-400", "text-green-700", "bg-green-50",
  "border-blue-400", "text-blue-700", "bg-blue-50",
  "border-amber-400", "text-amber-700", "bg-amber-50",
  "border-emerald-400", "text-emerald-700", "bg-emerald-50",
  "border-rose-400", "text-rose-700", "bg-rose-50",
  "border-teal-400", "text-teal-700", "bg-teal-50",
  "border-sky-400", "text-sky-700", "bg-sky-50",
  "border-slate-400", "text-slate-700", "bg-slate-50",
  "border-yellow-500/50", "text-yellow-400", "bg-yellow-950/30",
  "border-green-500/50", "text-green-400", "bg-green-950/30",
  "border-blue-500/50", "text-blue-400", "bg-blue-950/30",

  // ─── Column colors ────────────────────────────────────
  // Ocean
  "text-blue-700", "bg-blue-50", "border-blue-300", "ring-blue-400",
  "text-orange-700", "bg-orange-50", "border-orange-300", "ring-orange-400",
  "text-green-700", "bg-green-50", "border-green-300", "ring-green-400",
  "text-purple-700", "bg-purple-50", "border-purple-300", "ring-purple-400",
  "text-teal-700", "bg-teal-50", "border-teal-300", "ring-teal-400",
  // Sunset
  "text-rose-700", "bg-rose-50", "border-rose-300", "ring-rose-400",
  "text-amber-700", "bg-amber-50", "border-amber-300", "ring-amber-400",
  "text-yellow-700", "bg-yellow-50", "border-yellow-300", "ring-yellow-400",
  "text-orange-700", "bg-orange-50", "border-orange-300", "ring-orange-400",
  "text-red-700", "bg-red-50", "border-red-300", "ring-red-400",
  // Forest
  "text-emerald-700", "bg-emerald-50", "border-emerald-300", "ring-emerald-400",
  "text-lime-700", "bg-lime-50", "border-lime-300", "ring-lime-400",
  "text-cyan-700", "bg-cyan-50", "border-cyan-300", "ring-cyan-400",
  // Slate
  "text-sky-700", "bg-sky-50", "border-sky-300", "ring-sky-400",
  "text-violet-700", "bg-violet-50", "border-violet-300", "ring-violet-400",
  // Midnight (dark)
  "text-blue-400", "bg-blue-950/30", "border-blue-800", "ring-blue-500",
  "text-orange-400", "bg-orange-950/30", "border-orange-800", "ring-orange-500",
  "text-green-400", "bg-green-950/30", "border-green-800", "ring-green-500",
  "text-purple-400", "bg-purple-950/30", "border-purple-800", "ring-purple-500",
  "text-teal-400", "bg-teal-950/30", "border-teal-800", "ring-teal-500",
];
