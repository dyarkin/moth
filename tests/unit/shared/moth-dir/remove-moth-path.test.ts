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

describe('removeMothPath', () => {
  it('removes existing path recursively', async () => {
    const relativePath = `${testNamespace}/to-remove/file.txt`;

    await writeMothTextFile({
      relativePath,
      content: 'remove me',
    });

    expect(await mothPathExists(relativePath)).toBe(true);

    await removeMothPath(testNamespace);

    expect(await mothPathExists(testNamespace)).toBe(false);
  });

  it('does not throw for missing path', async () => {
    expect(await removeMothPath(`${testNamespace}/missing`)).toBeUndefined();
  });
});
