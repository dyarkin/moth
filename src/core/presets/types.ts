import type { OpaqueString } from '@shared/types';

// Preset full names use one of two formats:
// - "<preset>"
// - "<group>/<preset>"
export type PresetFullName = OpaqueString<'PresetFullName'>;
export type PresetGroupName = OpaqueString<'PresetGroupName'>;
export type PresetTopName = OpaqueString<'PresetTopName'>;
export type PresetFilePathInPresetsDir =
  OpaqueString<'PresetFilePathInPresetsDir'>;

export type ParsedPresetFullNameParts = {
  presetFullName: PresetFullName;
  groupName: PresetGroupName | null;
  presetTopName: PresetTopName;
};
