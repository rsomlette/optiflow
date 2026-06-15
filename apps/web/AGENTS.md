# OptiFlow Web Agent Rules

These rules apply to `apps/web/`.

- Read the root `CLAUDE.md` before making web changes.
- Keep the Next.js app inside `apps/web/` unless explicitly asked to move it.
- Preserve the existing App Router, Tailwind, shadcn/ui, Zustand, and `next-intl` patterns.
- Keep user-facing strings in `src/messages/en.json` and `src/messages/fr.json`.
- Run `pnpm --filter @optiflow/web build` or the narrowest relevant check after web changes when feasible.
