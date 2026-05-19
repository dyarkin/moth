import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureDirExists, listDir } from '@lib/util';

let tempDir: string | null = null;

async function createTempDir(): Promise<string> {
  if (tempDir !== null) {
    return tempDir;
  }

  tempDir = await mkdtemp(join(tmpdir(), 'moth-list-dir-'));
  return tempDir;
}

afterEach(async () => {
  if (tempDir !== null) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
});

describe('listDir', () => {
  it('returns direct files and directories', async () => {
    const root = await createTempDir();

    await ensureDirExists(join(root, 'nested'));
    await writeFile(join(root, 'a.txt'), 'a', 'utf8');
    await writeFile(join(root, 'b.txt'), 'b', 'utf8');

    const result = await listDir(root);

    expect(result.files.sort()).toEqual(['a.txt', 'b.txt']);
    expect(result.dirs).toEqual(['nested']);
  });
});
