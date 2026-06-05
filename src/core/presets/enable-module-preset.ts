import { readModuleLocalState } from '@core/modules/read-module-local-state';
import { writeModuleLocalState } from '@core/modules/write-module-local-state';
import { pathExists } from '@lib/util';
import { MothError } from '@shared/errors';
import { resolveModulePresetPath } from './read-module-presets';

// AITODO: I think we need to refactor this function on several levels:
// 1. it should take argument for the type operation: `enable` | `disable`, and because of that renamed to `switchModulePreset`
// 2. I do not like that in handles switching process end-to-end, from reading to writing. I prefer this function to work with the ModuleLocalState that is passed in params, and path testing and result writing must be kept in command code. If we need a helper function that handles it end-to-end, it must be a separate function that would use this one
export async function enableModulePreset({
  moduleName,
  presetName,
}: {
  moduleName: string;
  presetName: string;
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

  if (state.enabledPresets.includes(presetName)) {
    return;
  }

  await writeModuleLocalState({
    moduleName,
    state: {
      ...state,
      enabledPresets: [...state.enabledPresets, presetName],
    },
  });
}
