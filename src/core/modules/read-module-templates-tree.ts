import { join } from 'node:path';
import { readTemplatesDirectoryTree } from '@core/templates';
import { MODULE_TEMPLATES_DIR_NAME } from './consts';
import type { ModuleTemplatesTreeItem } from '@core/templates/types';

export async function readModuleTemplatesTree(
  moduleName: string,
): Promise<ModuleTemplatesTreeItem[]> {
  const templatesRelativePath = join(moduleName, MODULE_TEMPLATES_DIR_NAME);
  const templatesRoot = await readTemplatesDirectoryTree({
    name: MODULE_TEMPLATES_DIR_NAME,
    relativePath: templatesRelativePath,
  });

  return templatesRoot.children;
}
