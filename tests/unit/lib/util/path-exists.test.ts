import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathExists } from '@lib/util';

let tempDir: string | null = null;

async function createTempDir(): Promise<string> {
  if (tempDir !== null) {
    return tempDir;
  }

  tempDir = await mkdtemp(join(tmpdir(), 'moth-path-exists-'));
  return tempDir;
}

afterEach(async () => {
  if (tempDir !== null) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
});

describe('pathExists', () => {
  it('returns true for existing path', async () => {
    const root = await createTempDir();
    const filePath = join(root, 'exists.txt');

    await writeFile(filePath, 'x', 'utf8');

    expect(await pathExists(filePath)).toBe(true);
  });

  it('returns false for missing path', async () => {
    const root = await createTempDir();

    expect(await pathExists(join(root, 'missing.txt'))).toBe(false);
  });
});
