import { afterEach, describe, expect, it } from 'bun:test';
import { randomUUID } from 'node:crypto';
import {
  mothPathExists,
  removeMothPath,
  writeMothTextFile,
} from '@shared/moth-dir';

const testNamespace = `__moth-tests__/${randomUUID()}`;

afterEach(async () => {
  await removeMothPath(testNamespace);
});

describe('mothPathExists', () => {
  it('returns true for existing path and false for missing one', async () => {
    const fileRelativePath = `${testNamespace}/dir/file.txt`;

    await writeMothTextFile({
      relativePath: fileRelativePath,
      content: 'x',
    });

    expect(await mothPathExists(fileRelativePath)).toBe(true);
    expect(await mothPathExists(`${testNamespace}/missing`)).toBe(false);
  });
});
