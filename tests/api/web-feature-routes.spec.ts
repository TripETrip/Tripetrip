import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const travelerRoutes = [
  'discover',
  'search',
  'map',
  'listing/[id]',
  'provider/[slug]',
  'trip-planner',
  'trips',
  'bookings/[id]',
  'wallet',
  'wishlist',
  'community',
  'memories',
  'safety',
];

const providerRoutes = [
  'onboarding',
  'kyc',
  'listings',
  'inventory',
  'bookings',
  'calendar',
  'pricing',
  'staff',
  'operations',
  'fleet',
  'adventure',
  'crm',
  'marketing',
  'payouts',
  'analytics',
  'settings',
  'storefront',
];

const adminRoutes = [
  'users',
  'vendors',
  'kyc',
  'listings',
  'bookings',
  'payments',
  'refunds',
  'fraud',
  'trust-safety',
  'community',
  'cms',
  'subscriptions',
  'support',
  'audit-logs',
  'ai',
  'analytics',
];

describe('Next.js feature route coverage', () => {
  it('contains every traveler route from the production design', () => {
    for (const route of travelerRoutes) {
      expect(existsSync(`apps/web/src/app/${route}/page.tsx`), route).toBe(true);
    }
  });

  it('contains every provider operating system route from the production design', () => {
    for (const route of providerRoutes) {
      expect(existsSync(`apps/web/src/app/provider/${route}/page.tsx`), route).toBe(true);
    }
  });

  it('contains every admin governance route from the production design', () => {
    for (const route of adminRoutes) {
      expect(existsSync(`apps/web/src/app/admin/${route}/page.tsx`), route).toBe(true);
    }
  });

  it('uses a shared feature page and route catalog instead of duplicate pages', () => {
    const routeCatalog = readFileSync('apps/web/src/modules/shared/featureCatalog.ts', 'utf8');
    const featurePage = readFileSync('apps/web/src/modules/shared/FeaturePage.tsx', 'utf8');

    expect(routeCatalog).toContain('travelerFeatures');
    expect(routeCatalog).toContain('providerFeatures');
    expect(routeCatalog).toContain('adminFeatures');
    expect(featurePage).toContain('primaryMetric');
    expect(featurePage).toContain('workflow');
  });
});
