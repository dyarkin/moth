import { afterEach, describe, expect, it } from 'bun:test';
import { randomUUID } from 'node:crypto';
import {
  isMothPathDirectory,
  removeMothPath,
  writeMothTextFile,
} from '@shared/moth-dir';

const testNamespace = `__moth-tests__/${randomUUID()}`;

afterEach(async () => {
  await removeMothPath(testNamespace);
});

describe('isMothPathDirectory', () => {
  it('detects dir/file/missing correctly', async () => {
    const dirRelativePath = `${testNamespace}/dir`;
    const fileRelativePath = `${dirRelativePath}/file.txt`;

    await writeMothTextFile({
      relativePath: fileRelativePath,
      content: 'x',
    });

    expect(await isMothPathDirectory(dirRelativePath)).toBe(true);
    expect(await isMothPathDirectory(fileRelativePath)).toBe(false);
    expect(await isMothPathDirectory(`${testNamespace}/missing`)).toBe(false);
  });
});
