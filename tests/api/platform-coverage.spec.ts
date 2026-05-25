import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ApiRoutes } from '../../packages/api-contracts/src/index';

const expectedRoutes = {
  auth: '/auth',
  users: '/users',
  vendors: '/vendors',
  listings: '/listings',
  search: '/search',
  bookings: '/bookings',
  payments: '/payments',
  inventory: '/inventory',
  pricing: '/pricing',
  crm: '/crm',
  operations: '/operations',
  ai: '/ai',
  community: '/community',
  trustSafety: '/trust-safety',
  adventure: '/adventure-os',
  transport: '/transport',
  whatsappCommerce: '/whatsapp-commerce',
  notifications: '/notifications',
  admin: '/admin',
  audit: '/audit',
} as const;

const expectedModules = [
  'UsersModule',
  'VendorsModule',
  'ListingsModule',
  'SearchModule',
  'InventoryModule',
  'PricingModule',
  'CrmModule',
  'OperationsModule',
  'CommunityModule',
  'TrustSafetyModule',
  'AdventureModule',
  'TransportModule',
  'WhatsappCommerceModule',
  'NotificationsModule',
  'AuditModule',
];

const expectedSchemaTables = [
  'user_profiles',
  'traveler_profiles',
  'vendor_profiles',
  'vendor_kyc_documents',
  'staff_members',
  'staff_rosters',
  'listing_media',
  'listing_availability',
  'listing_pricing_rules',
  'booking_events',
  'inventory_locks',
  'wallets',
  'payout_transfers',
  'fraud_signals',
  'crm_contacts',
  'campaigns',
  'tasks',
  'incident_reports',
  'adventure_slots',
  'guide_assignments',
  'equipment_items',
  'drivers',
  'ride_allocations',
  'community_posts',
  'reviews',
  'sos_events',
  'disputes',
  'notifications',
  'notification_deliveries',
];

describe('enterprise platform feature coverage', () => {
  it('defines API route contracts for every core Travel OS module', () => {
    expect(ApiRoutes).toMatchObject(expectedRoutes);
  });

  it('registers every core Travel OS module in the API gateway', () => {
    const appModule = readFileSync('apps/api/src/app.module.ts', 'utf8');

    for (const moduleName of expectedModules) {
      expect(appModule, `${moduleName} should be imported into AppModule`).toContain(moduleName);
    }
  });

  it('has module directories for every expected domain boundary', () => {
    for (const routeKey of Object.keys(expectedRoutes)) {
      if (routeKey === 'ai') continue;
      const kebab = routeKey.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      expect(existsSync(`apps/api/src/modules/${kebab}`), `${kebab} module should exist`).toBe(true);
    }
  });

  it('expands the database schema for provider OS, safety, community, and notifications', () => {
    const schema = readFileSync('packages/database/schema.sql', 'utf8');

    for (const tableName of expectedSchemaTables) {
      expect(schema, `${tableName} table should exist`).toContain(`CREATE TABLE IF NOT EXISTS ${tableName}`);
    }
  });
});
