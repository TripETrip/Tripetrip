import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const PID_FILE = path.resolve('.playwright-server.pid');

async function healthCheck() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2_000);
  try {
    const response = await fetch('http://127.0.0.1:3000/', { signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export default async function globalSetup() {
  if (await healthCheck()) return;

  const nextCli = path.resolve('node_modules/next/dist/bin/next');
  const child = spawn(process.execPath, [nextCli, 'dev', '--hostname', '127.0.0.1', '--port', '3000'], {
    cwd: path.resolve('apps/web'),
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: 'ignore',
    windowsHide: true,
  });

  await writeFile(PID_FILE, String(child.pid), 'utf8');

  const startedAt = Date.now();
  while (Date.now() - startedAt < 120_000) {
    if (await healthCheck()) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error('Timed out waiting for TripETrip web app at http://127.0.0.1:3000');
}
