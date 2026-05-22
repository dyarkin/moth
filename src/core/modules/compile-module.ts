import { MODULE_COMPILED_DIR_NAME } from './consts';
import { readModuleTemplatesTree } from './read-module-templates-tree';
import { readModuleVariables } from './read-module-variables';
import {
  compileTemplatesTreeItems,
  writeTemplatesTreeToDir,
} from '@core/templates';
import { removePath } from '@lib/util';
import { resolveMothPath } from '@shared/moth-dir';

export async function compileModule(moduleName: string): Promise<string> {
  const templatesTree = await readModuleTemplatesTree(moduleName);
  const moduleVariables = await readModuleVariables(moduleName);
  const compiledTemplatesTree = compileTemplatesTreeItems({
    items: templatesTree,
    varSet: moduleVariables,
  });
  const compiledDirPath = resolveMothPath(moduleName, MODULE_COMPILED_DIR_NAME);

  await removePath(compiledDirPath);
  await writeTemplatesTreeToDir({
    targetDirPath: compiledDirPath,
    items: compiledTemplatesTree,
    createDirsIfMissing: true,
  });

  return compiledDirPath;
}
