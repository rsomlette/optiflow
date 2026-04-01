# OptiFlow

Tablet-optimized Kanban board for optician shops. Multi-tenant SaaS — each shop gets their own dashboard, employees share the board.

## Commands

```bash
pnpm dev         # Dev server (turbopack)
pnpm build       # Production build
pnpm lint        # ESLint
pnpm test        # Playwright e2e tests
pnpm test:ui     # Playwright UI mode
```

## Code Guidelines

### File Size & Atomicity

- **One concern per file.** A file should do one thing. If you need a scroll to understand it, split it.
- **Max ~120 lines per file** as a soft target. Components, hooks, utilities — all should be small and focused.
- **Max ~30 lines per function.** If a function is longer, extract helpers.
- **One exported component per file.** Internal helpers are fine but keep them small. If a helper grows, move it to its own file.
- **Name files after what they export.** `use-elapsed-time.ts` exports `useElapsedTime`. `kanban-card.tsx` exports `KanbanCard`.

### Components

- **Atomic components first.** Build small, reusable pieces. Compose them into larger ones.
- **Props over internal state.** Prefer controlled components. Push state up to the nearest common parent or store.
- **No business logic in components.** Components render UI and call hooks/stores. Business logic lives in services, stores, or utility functions.
- **Separate container from presentation.** If a component both fetches data and renders UI, split it: a container that loads data and a presentational component that receives props.
- **`"use client"` only where needed.** Keep server components as the default. Only add the directive on components that use hooks, event handlers, or browser APIs.

### Hooks

- **One hook, one responsibility.** `useOrders()` fetches orders. `useElapsedTime()` tracks time. Don't combine unrelated logic.
- **Custom hooks for any reused stateful logic.** If two components share the same `useState` + `useEffect` pattern, extract a hook.
- **Hooks go in `src/hooks/`.** Named `use-<thing>.ts`.

### Services & Data

- **All data access through service interfaces** (`src/services/types.ts`). Never call mock implementations directly — always go through the barrel `src/services/index.ts`.
- **Services are stateless classes.** They receive parameters and return data. No side effects beyond the data operation.
- **Stores are the bridge** between services and UI. Components read from stores via hooks, never from services directly.
- **All service methods are async** — even mocks. This ensures zero refactoring when swapping to a real backend.

### State Management (Zustand)

- **One store per domain.** `order-store`, `employee-store`, `auth-store`. Don't create a god store.
- **Use selectors** to avoid unnecessary re-renders: `useOrderStore(s => s.orders.filter(...))`.
- **Actions live in the store**, not in components. Components call `store.moveOrder(...)`, not `service.moveOrder(...)`.

### Styling

- **Tailwind only.** No CSS modules, no styled-components, no inline style objects (except for dynamic values like drag transforms).
- **Use `cn()` from `src/lib/utils.ts`** for conditional class merging.
- **Tablet-first responsive.** Default styles target 768px–1024px. Use `max-sm:` for phone, `lg:` for desktop.
- **shadcn/ui for all standard UI elements.** Don't rebuild buttons, dialogs, selects, etc.

### Internationalization (i18n)

- **All user-facing strings go through `next-intl`** — never hardcode text in components.
- **Translation files** live in `src/messages/` as `en.json` and `fr.json`.
- **Use the `useTranslations` hook** in client components and `getTranslations` in server components.
- **Key naming**: dot-separated namespace matching the component tree (e.g., `dashboard.header.newOrder`).

### Testing

- **Playwright for e2e tests.** Tests live in `e2e/` at the project root.
- **Test user flows, not implementation.** "User creates an order" not "createOrder function is called".
- **One test file per major flow.** `e2e/board.spec.ts`, `e2e/new-order.spec.ts`, `e2e/auth.spec.ts`.
- **Use page object pattern** for reusable selectors and actions. Page objects live in `e2e/pages/`.
- **Every new feature needs at least one e2e test** covering the happy path.

### Naming

- **Files**: kebab-case (`kanban-card.tsx`, `use-orders.ts`)
- **Components**: PascalCase (`KanbanCard`, `OrderDetailSheet`)
- **Hooks**: camelCase with `use` prefix (`useOrders`, `useElapsedTime`)
- **Types/Interfaces**: PascalCase (`Order`, `CreateOrderInput`)
- **Constants**: UPPER_SNAKE_CASE (`ORDER_STAGES`, `DEFAULT_TENANT_ID`)
- **Store hooks**: `use<Domain>Store` (`useOrderStore`, `useAuthStore`)

### Project Structure

```
src/
  app/              # Next.js routes — thin, mostly wiring
  components/
    ui/             # shadcn/ui primitives (don't modify these)
    board/          # Kanban-specific components
    orders/         # Order creation/detail components
    scan/           # Scan/receive components
    employees/      # Employee-related components
    layout/         # App layout (header, etc.)
  hooks/            # Custom React hooks
  lib/              # Pure utilities, types, constants (no React)
  services/         # Data access layer (interfaces + implementations)
    mock/           # Mock implementations
  stores/           # Zustand stores
  messages/         # i18n translation files (en.json, fr.json)
e2e/                # Playwright tests
  pages/            # Page objects
```

### Multi-tenancy

- Every entity has a `tenantId`. Always filter by it.
- Tenant context comes from the auth store session, never hardcoded in components.

### Git

- Commit early, commit often. Small, focused commits.
- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`.
