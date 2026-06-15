# OptiFlow API Agent Rules

These rules apply to `apps/api/`.

## Architecture

- Use NestJS modules, controllers, services, and DTOs in their conventional roles.
- Controllers should stay thin: validate request shape, call services, return DTOs.
- Business logic belongs in injectable services, not controllers.
- Keep modules focused by domain. Avoid catch-all shared modules until duplication proves they are needed.
- Keep bootstrap-only concerns in `src/main.ts`; make app configuration testable through exported functions.

## Code Style

- Use explicit return types on functions and public methods.
- Keep strict TypeScript settings green. Avoid `any` unless interop requires it.
- Prefer dependency injection over direct construction for services that have dependencies.
- Use kebab-case file names and PascalCase Nest classes.
- Avoid barrel files until there is a concrete import ergonomics problem.

## API Behavior

- Keep `/health` unauthenticated and dependency-light so it remains usable for uptime checks.
- Use `ValidationPipe` for DTO validation and transformation.
- Do not hardcode tenant IDs in API handlers.
- Return stable response shapes from public endpoints.

## Testing

- Add a unit test for controller/service behavior when adding a focused unit.
- Add or update e2e tests for public endpoint behavior.
- Run `pnpm --filter @optiflow/api type-check`, `pnpm --filter @optiflow/api lint`, and `pnpm --filter @optiflow/api test` after API changes when feasible.
