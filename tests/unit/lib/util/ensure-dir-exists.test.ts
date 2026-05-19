import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureDirExists, isDirectory } from '@lib/util';

let tempDir: string | null = null;

async function createTempDir(): Promise<string> {
  if (tempDir !== null) {
    return tempDir;
  }

  tempDir = await mkdtemp(join(tmpdir(), 'moth-ensure-dir-exists-'));
  return tempDir;
}

afterEach(async () => {
  if (tempDir !== null) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
});

describe('ensureDirExists', () => {
  it('creates nested dir and returns the same path', async () => {
    const root = await createTempDir();
    const dirPath = join(root, 'a', 'b', 'c');

    expect(await ensureDirExists(dirPath)).toBe(dirPath);
    expect(await isDirectory(dirPath)).toBe(true);
  });
});
