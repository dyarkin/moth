import type { ModuleLocalState } from '@core/modules/types';
import { MothError } from '@shared/errors';
import { parsePresetFullNameToParts } from './preset-name';
import type {
  ParsedPresetFullNameParts,
  PresetFullName,
  PresetGroupName,
} from './types';

export type PresetSwitchOperation = 'enable' | 'disable';

export type SwitchModulePresetResult = {
  nextState: ModuleLocalState;
  hasChanged: boolean;
};

export function switchModulePreset({
  state,
  presetFullName,
  operation,
}: {
  state: ModuleLocalState;
  presetFullName: PresetFullName;
  operation: PresetSwitchOperation;
}): SwitchModulePresetResult {
  const targetPresetParts = parsePresetFullNameToParts(presetFullName);

  if (operation === 'enable') {
    const enableResult =
      targetPresetParts.groupName === null
        ? addUngroupedPresetFullNameIfMissing({
            enabledPresetFullNames: state.enabledPresets,
            targetPresetFullName: targetPresetParts.presetFullName,
          })
        : replacePresetFullNameFromSameGroup({
            enabledPresetFullNames: state.enabledPresets,
            targetPresetParts: {
              ...targetPresetParts,
              groupName: targetPresetParts.groupName,
            },
          });

    if (!enableResult.hasChanged) {
      return {
        nextState: state,
        hasChanged: false,
      };
    }

    return {
      nextState: {
        ...state,
        enabledPresets: enableResult.nextEnabledPresetFullNames,
      },
      hasChanged: true,
    };
  }

  if (!state.enabledPresets.includes(presetFullName)) {
    return {
      nextState: state,
      hasChanged: false,
    };
  }

  return {
    nextState: {
      ...state,
      enabledPresets: state.enabledPresets.filter(
        (enabledPresetFullName) => enabledPresetFullName !== presetFullName,
      ),
    },
    hasChanged: true,
  };
}

function addUngroupedPresetFullNameIfMissing({
  enabledPresetFullNames,
  targetPresetFullName,
}: {
  enabledPresetFullNames: string[];
  targetPresetFullName: PresetFullName;
}): {
  nextEnabledPresetFullNames: PresetFullName[];
  hasChanged: boolean;
} {
  const containsTargetPresetFullName =
    enabledPresetFullNames.includes(targetPresetFullName);

  return {
    nextEnabledPresetFullNames: containsTargetPresetFullName
      ? (enabledPresetFullNames as PresetFullName[])
      : ([...enabledPresetFullNames, targetPresetFullName] as PresetFullName[]),
    hasChanged: !containsTargetPresetFullName,
  };
}

function replacePresetFullNameFromSameGroup({
  enabledPresetFullNames,
  targetPresetParts,
}: {
  enabledPresetFullNames: string[];
  targetPresetParts: ParsedPresetFullNameParts & {
    groupName: PresetGroupName;
  };
}): {
  nextEnabledPresetFullNames: PresetFullName[];
  hasChanged: boolean;
} {
  const enabledPresetEntries = enabledPresetFullNames.map(
    (enabledPresetFullName, index): EnabledPresetEntry => {
      const parsedEnabledPresetFullName = parsePresetFullNameToParts(
        enabledPresetFullName,
      );

      return {
        index,
        presetFullName: parsedEnabledPresetFullName.presetFullName,
        groupName: parsedEnabledPresetFullName.groupName,
      };
    },
  );
  let enabledPresetEntryInTargetGroup: EnabledPresetEntry | null = null;

  for (const enabledPresetEntry of enabledPresetEntries) {
    if (enabledPresetEntry.groupName !== targetPresetParts.groupName) {
      continue;
    }

    if (enabledPresetEntryInTargetGroup) {
      throw new MothError({
        message: `Invalid enabled presets state: group "${targetPresetParts.groupName}" has multiple enabled presets: ${enabledPresetEntryInTargetGroup.presetFullName}, ${enabledPresetEntry.presetFullName}`,
      });
    }

    enabledPresetEntryInTargetGroup = enabledPresetEntry;
  }

  if (!enabledPresetEntryInTargetGroup) {
    return {
      nextEnabledPresetFullNames: [
        ...enabledPresetEntries.map(
          (enabledPresetEntry) => enabledPresetEntry.presetFullName,
        ),
        targetPresetParts.presetFullName,
      ],
      hasChanged: true,
    };
  }

  if (
    enabledPresetEntryInTargetGroup.presetFullName ===
    targetPresetParts.presetFullName
  ) {
    return {
      nextEnabledPresetFullNames: enabledPresetFullNames as PresetFullName[],
      hasChanged: false,
    };
  }

  return {
    nextEnabledPresetFullNames: enabledPresetEntries.map(
      (enabledPresetEntry) =>
        enabledPresetEntry.index === enabledPresetEntryInTargetGroup.index
          ? targetPresetParts.presetFullName
          : enabledPresetEntry.presetFullName,
    ),
    hasChanged: true,
  };
}

type EnabledPresetEntry = {
  index: number;
  presetFullName: PresetFullName;
  groupName: PresetGroupName | null;
};
