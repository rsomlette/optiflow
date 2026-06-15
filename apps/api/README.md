# OptiFlow API

NestJS API for OptiFlow.

## Commands

```bash
pnpm --filter @optiflow/api dev
pnpm --filter @optiflow/api build
pnpm --filter @optiflow/api lint
pnpm --filter @optiflow/api test
pnpm --filter @optiflow/api test:e2e
```

## Health

```bash
curl http://localhost:4000/health
```

Returns:

```json
{ "status": "ok" }
```
