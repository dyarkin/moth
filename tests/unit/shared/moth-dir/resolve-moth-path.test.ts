import { describe, expect, it } from 'bun:test';
import { join } from 'node:path';
import { MOTH_DIR_PATH, resolveMothPath } from '@shared/moth-dir';

describe('resolveMothPath', () => {
  it('resolves path inside moth dir', () => {
    expect(resolveMothPath('a', 'b', 'file.txt')).toBe(
      join(MOTH_DIR_PATH, 'a', 'b', 'file.txt'),
    );
  });

  it('throws for escaping path segments', () => {
    expect(() => resolveMothPath('..', 'escape.txt')).toThrow(
      'Path is outside of base dir',
    );
  });
});
