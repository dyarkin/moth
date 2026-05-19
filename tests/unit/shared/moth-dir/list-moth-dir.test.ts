import { afterEach, describe, expect, it } from 'bun:test';
import { randomUUID } from 'node:crypto';
import {
  listMothDir,
  removeMothPath,
  writeMothTextFile,
} from '@shared/moth-dir';

const testNamespace = `__moth-tests__/${randomUUID()}`;

afterEach(async () => {
  await removeMothPath(testNamespace);
});

describe('listMothDir', () => {
  it('lists direct files and dirs', async () => {
    await writeMothTextFile({
      relativePath: `${testNamespace}/root-file.txt`,
      content: 'root',
    });

    await writeMothTextFile({
      relativePath: `${testNamespace}/nested/file.txt`,
      content: 'nested',
    });

    const result = await listMothDir(testNamespace);

    expect(result.files).toEqual(['root-file.txt']);
    expect(result.dirs).toEqual(['nested']);
  });
});
