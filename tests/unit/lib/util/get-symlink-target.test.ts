import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getSymlinkTarget } from '@lib/util';

let tempDir: string | null = null;

async function createTempDir(): Promise<string> {
  if (tempDir !== null) {
    return tempDir;
  }

  tempDir = await mkdtemp(join(tmpdir(), 'moth-get-symlink-target-'));
  return tempDir;
}

afterEach(async () => {
  if (tempDir !== null) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
});

describe('getSymlinkTarget', () => {
  it('returns target for symbolic link', async () => {
    const root = await createTempDir();
    const targetPath = join(root, 'target.txt');
    const linkPath = join(root, 'link.txt');

    await writeFile(targetPath, 'target', 'utf8');
    await symlink(targetPath, linkPath);

    expect(await getSymlinkTarget(linkPath)).toBe(targetPath);
  });

  it('returns null for non-symlink paths', async () => {
    const root = await createTempDir();
    const filePath = join(root, 'regular.txt');

    await writeFile(filePath, 'x', 'utf8');

    expect(await getSymlinkTarget(filePath)).toBeNull();
  });
});
