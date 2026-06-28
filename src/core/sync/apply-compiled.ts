import type { Dirent } from 'node:fs';
import { lstat, readlink, readdir, stat } from 'node:fs/promises';
import { dirname, join, parse, resolve } from 'node:path';
import { ROOT_COMPILED_DIR_NAME } from '@core/modules/consts';
import {
  type ManagedTargetEntry,
  readManagedTargetState,
} from '@core/sync/managed-target-state';
import { MothError } from '@shared/errors';
import { resolveMothPath } from '@shared/moth-dir';

export type ApplyCompiledPlan = {
  targets: ManagedTargetEntry[];
  linksToCreate: ManagedTargetEntry[];
  alreadyCorrectTargetPaths: string[];
  obsoleteTargetPaths: string[];
};

type PathState =
  | { type: 'missing' }
  | { type: 'file' }
  | { type: 'directory' }
  | { type: 'symlink'; targetPath: string }
  | { type: 'blocked-by-parent' }
  | { type: 'other' };

export async function applyCompiled(): Promise<ApplyCompiledPlan> {
  const compiledDirPath = resolve(resolveMothPath(ROOT_COMPILED_DIR_NAME));

  await assertCompiledDirUsable(compiledDirPath);

  const [state, targets] = await Promise.all([
    readManagedTargetState(),
    collectDesiredTargets({ compiledDirPath }),
  ]);
  const preflight = await preflightApply({
    previousTargets: state.targets,
    targets,
  });

  if (preflight.conflicts.length > 0) {
    throw new MothError({
      message: `Cannot apply compiled files due to target conflicts:\n${preflight.conflicts
        .map((conflict) => `- ${conflict}`)
        .join('\n')}`,
    });
  }

  return {
    targets,
    linksToCreate: preflight.linksToCreate,
    alreadyCorrectTargetPaths: preflight.alreadyCorrectTargetPaths,
    obsoleteTargetPaths: preflight.obsoleteTargetPaths,
  };
}

async function assertCompiledDirUsable(compiledDirPath: string): Promise<void> {
  try {
    const compiledDirStats = await lstat(compiledDirPath);

    if (!compiledDirStats.isDirectory()) {
      throw new MothError({
        message: `Root .compiled path is not a directory: ${compiledDirPath}`,
      });
    }
  } catch (e) {
    if (e instanceof MothError) {
      throw e;
    }

    if (isNotFoundError(e)) {
      throw new MothError({
        message: `Root .compiled directory is missing: ${compiledDirPath}`,
      });
    }

    throw new MothError({
      message: `Cannot access root .compiled directory: ${compiledDirPath}. Error: ${formatError(e)}`,
    });
  }
}

async function collectDesiredTargets({
  compiledDirPath,
}: {
  compiledDirPath: string;
}): Promise<ManagedTargetEntry[]> {
  const relativeFilePaths = await listCompiledFileRelativePaths({
    compiledDirPath,
  });

  return relativeFilePaths.map((relativeFilePath) => ({
    targetPath: join(parse(compiledDirPath).root, relativeFilePath),
    sourcePath: join(compiledDirPath, relativeFilePath),
    strategy: 'symlink',
  }));
}

async function listCompiledFileRelativePaths({
  compiledDirPath,
  relativeDirPath = '',
}: {
  compiledDirPath: string;
  relativeDirPath?: string;
}): Promise<string[]> {
  const dirPath = join(compiledDirPath, relativeDirPath);
  let entries: Dirent[];

  try {
    entries = await readdir(dirPath, { withFileTypes: true });
  } catch (e) {
    throw new MothError({
      message: `Cannot scan root .compiled directory: ${dirPath}. Error: ${formatError(e)}`,
    });
  }

  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(relativeDirPath, entry.name))
    .sort();

  for (const dirName of dirs) {
    files.push(
      ...(await listCompiledFileRelativePaths({
        compiledDirPath,
        relativeDirPath: join(relativeDirPath, dirName),
      })),
    );
  }

  return files;
}

async function preflightApply({
  previousTargets,
  targets,
}: {
  previousTargets: ManagedTargetEntry[];
  targets: ManagedTargetEntry[];
}): Promise<{
  linksToCreate: ManagedTargetEntry[];
  alreadyCorrectTargetPaths: string[];
  obsoleteTargetPaths: string[];
  conflicts: string[];
}> {
  const targetPaths = new Set(targets.map((target) => target.targetPath));
  const linksToCreate: ManagedTargetEntry[] = [];
  const alreadyCorrectTargetPaths: string[] = [];
  const obsoleteTargetPaths: string[] = [];
  const conflicts: string[] = [];

  for (const previousTarget of previousTargets) {
    if (targetPaths.has(previousTarget.targetPath)) {
      continue;
    }

    const pathState = await readPathState(previousTarget.targetPath);

    if (pathState.type === 'missing') {
      continue;
    }

    if (
      pathState.type === 'symlink' &&
      pathState.targetPath === previousTarget.sourcePath
    ) {
      obsoleteTargetPaths.push(previousTarget.targetPath);
      continue;
    }

    conflicts.push(
      formatObsoleteTargetConflict({
        target: previousTarget,
        pathState,
      }),
    );
  }

  const obsoleteTargetPathSet = new Set(obsoleteTargetPaths);

  for (const target of targets) {
    const parentConflict = await findParentPathConflict({
      targetPath: target.targetPath,
      removableObsoleteTargetPaths: obsoleteTargetPathSet,
    });

    if (parentConflict) {
      conflicts.push(parentConflict);
      continue;
    }

    if (
      hasRemovableObsoleteAncestor({
        targetPath: target.targetPath,
        removableObsoleteTargetPaths: obsoleteTargetPathSet,
      })
    ) {
      linksToCreate.push(target);
      continue;
    }

    const pathState = await readPathState(target.targetPath);

    if (pathState.type === 'missing') {
      linksToCreate.push(target);
      continue;
    }

    if (
      pathState.type === 'symlink' &&
      pathState.targetPath === target.sourcePath
    ) {
      alreadyCorrectTargetPaths.push(target.targetPath);
      continue;
    }

    conflicts.push(
      formatDesiredTargetConflict({
        target,
        pathState,
      }),
    );
  }

  return {
    linksToCreate,
    alreadyCorrectTargetPaths,
    obsoleteTargetPaths,
    conflicts,
  };
}

async function readPathState(path: string): Promise<PathState> {
  try {
    const pathStats = await lstat(path);

    if (pathStats.isSymbolicLink()) {
      return {
        type: 'symlink',
        targetPath: await readlink(path),
      };
    }

    if (pathStats.isFile()) {
      return { type: 'file' };
    }

    if (pathStats.isDirectory()) {
      return { type: 'directory' };
    }

    return { type: 'other' };
  } catch (e) {
    if (isNotFoundError(e)) {
      return { type: 'missing' };
    }

    if (isNotDirectoryError(e)) {
      return { type: 'blocked-by-parent' };
    }

    throw e;
  }
}

async function findParentPathConflict({
  targetPath,
  removableObsoleteTargetPaths,
}: {
  targetPath: string;
  removableObsoleteTargetPaths: Set<string>;
}): Promise<string | null> {
  let isInsideRemovableObsoleteTarget = false;

  for (const parentPath of listParentPaths(targetPath)) {
    if (removableObsoleteTargetPaths.has(parentPath)) {
      isInsideRemovableObsoleteTarget = true;
      continue;
    }

    if (isInsideRemovableObsoleteTarget) {
      continue;
    }

    try {
      const parentStats = await lstat(parentPath);

      if (parentStats.isSymbolicLink()) {
        try {
          const linkedParentStats = await stat(parentPath);

          if (!linkedParentStats.isDirectory()) {
            return `Target parent path is not a directory: ${parentPath}`;
          }
        } catch (e) {
          if (isNotFoundError(e)) {
            return `Target parent path is not a directory: ${parentPath}`;
          }

          throw e;
        }
      } else if (!parentStats.isDirectory()) {
        return `Target parent path is not a directory: ${parentPath}`;
      }
    } catch (e) {
      if (isNotFoundError(e)) {
        continue;
      }

      if (isNotDirectoryError(e)) {
        return `Target parent path is not a directory: ${parentPath}`;
      }

      throw e;
    }
  }

  return null;
}

function hasRemovableObsoleteAncestor({
  targetPath,
  removableObsoleteTargetPaths,
}: {
  targetPath: string;
  removableObsoleteTargetPaths: Set<string>;
}): boolean {
  return listParentPaths(targetPath).some((parentPath) =>
    removableObsoleteTargetPaths.has(parentPath),
  );
}

function listParentPaths(targetPath: string): string[] {
  const parentPaths: string[] = [];
  let parentPath = dirname(targetPath);

  while (parentPath !== dirname(parentPath)) {
    parentPaths.push(parentPath);
    parentPath = dirname(parentPath);
  }

  return parentPaths.reverse();
}

function formatObsoleteTargetConflict({
  target,
  pathState,
}: {
  target: ManagedTargetEntry;
  pathState: PathState;
}): string {
  if (pathState.type === 'symlink') {
    return `Previously managed target has unexpected symlink: ${target.targetPath} -> ${pathState.targetPath} (expected ${target.sourcePath})`;
  }

  return `Previously managed target is no longer the expected symlink: ${target.targetPath} (${pathState.type})`;
}

function formatDesiredTargetConflict({
  target,
  pathState,
}: {
  target: ManagedTargetEntry;
  pathState: PathState;
}): string {
  if (pathState.type === 'symlink') {
    return `Target path already has unexpected symlink: ${target.targetPath} -> ${pathState.targetPath} (expected ${target.sourcePath})`;
  }

  return `Target path already exists and is not the expected symlink: ${target.targetPath} (${pathState.type})`;
}

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOENT'
  );
}

function isNotDirectoryError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOTDIR'
  );
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
