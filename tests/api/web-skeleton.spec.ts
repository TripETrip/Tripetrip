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
