# OptiFlow

## Project Overview

Tablet-optimized Kanban board for optician shops to track glass orders from prescription intake to client pickup. Multi-tenant SaaS — each shop gets their own dashboard, employees of the same shop share the board.

## Tech Stack

- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Drag & Drop**: @dnd-kit (touch-friendly)
- **State**: Zustand stores
- **Backend**: Mocked via service/repository pattern (planned: Supabase)
- **IDs**: nanoid

## Architecture

### Service Pattern (critical)
All data access goes through service interfaces in `src/services/types.ts`. Mock implementations live in `src/services/mock/`. The barrel file `src/services/index.ts` re-exports the active implementation. To swap to a real backend, only change the imports in `index.ts`.

### Route Structure
- `/` — Public landing page (SSR)
- `/contact` — Contact form for prospective tenants
- `/login` — Mock auth (pick tenant + employee)
- `/dashboard` — Protected Kanban board

### State Management
Zustand stores in `src/stores/` call service layer methods. Components use stores via hooks in `src/hooks/`.

## Commands

```bash
npm run dev      # Start dev server (turbopack)
npm run build    # Production build
npm run lint     # ESLint
```

## Conventions

- Tablet-first responsive design (768px–1024px primary breakpoint)
- All entities have `tenantId` for multi-tenancy
- All service methods are async (even mocks) for future backend compatibility
- Timestamps are ISO-8601 strings
- Use `cn()` from `src/lib/utils.ts` for conditional class merging
- Use `generateId()` from `src/lib/id.ts` for new entity IDs
