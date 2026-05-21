import { MODULE_VARIABLES_DIR_NAME } from '@core/modules/consts';
import { listMothDir, resolveMothPath } from '@shared/moth-dir';
import { mergeVarSets } from './merge-var-sets';
import { readVarSetFromYaml } from './read-variables';
import type { VarSet } from './types';

export async function readModuleVariables(moduleName: string): Promise<VarSet> {
  const { files } = await listMothDir(
    `${moduleName}/${MODULE_VARIABLES_DIR_NAME}`,
  );
  const yamlFilePaths = files
    .filter((fileName) => fileName.endsWith('.yaml'))
    .map((fileName) =>
      resolveMothPath(moduleName, MODULE_VARIABLES_DIR_NAME, fileName),
    );
  const varSets = await Promise.all(
    yamlFilePaths.map((filePath) => readVarSetFromYaml(filePath)),
  );

  return mergeVarSets({
    main: {},
    additional: varSets,
  });
}
