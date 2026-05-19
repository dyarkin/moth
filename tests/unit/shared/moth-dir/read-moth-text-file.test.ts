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

describe('readMothTextFile', () => {
  it('reads existing moth file by relative path', async () => {
    const relativePath = `${testNamespace}/notes/file.txt`;

    await writeMothTextFile({
      relativePath,
      content: 'hello moth',
    });

    expect(await readMothTextFile(relativePath)).toBe('hello moth');
  });
});
