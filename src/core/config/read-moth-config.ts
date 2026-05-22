import { homedir } from 'node:os';
import { isAbsolute as isAbsolutePath, join } from 'node:path';
import YAML from 'yaml';
import { YAMLParseError } from 'yaml';
import { MOTH_CONFIG_FILE_NAME } from '@core/modules/consts';
import { isPlainObject } from '@lib/util';
import type { MothConfig } from '@core/config/types';
import {
  mothPathExists,
  readMothTextFile,
  resolveMothPath,
} from '@shared/moth-dir';
import { MothError } from '@shared/errors';

export async function readMothConfig(): Promise<MothConfig> {
  const configPath = resolveMothPath(MOTH_CONFIG_FILE_NAME);

  if (!(await mothPathExists(MOTH_CONFIG_FILE_NAME))) {
    throw new MothError({
      message: `Missing moth config file: ${configPath}. Create ${MOTH_CONFIG_FILE_NAME} with moduleRoots.`,
    });
  }

  const configText = await readMothTextFile(MOTH_CONFIG_FILE_NAME);
  let config: unknown;

  try {
    config = YAML.parse(configText);
  } catch (error) {
    throw createConfigParseError({
      configPath,
      error,
    });
  }

  if (!isPlainObject(config) || !isPlainObject(config.moduleRoots)) {
    throw new MothError({
      message: `${MOTH_CONFIG_FILE_NAME} must define moduleRoots object`,
    });
  }

  return {
    moduleRoots: parseModuleRoots(config.moduleRoots),
  };
}

function parseModuleRoots(moduleRoots: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(moduleRoots).map(([moduleName, rootPath]) => {
      if (isPlainObject(rootPath) || Array.isArray(rootPath)) {
        throw new MothError({
          message: `moduleRoots.${moduleName} in ${MOTH_CONFIG_FILE_NAME} must be a string`,
        });
      }

      const normalizedRootPath = normalizeModuleRoot(String(rootPath));

      if (!isAbsolutePath(normalizedRootPath)) {
        throw new MothError({
          message: `moduleRoots.${moduleName} must be an absolute path`,
        });
      }

      return [moduleName, normalizedRootPath];
    }),
  );
}

function normalizeModuleRoot(rootPath: string): string {
  return rootPath === '~' || rootPath.startsWith('~/')
    ? join(homedir(), rootPath.slice(2))
    : rootPath;
}

function createConfigParseError({
  configPath,
  error,
}: {
  configPath: string;
  error: unknown;
}): MothError {
  if (error instanceof YAMLParseError && error.code === 'DUPLICATE_KEY') {
    return new MothError({
      message: `Invalid ${MOTH_CONFIG_FILE_NAME}: duplicate keys are not allowed (${configPath}). ${error.message}`,
    });
  }

  if (error instanceof YAMLParseError) {
    return new MothError({
      message: `Failed to parse ${MOTH_CONFIG_FILE_NAME} (${configPath}): ${error.message}`,
    });
  }

  return new MothError({
    message: `Failed to parse ${MOTH_CONFIG_FILE_NAME} (${configPath}). Error: ${error}`,
  });
}
