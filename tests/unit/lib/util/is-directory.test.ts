import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureDirExists, isDirectory } from '@lib/util';

let tempDir: string | null = null;

async function createTempDir(): Promise<string> {
  if (tempDir !== null) {
    return tempDir;
  }

  tempDir = await mkdtemp(join(tmpdir(), 'moth-is-directory-'));
  return tempDir;
}

afterEach(async () => {
  if (tempDir !== null) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
});

describe('isDirectory', () => {
  it('returns true for directories', async () => {
    const root = await createTempDir();
    const dirPath = join(root, 'dir');

    await ensureDirExists(dirPath);

    expect(await isDirectory(dirPath)).toBe(true);
  });

  it('returns false for regular files', async () => {
    const root = await createTempDir();
    const filePath = join(root, 'file.txt');

    await writeFile(filePath, 'x', 'utf8');

    expect(await isDirectory(filePath)).toBe(false);
  });

  it('returns false for missing paths', async () => {
    const root = await createTempDir();

    expect(await isDirectory(join(root, 'missing'))).toBe(false);
  });
});
