import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('worker event processing skeleton', () => {
  it('contains worker entry and core event consumers', () => {
    for (const path of [
      'apps/worker/src/main.ts',
      'apps/worker/src/consumers/booking-events.consumer.ts',
      'apps/worker/src/consumers/payment-events.consumer.ts',
      'apps/worker/src/consumers/search-indexing.consumer.ts',
      'apps/worker/src/consumers/notification-events.consumer.ts',
    ]) {
      expect(existsSync(path), `${path} should exist`).toBe(true);
    }
  });

  it('uses shared event topics', () => {
    const main = readFileSync('apps/worker/src/main.ts', 'utf8');
    expect(main).toContain('EventTopics');
  });
});
