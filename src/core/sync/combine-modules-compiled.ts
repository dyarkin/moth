import { parse, relative } from 'node:path';
import { readMothConfig } from '@core/config';
import {
  MODULE_COMPILED_DIR_NAME,
  ROOT_COMPILED_DIR_NAME,
} from '@core/modules/consts';
import { compileModule, listModules } from '@core/modules';
import {
  COPY_DIR_FILES_ERROR_CODES,
  CopyDirFilesError,
  copyDirFilesRecursively,
  ensureDirExists,
  isDirectory,
  isCopyDirFilesError,
} from '@lib/util';
import {
  ModulesTargetFileConflictError,
  ModulesTargetPathNotDirectoryError,
  MothError,
} from '@shared/errors';
import { removeMothPath, resolveMothPath } from '@shared/moth-dir';

export async function combineModulesCompiled({
  shouldCompile,
}: {
  shouldCompile: boolean;
}): Promise<string> {
  const modules = await listModules();
  const config = await readMothConfig();

  assertAllModulesHaveRoots({
    modules,
    moduleRoots: config.moduleRoots,
  });

  if (shouldCompile) {
    await Promise.all(modules.map((moduleName) => compileModule(moduleName)));
  }

  try {
    await removeMothPath(ROOT_COMPILED_DIR_NAME);
    await ensureDirExists(resolveMothPath(ROOT_COMPILED_DIR_NAME));

    for (const moduleName of modules) {
      await copyModuleCompiledDir({
        moduleName,
        moduleRoot: config.moduleRoots[moduleName]!,
      });
    }
  } catch (e) {
    await removeMothPath(ROOT_COMPILED_DIR_NAME);
    throw e;
  }

  return resolveMothPath(ROOT_COMPILED_DIR_NAME);
}

function assertAllModulesHaveRoots({
  modules,
  moduleRoots,
}: {
  modules: string[];
  moduleRoots: Record<string, string>;
}): void {
  const missingModuleNames = modules.filter(
    (moduleName) => !Object.hasOwn(moduleRoots, moduleName),
  );

  if (missingModuleNames.length > 0) {
    throw new MothError({
      message: `Missing moduleRoots entries for modules: ${missingModuleNames.join(', ')}`,
    });
  }
}

async function copyModuleCompiledDir({
  moduleName,
  moduleRoot,
}: {
  moduleName: string;
  moduleRoot: string;
}): Promise<void> {
  const sourceDirPath = resolveMothPath(moduleName, MODULE_COMPILED_DIR_NAME);

  if (!(await isDirectory(sourceDirPath))) {
    throw new MothError({
      message: `Module is not compiled: ${moduleName}`,
    });
  }

  try {
    await copyDirFilesRecursively({
      sourceDirPath,
      targetDirPath: resolveMothPath(
        ROOT_COMPILED_DIR_NAME,
        relative(parse(moduleRoot).root, moduleRoot),
      ),
    });
  } catch (e) {
    if (!isCopyDirFilesError(e)) {
      throw e;
    }

    throw mapCopyDirFilesErrorToMothError(e);
  }
}

function mapCopyDirFilesErrorToMothError(error: CopyDirFilesError): MothError {
  switch (error.code) {
    case COPY_DIR_FILES_ERROR_CODES.TARGET_FILE_ALREADY_EXISTS:
      return new ModulesTargetFileConflictError(error.path);
    case COPY_DIR_FILES_ERROR_CODES.TARGET_PATH_IS_NOT_DIRECTORY:
      return new ModulesTargetPathNotDirectoryError(error.path);
  }
}
