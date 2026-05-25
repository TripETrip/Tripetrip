import { existsSync } from 'node:fs';
import { readFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const PID_FILE = path.resolve('.playwright-server.pid');

export default async function globalTeardown() {
  if (!existsSync(PID_FILE)) return;

  const pid = (await readFile(PID_FILE, 'utf8')).trim();
  try {
    if (process.platform === 'win32') {
      execFileSync('taskkill', ['/PID', pid, '/T', '/F'], { stdio: 'ignore' });
    } else {
      process.kill(Number(pid), 'SIGTERM');
    }
  } catch {
    // Server may already be gone.
  } finally {
    await rm(PID_FILE, { force: true });
  }
}
