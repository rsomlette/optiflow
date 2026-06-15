# OptiFlow Agent Rules

Read `CLAUDE.md` before making changes. It is the source of truth for product context, commands, project structure, and coding standards.

For web work, also read `apps/web/AGENTS.md` before editing files under `apps/web/`.

For API work, also read `apps/api/AGENTS.md` before editing files under `apps/api/`.

## Baseline

- Keep changes small and scoped to the requested area.
- The Next.js app lives in `apps/web/`. Do not move it unless explicitly requested.
- Preserve multi-tenancy assumptions: every persisted domain entity should carry `tenantId` and be filtered by authenticated tenant context.
- Prefer adding tests with new behavior.
- Do not introduce external services or database clients without an explicit requirement.
