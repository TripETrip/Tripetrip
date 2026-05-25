# TripETrip

TripETrip is an enterprise Travel Marketplace + Travel Operating System monorepo.

## Apps

- `apps/web` - Next.js traveler, provider, and admin web surfaces.
- `apps/api` - NestJS API gateway and domain modules.
- `apps/worker` - async event workers for booking, payment, search, and notification flows.

## Packages

- `packages/types` - shared domain types.
- `packages/constants` - roles, permissions, event topics, route constants.
- `packages/validators` - shared runtime validation schemas.
- `packages/api-contracts` - API route contracts.
- `packages/database` - PostgreSQL schema and seed files.
- `packages/observability` - logging/analytics contracts.
- `packages/security` - RBAC and security helper contracts.

## Commands

```bash
npm run dev
npm run dev:api
npm run dev:worker
npm run lint
npm run test:api
npm run test:e2e
npm run build
```

## Local Platform Services

```bash
docker compose -f infra/docker/docker-compose.yml up
```
