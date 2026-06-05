import { join } from 'node:path';
import YAML from 'yaml';
import { MODULE_LOCAL_STATE_FILE_NAME } from './consts';
import type { ModuleLocalState } from './types';
import { isPlainObject } from '@lib/util';
import {
  mothPathExists,
  readMothTextFile,
  resolveMothPath,
} from '@shared/moth-dir';
import { MothError } from '@shared/errors';

export async function readModuleLocalState(
  moduleName: string,
): Promise<ModuleLocalState> {
  const stateRelativePath = join(moduleName, MODULE_LOCAL_STATE_FILE_NAME);

  if (!(await mothPathExists(stateRelativePath))) {
    return createEmptyModuleLocalState();
  }

  const statePath = resolveMothPath(stateRelativePath);
  const stateText = await readMothTextFile(stateRelativePath);
  const state = YAML.parse(stateText) ?? {};

  if (!isPlainObject(state)) {
    throw new MothError({
      message: `${MODULE_LOCAL_STATE_FILE_NAME} must define an object: ${statePath}`,
    });
  }

  return {
    ...state,
    enabledPresets: parseEnabledPresets({
      state,
      statePath,
    }),
  };
}

function createEmptyModuleLocalState(): ModuleLocalState {
  return {
    enabledPresets: [],
  };
}

function parseEnabledPresets({
  state,
  statePath,
}: {
  state: Record<string, unknown>;
  statePath: string;
}): string[] {
  const enabledPresets = state.enabledPresets;

  if (!enabledPresets) {
    return [];
  }

  if (
    !Array.isArray(enabledPresets) ||
    enabledPresets.some((presetName) => typeof presetName !== 'string')
  ) {
    throw new MothError({
      message: `enabledPresets in ${statePath} must be a list of strings`,
    });
  }

  return enabledPresets;
}
