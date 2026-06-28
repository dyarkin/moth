import { readModuleManifest } from './module-manifest';
import type { ModuleTemplateRoles } from './types';

export async function readModuleTemplateRoles({
  moduleName,
}: {
  moduleName: string;
}): Promise<ModuleTemplateRoles> {
  const manifest = await readModuleManifest({
    moduleName,
  });

  if (!manifest.templates) {
    return {};
  }

  const templateRoles: ModuleTemplateRoles = {};

  for (const [templatePath, templateConfig] of Object.entries(
    manifest.templates,
  )) {
    templateRoles[templatePath] = templateConfig.role ?? 'base';
  }

  return templateRoles;
}
