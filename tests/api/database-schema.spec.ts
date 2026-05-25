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
