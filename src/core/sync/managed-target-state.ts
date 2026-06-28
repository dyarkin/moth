import YAML from 'yaml';
import { ROOT_TARGETS_LOCAL_STATE_FILE_NAME } from '@core/modules/consts';
import { isPlainObject } from '@lib/util';
import { MothError } from '@shared/errors';
import {
  mothPathExists,
  readMothTextFile,
  resolveMothPath,
  writeMothTextFile,
} from '@shared/moth-dir';

export type ManagedTargetEntry = {
  targetPath: string;
  sourcePath: string;
  strategy: 'symlink';
};

export type ManagedTargetState = {
  targets: ManagedTargetEntry[];
};

export async function readManagedTargetState(): Promise<ManagedTargetState> {
  if (!(await mothPathExists(ROOT_TARGETS_LOCAL_STATE_FILE_NAME))) {
    return createEmptyManagedTargetState();
  }

  const statePath = resolveMothPath(ROOT_TARGETS_LOCAL_STATE_FILE_NAME);
  const stateText = await readMothTextFile(ROOT_TARGETS_LOCAL_STATE_FILE_NAME);
  const state = YAML.parse(stateText) ?? {};

  if (!isPlainObject(state)) {
    throw new MothError({
      message: `${ROOT_TARGETS_LOCAL_STATE_FILE_NAME} must define an object: ${statePath}`,
    });
  }

  return {
    targets: parseManagedTargetEntries({
      state,
      statePath,
    }),
  };
}

export async function writeManagedTargetState({
  state,
}: {
  state: ManagedTargetState;
}): Promise<void> {
  await writeMothTextFile({
    relativePath: ROOT_TARGETS_LOCAL_STATE_FILE_NAME,
    content: `${YAML.stringify(state).trimEnd()}\n`,
  });
}

function createEmptyManagedTargetState(): ManagedTargetState {
  return {
    targets: [],
  };
}

function parseManagedTargetEntries({
  state,
  statePath,
}: {
  state: Record<string, unknown>;
  statePath: string;
}): ManagedTargetEntry[] {
  const targets = state.targets;

  if (targets === undefined) {
    return [];
  }

  if (!Array.isArray(targets)) {
    throw new MothError({
      message: `targets in ${statePath} must be a list`,
    });
  }

  return targets.map((target, index) =>
    parseManagedTargetEntry({
      target,
      statePath,
      index,
    }),
  );
}

function parseManagedTargetEntry({
  target,
  statePath,
  index,
}: {
  target: unknown;
  statePath: string;
  index: number;
}): ManagedTargetEntry {
  if (!isPlainObject(target)) {
    throw new MothError({
      message: `targets[${index}] in ${statePath} must be an object`,
    });
  }

  if (
    typeof target.targetPath !== 'string' ||
    typeof target.sourcePath !== 'string' ||
    target.strategy !== 'symlink'
  ) {
    throw new MothError({
      message: `targets[${index}] in ${statePath} must define targetPath, sourcePath, and strategy: symlink`,
    });
  }

  return {
    targetPath: target.targetPath,
    sourcePath: target.sourcePath,
    strategy: target.strategy,
  };
}
