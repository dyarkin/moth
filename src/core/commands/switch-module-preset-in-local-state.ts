import {
  parsePresetFullNameToParts,
  resolveModulePresetFilePathFromFullName,
  switchModulePreset,
  type PresetSwitchOperation,
} from '@core/presets';
import { readModuleLocalState, writeModuleLocalState } from '@core/modules';
import { pathExists } from '@lib/util';
import { MothError } from '@shared/errors';

export async function switchModulePresetInLocalState({
  moduleName,
  presetFullNameInput,
  operation,
}: {
  moduleName: string;
  presetFullNameInput: string;
  operation: PresetSwitchOperation;
}): Promise<void> {
  const { presetFullName } = parsePresetFullNameToParts(presetFullNameInput);
  const presetFilePath = resolveModulePresetFilePathFromFullName({
    moduleName,
    presetFullName,
  });

  if (!(await pathExists(presetFilePath))) {
    throw new MothError({
      message: `Missing preset "${presetFullName}" in module ${moduleName}: ${presetFilePath}`,
    });
  }

  const state = await readModuleLocalState(moduleName);
  const { nextState, hasChanged } = switchModulePreset({
    state,
    presetFullName,
    operation,
  });

  if (!hasChanged) {
    return;
  }

  await writeModuleLocalState({
    moduleName,
    state: nextState,
  });
}
