import { afterEach, describe, expect, it } from 'bun:test';
import { randomUUID } from 'node:crypto';
import {
  readMothTextFile,
  removeMothPath,
  writeMothTextFile,
} from '@shared/moth-dir';

const testNamespace = `__moth-tests__/${randomUUID()}`;

afterEach(async () => {
  await removeMothPath(testNamespace);
});

describe('writeMothTextFile', () => {
  it('creates parent dirs and writes content', async () => {
    const relativePath = `${testNamespace}/deep/path/file.txt`;

    await writeMothTextFile({
      relativePath,
      content: 'content',
    });

    expect(await readMothTextFile(relativePath)).toBe('content');
  });
});
