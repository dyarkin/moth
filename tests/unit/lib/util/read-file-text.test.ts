import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileText } from '@lib/util';

let tempDir: string | null = null;

async function createTempDir(): Promise<string> {
  if (tempDir !== null) {
    return tempDir;
  }

  tempDir = await mkdtemp(join(tmpdir(), 'moth-read-file-text-'));
  return tempDir;
}

afterEach(async () => {
  if (tempDir !== null) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
});

describe('readFileText', () => {
  it('reads utf8 file content', async () => {
    const root = await createTempDir();
    const filePath = join(root, 'sample.txt');

    await writeFile(filePath, 'hello', 'utf8');

    expect(await readFileText(filePath)).toBe('hello');
  });

  it('throws when file does not exist', async () => {
    const root = await createTempDir();
    const filePath = join(root, 'missing.txt');

    await expect(readFileText(filePath)).rejects.toThrow(
      `Failed to read file: ${filePath}`,
    );
  });
});
