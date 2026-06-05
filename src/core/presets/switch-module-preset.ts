import type { ModuleLocalState } from '@core/modules/types';

export type PresetSwitchOperation = 'enable' | 'disable';

export function switchModulePreset({
  state,
  presetName,
  operation,
}: {
  state: ModuleLocalState;
  presetName: string;
  operation: PresetSwitchOperation;
}): ModuleLocalState {
  if (operation === 'enable') {
    if (state.enabledPresets.includes(presetName)) {
      return state;
    }

    return {
      ...state,
      enabledPresets: [...state.enabledPresets, presetName],
    };
  }

  if (!state.enabledPresets.includes(presetName)) {
    return state;
  }

  return {
    ...state,
    enabledPresets: state.enabledPresets.filter(
      (enabledPresetName) => enabledPresetName !== presetName,
    ),
  };
}
