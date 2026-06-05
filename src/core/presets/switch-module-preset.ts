import type { ModuleLocalState } from '@core/modules/types';

export type PresetSwitchOperation = 'enable' | 'disable';

export type SwitchModulePresetResult = {
  nextState: ModuleLocalState;
  hasChanged: boolean;
};

export function switchModulePreset({
  state,
  presetName,
  operation,
}: {
  state: ModuleLocalState;
  presetName: string;
  operation: PresetSwitchOperation;
}): SwitchModulePresetResult {
  if (operation === 'enable') {
    if (state.enabledPresets.includes(presetName)) {
      return {
        nextState: state,
        hasChanged: false,
      };
    }

    return {
      nextState: {
        ...state,
        enabledPresets: [...state.enabledPresets, presetName],
      },
      hasChanged: true,
    };
  }

  if (!state.enabledPresets.includes(presetName)) {
    return {
      nextState: state,
      hasChanged: false,
    };
  }

  return {
    nextState: {
      ...state,
      enabledPresets: state.enabledPresets.filter(
        (enabledPresetName) => enabledPresetName !== presetName,
      ),
    },
    hasChanged: true,
  };
}
