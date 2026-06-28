import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, parse, relative } from 'node:path';
import { readMothConfig } from '@core/config';
import type { ModuleTemplateRole } from '@core/modules/types';
import {
  MODULE_COMPILED_DIR_NAME,
  ROOT_COMPILED_DIR_NAME,
} from '@core/modules/consts';
import {
  compileModule,
  listModules,
  readModuleTemplateRoles,
} from '@core/modules';
import { ensureDirExists, isDirectory, pathExists } from '@lib/util';
import {
  ModulesTargetFileConflictError,
  ModulesTargetPathNotDirectoryError,
  MothError,
} from '@shared/errors';
import { removeMothPath, resolveMothPath } from '@shared/moth-dir';

type CompiledFileContribution = {
  moduleName: string;
  sourceFilePath: string;
  relativeTemplatePath: string;
  targetFilePath: string;
  role: ModuleTemplateRole;
};

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

    const contributions = await collectCompiledFileContributions({
      modules,
      moduleRoots: config.moduleRoots,
    });

    assertNoTargetPathDirectoryConflicts(contributions);
    assertNoTargetFileConflicts(contributions);

    await writeCompiledFileContributions(contributions);
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

async function collectCompiledFileContributions({
  modules,
  moduleRoots,
}: {
  modules: string[];
  moduleRoots: Record<string, string>;
}): Promise<CompiledFileContribution[]> {
  const contributions: CompiledFileContribution[] = [];

  for (const moduleName of modules) {
    contributions.push(
      ...(await collectModuleCompiledFileContributions({
        moduleName,
        moduleRoot: moduleRoots[moduleName]!,
      })),
    );
  }

  return contributions;
}

async function collectModuleCompiledFileContributions({
  moduleName,
  moduleRoot,
}: {
  moduleName: string;
  moduleRoot: string;
}): Promise<CompiledFileContribution[]> {
  const sourceDirPath = resolveMothPath(moduleName, MODULE_COMPILED_DIR_NAME);

  if (!(await isDirectory(sourceDirPath))) {
    throw new MothError({
      message: `Module is not compiled: ${moduleName}`,
    });
  }

  const templateRoles = await readModuleTemplateRoles({ moduleName });
  const relativeTemplatePaths = await listCompiledFileRelativePaths({
    sourceDirPath,
  });
  const compiledTemplatePaths = new Set(relativeTemplatePaths);

  for (const templatePath of Object.keys(templateRoles)) {
    if (!compiledTemplatePaths.has(templatePath)) {
      throw new MothError({
        message: `Template role references missing compiled file: ${moduleName}/${templatePath}`,
      });
    }
  }

  const targetDirPath = resolveMothPath(
    ROOT_COMPILED_DIR_NAME,
    relative(parse(moduleRoot).root, moduleRoot),
  );

  return relativeTemplatePaths.map((relativeTemplatePath) => ({
    moduleName,
    sourceFilePath: join(sourceDirPath, relativeTemplatePath),
    relativeTemplatePath,
    targetFilePath: join(targetDirPath, relativeTemplatePath),
    role: templateRoles[relativeTemplatePath] ?? 'base',
  }));
}

async function listCompiledFileRelativePaths({
  sourceDirPath,
  relativeDirPath = '',
}: {
  sourceDirPath: string;
  relativeDirPath?: string;
}): Promise<string[]> {
  const dirPath = join(sourceDirPath, relativeDirPath);
  const entries = await readdir(dirPath, { withFileTypes: true });
  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(relativeDirPath, entry.name))
    .sort();

  for (const dirName of dirs) {
    files.push(
      ...(await listCompiledFileRelativePaths({
        sourceDirPath,
        relativeDirPath: join(relativeDirPath, dirName),
      })),
    );
  }

  return files;
}

function assertNoTargetPathDirectoryConflicts(
  contributions: CompiledFileContribution[],
): void {
  const targetFilePaths = new Set(
    contributions.map((contribution) => contribution.targetFilePath),
  );

  for (const targetFilePath of targetFilePaths) {
    let parentPath = dirname(targetFilePath);

    while (parentPath !== dirname(parentPath)) {
      if (targetFilePaths.has(parentPath)) {
        throw new ModulesTargetPathNotDirectoryError(parentPath);
      }

      parentPath = dirname(parentPath);
    }
  }
}

function assertNoTargetFileConflicts(
  contributions: CompiledFileContribution[],
): void {
  const targetFilePaths = new Set<string>();

  for (const contribution of contributions) {
    if (targetFilePaths.has(contribution.targetFilePath)) {
      throw new ModulesTargetFileConflictError(contribution.targetFilePath);
    }

    targetFilePaths.add(contribution.targetFilePath);
  }
}

async function writeCompiledFileContributions(
  contributions: CompiledFileContribution[],
): Promise<void> {
  for (const contribution of contributions) {
    await ensureDirExists(dirname(contribution.targetFilePath));

    if (await pathExists(contribution.targetFilePath)) {
      throw new ModulesTargetFileConflictError(contribution.targetFilePath);
    }

    await writeFile(
      contribution.targetFilePath,
      await readFile(contribution.sourceFilePath),
    );
  }
}
