import { describe, expect, it } from 'bun:test';
import {
  MOTH_DIR_PATH,
  ensureMothDirExists,
  isMothPathDirectory,
} from '@shared/moth-dir';

describe('ensureMothDirExists', () => {
  it('creates moth dir and returns its path', async () => {
    expect(await ensureMothDirExists()).toBe(MOTH_DIR_PATH);
    expect(await isMothPathDirectory()).toBe(true);
  });
});
