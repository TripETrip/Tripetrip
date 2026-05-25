# TripETrip Enterprise Monorepo Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current prototype in place into a clean enterprise monorepo foundation with Next.js web, NestJS API, worker, shared packages, production database contracts, event contracts, and migrated tests without leaving duplicate runtime stacks.

**Architecture:** The migration proceeds in safe vertical slices. First create monorepo scaffolding and shared contracts, then add Next/Nest/worker apps, then migrate auth, marketplace, provider, admin, booking, payment, AI, search, and event boundaries. The old Vite/Express/Firebase runtime is removed only after replacements compile and tests cover the new routes.

**Tech Stack:** Next.js, React, TypeScript, TailwindCSS, Zustand/React Query-ready frontend boundaries, NestJS, PostgreSQL SQL migrations, Redis/Kafka/Elasticsearch adapter contracts, OpenAI AI adapter, Razorpay/Stripe payment adapter contracts, Playwright, Docker, Kubernetes-ready config.

---

## File Structure Map

Create:

- `apps/web/`: Next.js app for traveler, provider, admin, PWA shell.
- `apps/api/`: NestJS API gateway and modules.
- `apps/worker/`: event consumers and async jobs.
- `packages/types/`: centralized domain types.
- `packages/constants/`: roles, permissions, events, route constants.
- `packages/validators/`: Zod validation schemas shared by frontend/backend.
- `packages/api-contracts/`: typed API route contracts.
- `packages/database/`: SQL schema, seeds, RLS/security notes.
- `packages/observability/`: logging and analytics interfaces.
- `packages/security/`: RBAC and audit helper contracts.
- `infra/docker/`: local Docker Compose for Postgres, Redis, Kafka, Elasticsearch.
- `infra/k8s/`: deployable app/api/worker manifests.
- `tests/api/`: API-level tests.
- `tests/security/`: RBAC and abuse tests.

Modify:

- `package.json`: workspace scripts and dependencies.
- `tsconfig.json`: monorepo TypeScript references/paths.
- `playwright.config.ts`: point E2E at `apps/web` once Next app is active.
- Current `src/**`: migrate useful UI/content into `apps/web` and remove after replacement.
- Current `server.ts`: retire after `apps/api` exists and tests pass.
- Current Firebase files: retire after no runtime imports remain.

## Task 1: Workspace Foundation

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Create: `apps/web/package.json`
- Create: `apps/api/package.json`
- Create: `apps/worker/package.json`
- Create: `packages/types/package.json`
- Create: `packages/constants/package.json`
- Create: `packages/validators/package.json`
- Create: `packages/api-contracts/package.json`
- Create: `packages/database/package.json`
- Create: `packages/observability/package.json`
- Create: `packages/security/package.json`

- [ ] **Step 1: Write failing workspace verification**

Create `tests/api/workspace-structure.spec.ts` with assertions that all required workspace directories and package manifests exist.

```ts
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const requiredPaths = [
  'apps/web/package.json',
  'apps/api/package.json',
  'apps/worker/package.json',
  'packages/types/package.json',
  'packages/constants/package.json',
  'packages/validators/package.json',
  'packages/api-contracts/package.json',
  'packages/database/package.json',
  'packages/observability/package.json',
  'packages/security/package.json',
];

describe('enterprise workspace structure', () => {
  it('contains the canonical app and package workspaces', () => {
    for (const path of requiredPaths) {
      expect(existsSync(path), `${path} should exist`).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:api -- tests/api/workspace-structure.spec.ts`

Expected: FAIL because `test:api` and/or workspace files do not exist.

- [ ] **Step 3: Add workspace scripts and Vitest**

Update root `package.json` scripts:

```json
{
  "scripts": {
    "dev": "npm run dev:web",
    "dev:web": "npm --workspace apps/web run dev",
    "dev:api": "npm --workspace apps/api run start:dev",
    "dev:worker": "npm --workspace apps/worker run start:dev",
    "build": "npm run build:packages && npm run build:web && npm run build:api && npm run build:worker",
    "build:web": "npm --workspace apps/web run build",
    "build:api": "npm --workspace apps/api run build",
    "build:worker": "npm --workspace apps/worker run build",
    "build:packages": "npm --workspaces --if-present run build",
    "lint": "tsc --noEmit",
    "test:api": "vitest run",
    "test:e2e": "playwright test"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

Add dev dependencies: `vitest`, `@types/node` if missing.

- [ ] **Step 4: Add package manifests**

Each app/package manifest must have a unique name:

```json
{
  "name": "@tripetrip/types",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc --noEmit"
  }
}
```

Use matching names for each package.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:api -- tests/api/workspace-structure.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add package.json package-lock.json tsconfig.json apps packages tests/api/workspace-structure.spec.ts
git commit -m "chore: establish enterprise monorepo workspaces"
```

## Task 2: Shared Domain Types, Constants, Validators, Contracts

**Files:**
- Create: `packages/types/src/index.ts`
- Create: `packages/constants/src/index.ts`
- Create: `packages/validators/src/index.ts`
- Create: `packages/api-contracts/src/index.ts`
- Create: `packages/security/src/index.ts`
- Test: `tests/api/contracts.spec.ts`

- [ ] **Step 1: Write failing contract test**

Create `tests/api/contracts.spec.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { Roles, Permissions, EventTopics } from '../packages/constants/src/index';
import { RegisterProviderSchema, CreateBookingSchema } from '../packages/validators/src/index';

describe('shared contracts', () => {
  it('defines enterprise RBAC roles and permissions', () => {
    expect(Roles.platformAdmin).toBe('platform_admin');
    expect(Permissions.paymentSettle).toBe('payment.settle');
  });

  it('validates provider registration payloads', () => {
    const result = RegisterProviderSchema.safeParse({
      email: 'owner@tripetrip.com',
      password: 'StrongPass123!',
      businessName: 'Himalayan Stays',
      businessType: 'homestay',
      ownerName: 'Asha Devi',
      phone: '+919999999999',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid booking payloads', () => {
    const result = CreateBookingSchema.safeParse({
      listingId: '',
      startDate: 'not-a-date',
      guestCount: 0,
    });
    expect(result.success).toBe(false);
  });

  it('defines event topics for async architecture', () => {
    expect(EventTopics.booking).toBe('booking.events');
    expect(EventTopics.payment).toBe('payment.events');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:api -- tests/api/contracts.spec.ts`

Expected: FAIL because shared exports do not exist.

- [ ] **Step 3: Implement constants**

`packages/constants/src/index.ts`:

```ts
export const Roles = {
  traveler: 'traveler',
  providerOwner: 'provider_owner',
  providerAdmin: 'provider_admin',
  providerManager: 'provider_manager',
  providerStaff: 'provider_staff',
  guide: 'guide',
  driver: 'driver',
  creator: 'creator',
  supportAgent: 'support_agent',
  financeAdmin: 'finance_admin',
  trustSafetyAdmin: 'trust_safety_admin',
  platformAdmin: 'platform_admin',
  superAdmin: 'super_admin',
} as const;

export const Permissions = {
  profileRead: 'profile.read',
  profileWrite: 'profile.write',
  listingRead: 'listing.read',
  listingWrite: 'listing.write',
  listingModerate: 'listing.moderate',
  bookingCreate: 'booking.create',
  bookingUpdate: 'booking.update',
  bookingOverride: 'booking.override',
  paymentCreate: 'payment.create',
  paymentRefund: 'payment.refund',
  paymentSettle: 'payment.settle',
  payoutApprove: 'payout.approve',
  auditRead: 'audit.read',
} as const;

export const EventTopics = {
  auth: 'auth.events',
  vendor: 'vendor.events',
  listing: 'listing.events',
  searchIndexing: 'search.indexing',
  booking: 'booking.events',
  payment: 'payment.events',
  inventory: 'inventory.events',
  pricing: 'pricing.events',
  notification: 'notification.events',
  audit: 'audit.events',
} as const;
```

- [ ] **Step 4: Implement types**

`packages/types/src/index.ts`:

```ts
import type { Roles, Permissions } from '@tripetrip/constants';

export type Role = (typeof Roles)[keyof typeof Roles];
export type Permission = (typeof Permissions)[keyof typeof Permissions];

export type ServiceCategory =
  | 'hotel'
  | 'homestay'
  | 'hostel'
  | 'villa'
  | 'resort'
  | 'camp'
  | 'adventure'
  | 'trek'
  | 'guide'
  | 'taxi'
  | 'bike_rental'
  | 'bus'
  | 'rural_tourism'
  | 'travel_agency'
  | 'experience'
  | 'event';

export interface ApiResponse<T> {
  data: T;
  requestId: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
}
```

- [ ] **Step 5: Implement validators**

`packages/validators/src/index.ts`:

```ts
import { z } from 'zod';

export const RegisterProviderSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  businessName: z.string().min(2).max(160),
  businessType: z.string().min(2).max(80),
  ownerName: z.string().min(2).max(120),
  phone: z.string().min(8).max(20),
});

export const CreateBookingSchema = z.object({
  listingId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  guestCount: z.number().int().min(1).max(50),
  specialRequests: z.string().max(1000).optional(),
});
```

- [ ] **Step 6: Run contract test**

Run: `npm run test:api -- tests/api/contracts.spec.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git add packages tests/api/contracts.spec.ts package.json package-lock.json
git commit -m "feat: add shared enterprise contracts"
```

## Task 3: Database Schema Package

**Files:**
- Create: `packages/database/schema.sql`
- Create: `packages/database/seed.sql`
- Create: `packages/database/README.md`
- Test: `tests/api/database-schema.spec.ts`

- [ ] **Step 1: Write failing schema test**

Create `tests/api/database-schema.spec.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const schema = readFileSync('packages/database/schema.sql', 'utf8');

describe('database schema', () => {
  it('contains canonical enterprise tables', () => {
    for (const table of [
      'organizations',
      'organization_members',
      'users',
      'listings',
      'bookings',
      'payment_events',
      'ledger_entries',
      'vehicles',
      'ai_itineraries',
      'audit_logs',
    ]) {
      expect(schema).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    }
  });

  it('uses immutable audit and payment event timestamps', () => {
    expect(schema).toContain('payment_events');
    expect(schema).toContain('audit_logs');
    expect(schema).toContain('created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:api -- tests/api/database-schema.spec.ts`

Expected: FAIL because schema package is not populated.

- [ ] **Step 3: Implement schema**

Create a production-shaped `packages/database/schema.sql` with at least these tables:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  organization_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  base_price NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  traveler_id UUID NOT NULL REFERENCES users(id),
  listing_id UUID NOT NULL REFERENCES listings(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  status TEXT NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  provider_event_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  entry_type TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  label TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  traveler_id UUID REFERENCES users(id),
  prompt TEXT NOT NULL,
  response JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

- [ ] **Step 4: Run schema test**

Run: `npm run test:api -- tests/api/database-schema.spec.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add packages/database tests/api/database-schema.spec.ts
git commit -m "feat: add production database schema foundation"
```

## Task 4: NestJS API Skeleton

**Files:**
- Create: `apps/api/src/main.ts`
- Create: `apps/api/src/app.module.ts`
- Create: `apps/api/src/common/http/api-response.ts`
- Create: `apps/api/src/common/security/rbac.guard.ts`
- Create: `apps/api/src/modules/health/health.controller.ts`
- Create: `apps/api/src/modules/auth/auth.module.ts`
- Create: `apps/api/src/modules/bookings/bookings.module.ts`
- Create: `apps/api/src/modules/payments/payments.module.ts`
- Create: `apps/api/src/modules/admin/admin.module.ts`
- Test: `tests/api/api-skeleton.spec.ts`

- [ ] **Step 1: Write failing API skeleton test**

Create `tests/api/api-skeleton.spec.ts`:

```ts
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('NestJS API skeleton', () => {
  it('contains the API app entry and domain modules', () => {
    for (const path of [
      'apps/api/src/main.ts',
      'apps/api/src/app.module.ts',
      'apps/api/src/modules/health/health.controller.ts',
      'apps/api/src/modules/auth/auth.module.ts',
      'apps/api/src/modules/bookings/bookings.module.ts',
      'apps/api/src/modules/payments/payments.module.ts',
      'apps/api/src/modules/admin/admin.module.ts',
    ]) {
      expect(existsSync(path), `${path} should exist`).toBe(true);
    }
  });

  it('registers core modules in app module', () => {
    const appModule = readFileSync('apps/api/src/app.module.ts', 'utf8');
    expect(appModule).toContain('AuthModule');
    expect(appModule).toContain('BookingsModule');
    expect(appModule).toContain('PaymentsModule');
    expect(appModule).toContain('AdminModule');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:api -- tests/api/api-skeleton.spec.ts`

Expected: FAIL.

- [ ] **Step 3: Install Nest dependencies**

Run:

```bash
npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/swagger reflect-metadata rxjs
npm install -D @nestjs/testing
```

- [ ] **Step 4: Implement app module and health route**

Create minimal modules that compile and return health:

```ts
import { Module } from '@nestjs/common';
import { HealthController } from './modules/health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [AuthModule, BookingsModule, PaymentsModule, AdminModule],
  controllers: [HealthController],
})
export class AppModule {}
```

- [ ] **Step 5: Run API skeleton test**

Run: `npm run test:api -- tests/api/api-skeleton.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add apps/api tests/api/api-skeleton.spec.ts package.json package-lock.json
git commit -m "feat: add NestJS API gateway skeleton"
```

## Task 5: Next.js Web Skeleton

**Files:**
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/provider/dashboard/page.tsx`
- Create: `apps/web/src/app/admin/page.tsx`
- Create: `apps/web/src/modules/shared/AppShell.tsx`
- Create: `apps/web/src/modules/traveler/TravelerHome.tsx`
- Test: `tests/api/web-skeleton.spec.ts`

- [ ] **Step 1: Write failing web skeleton test**

Create `tests/api/web-skeleton.spec.ts`:

```ts
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Next.js web skeleton', () => {
  it('contains traveler, provider, and admin app surfaces', () => {
    for (const path of [
      'apps/web/src/app/layout.tsx',
      'apps/web/src/app/page.tsx',
      'apps/web/src/app/provider/dashboard/page.tsx',
      'apps/web/src/app/admin/page.tsx',
    ]) {
      expect(existsSync(path), `${path} should exist`).toBe(true);
    }
  });

  it('does not introduce a duplicated Vite runtime inside apps/web', () => {
    expect(existsSync('apps/web/vite.config.ts')).toBe(false);
  });

  it('contains founder-visible product language', () => {
    const page = readFileSync('apps/web/src/app/page.tsx', 'utf8');
    expect(page).toContain('Travel Marketplace + Travel OS');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:api -- tests/api/web-skeleton.spec.ts`

Expected: FAIL.

- [ ] **Step 3: Install Next dependencies**

Run:

```bash
npm install next
```

- [ ] **Step 4: Implement skeleton pages**

Create mobile-first pages with loading/error-ready sections and links to traveler/provider/admin surfaces. Keep UI small and clean; do not copy entire old pages yet.

- [ ] **Step 5: Run web skeleton test**

Run: `npm run test:api -- tests/api/web-skeleton.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add apps/web tests/api/web-skeleton.spec.ts package.json package-lock.json
git commit -m "feat: add Next.js web app skeleton"
```

## Task 6: Worker and Event Contracts

**Files:**
- Create: `apps/worker/src/main.ts`
- Create: `apps/worker/src/consumers/booking-events.consumer.ts`
- Create: `apps/worker/src/consumers/payment-events.consumer.ts`
- Create: `apps/worker/src/consumers/search-indexing.consumer.ts`
- Create: `apps/worker/src/consumers/notification-events.consumer.ts`
- Test: `tests/api/worker-events.spec.ts`

- [ ] **Step 1: Write failing worker test**

Assert worker entry and consumers exist and import `EventTopics`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:api -- tests/api/worker-events.spec.ts`

Expected: FAIL.

- [ ] **Step 3: Implement worker skeleton**

Each consumer should expose a named async handler:

```ts
export async function handleBookingEvent(event: unknown) {
  return { handled: true, event };
}
```

- [ ] **Step 4: Run worker test**

Run: `npm run test:api -- tests/api/worker-events.spec.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add apps/worker tests/api/worker-events.spec.ts
git commit -m "feat: add worker event processing skeleton"
```

## Task 7: Infra Skeleton

**Files:**
- Create: `infra/docker/docker-compose.yml`
- Create: `infra/k8s/web.deployment.yaml`
- Create: `infra/k8s/api.deployment.yaml`
- Create: `infra/k8s/worker.deployment.yaml`
- Create: `.github/workflows/ci.yml`
- Test: `tests/api/infra.spec.ts`

- [ ] **Step 1: Write failing infra test**

Assert Docker Compose includes Postgres, Redis, Kafka, Elasticsearch and CI includes lint/test/build commands.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:api -- tests/api/infra.spec.ts`

Expected: FAIL.

- [ ] **Step 3: Add infra files**

Docker Compose services:

- `postgres`
- `redis`
- `kafka`
- `elasticsearch`

CI steps:

- `npm ci`
- `npm run lint`
- `npm run test:api`
- `npm run test:e2e`
- `npm run build`

- [ ] **Step 4: Run infra test**

Run: `npm run test:api -- tests/api/infra.spec.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add infra .github tests/api/infra.spec.ts
git commit -m "chore: add enterprise infrastructure skeleton"
```

## Task 8: Migrate Runtime Scripts to New Stack

**Files:**
- Modify: `package.json`
- Modify: `playwright.config.ts`
- Modify: `tests/e2e/*.spec.ts`

- [ ] **Step 1: Write failing E2E expectation for Next routes**

Update E2E tests to expect:

- `/` traveler home
- `/provider/dashboard`
- `/admin`

Run: `npm run test:e2e -- --reporter=list --workers=1`

Expected: FAIL until Next app is served.

- [ ] **Step 2: Point dev/build scripts at Next/Nest**

Root `dev`, `build`, and Playwright setup must serve `apps/web`.

- [ ] **Step 3: Run E2E**

Run: `npm run test:e2e -- --reporter=list --workers=1`

Expected: PASS for skeleton routes.

- [ ] **Step 4: Commit**

Run:

```bash
git add package.json playwright.config.ts tests/e2e
git commit -m "test: migrate e2e checks to enterprise app routes"
```

## Task 9: Remove Prototype Runtime After Replacement

**Files:**
- Delete after verification: `server.ts`
- Delete after verification: `vite.config.ts`
- Delete after verification: `src/lib/firebase.ts`
- Delete after verification: Firebase config/rules files if no longer referenced.
- Move or delete after verification: old `src/pages/**`, `src/App.tsx`, `src/main.tsx`.

- [ ] **Step 1: Verify no imports remain**

Run:

```bash
rg "firebase|vite|server.ts|src/App|src/main" apps packages tests package.json
```

Expected: no runtime references to Firebase/Vite prototype.

- [ ] **Step 2: Delete obsolete files with care**

Only delete after the new Next/Nest build and E2E tests pass.

- [ ] **Step 3: Run full verification**

Run:

```bash
npm run lint
npm run test:api
npm run test:e2e -- --reporter=list --workers=1
npm run build
```

Expected: all pass.

- [ ] **Step 4: Commit**

Run:

```bash
git add -A
git commit -m "chore: remove prototype runtime after enterprise migration"
```

## Self-Review

Spec coverage:

- Monorepo structure: Tasks 1, 5, 6.
- Shared contracts/types/constants: Task 2.
- Database schema: Task 3.
- NestJS API gateway: Task 4.
- Next.js frontend surfaces: Task 5.
- Worker/event architecture: Task 6.
- DevOps/CI/K8s/Docker: Task 7.
- E2E migration: Task 8.
- No duplicate runtime stack: Task 9.

Known scope control:

- This plan creates the enterprise foundation and first routable surfaces. Full feature depth for all 18 modules will follow as module-specific plans after the monorepo foundation lands.
- This avoids a single giant patch that would mix framework migration, every feature, payments, AI, and infra in one unreviewable change.
