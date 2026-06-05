import {
  resolveModulePresetPath,
  switchModulePreset,
  type PresetSwitchOperation,
} from '@core/presets';
import { readModuleLocalState, writeModuleLocalState } from '@core/modules';
import { pathExists } from '@lib/util';
import { MothError } from '@shared/errors';

export async function switchModulePresetInLocalState({
  moduleName,
  presetName,
  operation,
}: {
  moduleName: string;
  presetName: string;
  operation: PresetSwitchOperation;
}): Promise<void> {
  const presetPath = resolveModulePresetPath({
    moduleName,
    presetName,
  });

  if (!(await pathExists(presetPath))) {
    throw new MothError({
      message: `Missing preset "${presetName}" in module ${moduleName}: ${presetPath}`,
    });
  }

  const state = await readModuleLocalState(moduleName);
  const { nextState, hasChanged } = switchModulePreset({
    state,
    presetName,
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
