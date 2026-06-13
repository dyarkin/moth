import { basename, extname, join } from 'node:path';
import { MODULE_PRESETS_DIR_NAME } from '@core/modules/consts';
import { readModuleLocalState } from '@core/modules/read-module-local-state';
import { mergeVarSets, readVarSetFromYaml } from '@core/variables';
import { pathExists, resolvePathInsideDir } from '@lib/util';
import { listMothDir, mothPathExists, resolveMothPath } from '@shared/moth-dir';
import { MothError } from '@shared/errors';
import {
  getPresetFilePathInPresetsDir,
  parsePresetFullNameToParts,
} from './preset-name';
import type { PresetFullName } from './types';
import type { VarSet } from '@core/variables';

export async function listModulePresetFullNames(
  moduleName: string,
): Promise<PresetFullName[]> {
  const presetsRelativePath = join(moduleName, MODULE_PRESETS_DIR_NAME);

  if (!(await mothPathExists(presetsRelativePath))) {
    return [];
  }

  return listModulePresetFullNamesInDir(presetsRelativePath);
}

export async function readModuleEnabledPresetsVariables(
  moduleName: string,
): Promise<VarSet> {
  const state = await readModuleLocalState(moduleName);
  const presetVarSets = await Promise.all(
    state.enabledPresets.map((enabledPresetFullName) =>
      readModulePresetVariablesByFullName({
        moduleName,
        presetFullName: parsePresetFullNameToParts(enabledPresetFullName)
          .presetFullName,
      }),
    ),
  );

  return mergeVarSets({
    main: {},
    additional: presetVarSets,
  });
}

export async function readModulePresetVariablesByFullName({
  moduleName,
  presetFullName,
}: {
  moduleName: string;
  presetFullName: PresetFullName;
}): Promise<VarSet> {
  const presetFilePath = resolveModulePresetFilePathFromFullName({
    moduleName,
    presetFullName,
  });

  if (!(await pathExists(presetFilePath))) {
    throw new MothError({
      message: `Missing preset "${presetFullName}" in module ${moduleName}: ${presetFilePath}`,
    });
  }

  return readVarSetFromYaml(presetFilePath);
}

export function resolveModulePresetFilePathFromFullName({
  moduleName,
  presetFullName,
}: {
  moduleName: string;
  presetFullName: PresetFullName;
}): string {
  const presetFilePathInPresetsDir = getPresetFilePathInPresetsDir({
    presetFullName,
  });

  return resolvePathInsideDir(
    resolveMothPath(moduleName, MODULE_PRESETS_DIR_NAME),
    presetFilePathInPresetsDir,
  );
}

async function listModulePresetFullNamesInDir(
  presetsRelativePath: string,
): Promise<PresetFullName[]> {
  const { files, dirs } = await listMothDir(presetsRelativePath);
  const directPresetFullNames = files
    .filter((fileName) => fileName.endsWith('.yaml'))
    .map(
      (fileName) =>
        parsePresetFullNameToParts(basename(fileName, extname(fileName)))
          .presetFullName,
    );
  const groupedPresetFullNames = await Promise.all(
    dirs.map(async (dirName) => {
      const groupRelativePath = join(presetsRelativePath, dirName);
      const { files: groupFiles, dirs: nestedDirs } =
        await listMothDir(groupRelativePath);

      if (nestedDirs.length > 0) {
        const firstNestedDirName = nestedDirs[0] as string;

        throw new MothError({
          message: `Nested preset groups are not supported: ${join(dirName, firstNestedDirName)}`,
        });
      }

      return groupFiles
        .filter((fileName) => fileName.endsWith('.yaml'))
        .map(
          (fileName) =>
            parsePresetFullNameToParts(
              `${dirName}/${basename(fileName, extname(fileName))}`,
            ).presetFullName,
        );
    }),
  );

  return [...directPresetFullNames, ...groupedPresetFullNames.flat()].sort();
}
