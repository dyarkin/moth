import { join } from 'node:path';
import { readModuleEnabledPresetsVariables } from '@core/presets';
import { mergeVarSets, readVarSetFromYaml } from '@core/variables';
import { listMothDir, resolveMothPath } from '@shared/moth-dir';
import { MODULE_VARIABLES_DIR_NAME } from './consts';
import type { VarSet } from '@core/variables';

export async function readModuleVariables(moduleName: string): Promise<VarSet> {
  const { files } = await listMothDir(
    join(moduleName, MODULE_VARIABLES_DIR_NAME),
  );
  const yamlFilePaths = files
    .filter((fileName) => fileName.endsWith('.yaml'))
    .map((fileName) =>
      resolveMothPath(moduleName, MODULE_VARIABLES_DIR_NAME, fileName),
    );
  const varSets = await Promise.all(
    yamlFilePaths.map((filePath) => readVarSetFromYaml(filePath)),
  );
  const presetVariables = await readModuleEnabledPresetsVariables(moduleName);
  const mergedVariables = mergeVarSets({
    main: {},
    additional: varSets,
  });

  return mergeVarSets({
    main: mergedVariables,
    additional: [presetVariables],
  });
}
