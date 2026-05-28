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
