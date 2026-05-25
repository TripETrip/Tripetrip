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
