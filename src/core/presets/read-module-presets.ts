import { basename, extname, join } from 'node:path';
import { MODULE_PRESETS_DIR_NAME } from '@core/modules/consts';
import { readModuleLocalState } from '@core/modules/read-module-local-state';
import { mergeVarSets, readVarSetFromYaml } from '@core/variables';
import { pathExists, resolvePathInsideDir } from '@lib/util';
import { listMothDir, mothPathExists, resolveMothPath } from '@shared/moth-dir';
import { MothError } from '@shared/errors';
import type { VarSet } from '@core/variables';

export async function listModulePresets(moduleName: string): Promise<string[]> {
  const presetsRelativePath = join(moduleName, MODULE_PRESETS_DIR_NAME);

  if (!(await mothPathExists(presetsRelativePath))) {
    return [];
  }

  const { files } = await listMothDir(presetsRelativePath);

  return files
    .filter((fileName) => fileName.endsWith('.yaml'))
    .map((fileName) => basename(fileName, extname(fileName)))
    .sort();
}

export async function readModuleEnabledPresetsVariables(
  moduleName: string,
): Promise<VarSet> {
  const state = await readModuleLocalState(moduleName);
  const presetVarSets = await Promise.all(
    state.enabledPresets.map((presetName) =>
      readModulePresetVariables({
        moduleName,
        presetName,
      }),
    ),
  );

  return mergeVarSets({
    main: {},
    additional: presetVarSets,
  });
}

export async function readModulePresetVariables({
  moduleName,
  presetName,
}: {
  moduleName: string;
  presetName: string;
}): Promise<VarSet> {
  const presetPath = resolveModulePresetPath({
    moduleName,
    presetName,
  });

  if (!(await pathExists(presetPath))) {
    throw new MothError({
      message: `Missing preset "${presetName}" in module ${moduleName}: ${presetPath}`,
    });
  }

  return readVarSetFromYaml(presetPath);
}

export function resolveModulePresetPath({
  moduleName,
  presetName,
}: {
  moduleName: string;
  presetName: string;
}): string {
  try {
    return resolvePathInsideDir(
      resolveMothPath(moduleName, MODULE_PRESETS_DIR_NAME),
      `${presetName}.yaml`,
    );
  } catch {
    throw new MothError({
      message: `Invalid preset name for module ${moduleName}: ${presetName}`,
    });
  }
}
