import { describe, expect, it } from 'bun:test';
import { join, normalize } from 'node:path';
import { tmpdir } from 'node:os';
import { resolvePathInsideDir } from '@lib/util';

describe('resolvePathInsideDir', () => {
  it('resolves and normalizes path inside base dir', () => {
    const baseDirPath = join(tmpdir(), 'moth-base');

    const resolved = resolvePathInsideDir(
      baseDirPath,
      'a',
      '..',
      'b',
      'file.txt',
    );

    expect(resolved).toBe(normalize(join(baseDirPath, 'b', 'file.txt')));
  });

  it('throws when resolved path escapes base dir', () => {
    const baseDirPath = join(tmpdir(), 'moth-base');

    expect(() => resolvePathInsideDir(baseDirPath, '..', 'escape.txt')).toThrow(
      'Path is outside of base dir',
    );
  });
});
