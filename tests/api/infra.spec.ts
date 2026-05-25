import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('enterprise infrastructure skeleton', () => {
  it('defines local platform dependencies', () => {
    const compose = readFileSync('infra/docker/docker-compose.yml', 'utf8');
    for (const service of ['postgres', 'redis', 'kafka', 'elasticsearch']) {
      expect(compose).toContain(`${service}:`);
    }
  });

  it('contains deployment manifests for web api and worker', () => {
    for (const path of ['infra/k8s/web.deployment.yaml', 'infra/k8s/api.deployment.yaml', 'infra/k8s/worker.deployment.yaml']) {
      expect(existsSync(path), `${path} should exist`).toBe(true);
    }
  });

  it('runs enterprise CI checks', () => {
    const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
    for (const command of ['npm ci', 'npm run lint', 'npm run test:api', 'npm run test:e2e', 'npm run build']) {
      expect(ci).toContain(command);
    }
  });
});
