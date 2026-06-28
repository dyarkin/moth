import { join } from 'node:path';
import YAML from 'yaml';
import { MODULE_MANIFEST_FILE_NAME } from './consts';
import type { ModuleManifest, ModuleManifestTemplateConfig } from './types';
import { isPlainObject } from '@lib/util';
import {
  mothPathExists,
  readMothTextFile,
  resolveMothPath,
} from '@shared/moth-dir';
import { MothError } from '@shared/errors';

export async function readModuleManifest({
  moduleName,
}: {
  moduleName: string;
}): Promise<ModuleManifest> {
  const manifestRelativePath = join(moduleName, MODULE_MANIFEST_FILE_NAME);
  const manifestPath = resolveMothPath(manifestRelativePath);

  if (!(await mothPathExists(manifestRelativePath))) {
    throw new MothError({
      message: `Missing module manifest: ${manifestPath}`,
    });
  }

  const manifestText = await readMothTextFile(manifestRelativePath);
  let parsedManifest: unknown;

  try {
    parsedManifest = YAML.parse(manifestText) ?? {};
  } catch (error) {
    throw new MothError({
      message: `Failed to parse ${MODULE_MANIFEST_FILE_NAME} (${manifestPath}). Error: ${error}`,
    });
  }

  return validateModuleManifest({
    manifest: parsedManifest,
    manifestPath,
  });
}

function validateModuleManifest({
  manifest,
  manifestPath,
}: {
  manifest: unknown;
  manifestPath: string;
}): ModuleManifest {
  if (!isPlainObject(manifest)) {
    throw new MothError({
      message: `${MODULE_MANIFEST_FILE_NAME} must define an object: ${manifestPath}`,
    });
  }

  const validatedManifest: ModuleManifest = {};

  for (const [key, value] of Object.entries(manifest)) {
    if (key !== 'templates') {
      validatedManifest[key] = value;
    }
  }

  if (!Object.hasOwn(manifest, 'templates')) {
    return validatedManifest;
  }

  validatedManifest.templates = validateModuleManifestTemplates({
    templates: manifest.templates,
    manifestPath,
  });

  return validatedManifest;
}

function validateModuleManifestTemplates({
  templates,
  manifestPath,
}: {
  templates: unknown;
  manifestPath: string;
}): Record<string, ModuleManifestTemplateConfig> {
  if (!isPlainObject(templates)) {
    throw new MothError({
      message: `templates in ${manifestPath} must be an object`,
    });
  }

  const validatedTemplates: Record<string, ModuleManifestTemplateConfig> = {};

  for (const [templatePath, templateConfig] of Object.entries(templates)) {
    validatedTemplates[templatePath] = validateModuleManifestTemplateConfig({
      templatePath,
      templateConfig,
      manifestPath,
    });
  }

  return validatedTemplates;
}

function validateModuleManifestTemplateConfig({
  templatePath,
  templateConfig,
  manifestPath,
}: {
  templatePath: string;
  templateConfig: unknown;
  manifestPath: string;
}): ModuleManifestTemplateConfig {
  if (!isPlainObject(templateConfig)) {
    throw new MothError({
      message: `templates.${templatePath} in ${manifestPath} must be an object`,
    });
  }

  if (!Object.hasOwn(templateConfig, 'role')) {
    return templateConfig;
  }

  if (templateConfig.role === 'base' || templateConfig.role === 'fragment') {
    return {
      ...templateConfig,
      role: templateConfig.role,
    };
  }

  throw new MothError({
    message: `templates.${templatePath}.role in ${manifestPath} must be "base" or "fragment"`,
  });
}
