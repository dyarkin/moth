import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFileText } from '@lib/util';

let tempDir: string | null = null;

async function createTempDir(): Promise<string> {
  if (tempDir !== null) {
    return tempDir;
  }

  tempDir = await mkdtemp(join(tmpdir(), 'moth-write-file-text-'));
  return tempDir;
}

afterEach(async () => {
  if (tempDir !== null) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
});

describe('writeFileText', () => {
  it('creates parent dirs and writes file content', async () => {
    const root = await createTempDir();
    const filePath = join(root, 'deep', 'path', 'file.txt');

    await writeFileText({ filePath, content: 'content' });

    expect(await readFile(filePath, 'utf8')).toBe('content');
  });
});
