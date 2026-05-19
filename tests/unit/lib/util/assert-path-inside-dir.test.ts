import { describe, expect, it } from 'bun:test';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { assertPathInsideDir } from '@lib/util';

describe('assertPathInsideDir', () => {
  it('does not throw for path inside base dir', () => {
    const baseDirPath = join(tmpdir(), 'moth-base');
    const path = join(baseDirPath, 'nested', 'file.txt');

    expect(() => {
      assertPathInsideDir({ baseDirPath, path });
    }).not.toThrow();
  });

  it('throws for path outside base dir', () => {
    const baseDirPath = join(tmpdir(), 'moth-base');
    const path = join(tmpdir(), 'other', 'file.txt');

    expect(() => {
      assertPathInsideDir({ baseDirPath, path });
    }).toThrow('Path is outside of base dir');
  });

  it('does not throw for exact base dir path', () => {
    const baseDirPath = join(tmpdir(), 'moth-base');

    expect(() => {
      assertPathInsideDir({ baseDirPath, path: baseDirPath });
    }).not.toThrow();
  });
});
