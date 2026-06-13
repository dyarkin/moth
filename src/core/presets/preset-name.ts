import { join } from 'node:path';
import { MothError } from '@shared/errors';
import type {
  ParsedPresetFullNameParts,
  PresetFilePathInPresetsDir,
  PresetFullName,
  PresetGroupName,
  PresetTopName,
} from './types';

export function parsePresetFullNameToParts(
  presetFullNameInput: string,
): ParsedPresetFullNameParts {
  const presetFullNameParts = presetFullNameInput.split('/');
  const [firstPresetFullNamePart, secondPresetFullNamePart] =
    presetFullNameParts;

  if (
    presetFullNameParts.length === 0 ||
    presetFullNameParts.length > 2 ||
    presetFullNameParts.some((part) => part.length === 0)
  ) {
    throw new MothError({
      message: `Invalid preset name: ${presetFullNameInput}. Supported formats are "<preset>" and "<group>/<preset>"`,
    });
  }

  if (presetFullNameParts.length === 1) {
    return {
      presetFullName: presetFullNameInput as PresetFullName,
      groupName: null,
      presetTopName: firstPresetFullNamePart as PresetTopName,
    };
  }

  return {
    presetFullName: presetFullNameInput as PresetFullName,
    groupName: firstPresetFullNamePart as PresetGroupName,
    presetTopName: secondPresetFullNamePart as PresetTopName,
  };
}

export function getPresetFilePathInPresetsDir({
  presetFullName,
}: {
  presetFullName: PresetFullName;
}): PresetFilePathInPresetsDir {
  const { groupName, presetTopName } =
    parsePresetFullNameToParts(presetFullName);
  const presetFileName = `${presetTopName}.yaml`;

  if (groupName === null) {
    return presetFileName as PresetFilePathInPresetsDir;
  }

  return join(groupName, presetFileName) as PresetFilePathInPresetsDir;
}
