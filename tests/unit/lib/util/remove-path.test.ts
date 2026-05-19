import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureDirExists, pathExists, removePath } from '@lib/util';

let tempDir: string | null = null;

async function createTempDir(): Promise<string> {
  if (tempDir !== null) {
    return tempDir;
  }

  tempDir = await mkdtemp(join(tmpdir(), 'moth-remove-path-'));
  return tempDir;
}

afterEach(async () => {
  if (tempDir !== null) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
});

describe('removePath', () => {
  it('removes existing file path', async () => {
    const root = await createTempDir();
    const filePath = join(root, 'file.txt');

    await writeFile(filePath, 'x', 'utf8');
    expect(await pathExists(filePath)).toBe(true);

    await removePath(filePath);

    expect(await pathExists(filePath)).toBe(false);
  });

  it('removes existing directory path recursively', async () => {
    const root = await createTempDir();
    const dirPath = join(root, 'nested');
    const filePath = join(dirPath, 'file.txt');

    await ensureDirExists(dirPath);
    await writeFile(filePath, 'x', 'utf8');

    await removePath(dirPath);

    expect(await pathExists(dirPath)).toBe(false);
  });

  it('does not throw for missing path', async () => {
    const root = await createTempDir();

    expect(await removePath(join(root, 'missing'))).toBeUndefined();
  });
});
