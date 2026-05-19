import { isAbsolute, join, normalize, relative } from 'node:path';

type AssertPathInsideDirArgs = {
  baseDirPath: string;
  path: string;
};

export function assertPathInsideDir({
  baseDirPath,
  path,
}: AssertPathInsideDirArgs): void {
  const rel = relative(baseDirPath, path);

  if (rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))) {
    return;
  }

  throw new Error(`Path is outside of base dir: ${path}`);
}

export function resolvePathInsideDir(
  baseDirPath: string,
  ...pathSegments: string[]
): string {
  const path = normalize(join(baseDirPath, ...pathSegments));

  assertPathInsideDir({
    baseDirPath,
    path,
  });

  return path;
}
