import { ensureDirExists } from '@lib/util';
import {
  ensureMothDirExists,
  isMothPathDirectory,
  listMothDir,
  mothPathExists,
  resolveMothPath,
  writeMothTextFile,
} from '@shared/moth-dir';
import {
  MODULE_MANIFEST_FILE_NAME,
  MODULE_TEMPLATES_DIR_NAME,
  MODULE_VARIABLES_DIR_NAME,
} from '@core/modules/consts';

export async function listModules(): Promise<string[]> {
  if (!(await isMothPathDirectory())) {
    return [];
  }

  const { dirs } = await listMothDir();

  return dirs.filter((dirName) => !dirName.startsWith('.')).sort();
}

export async function scaffoldModule(moduleName: string): Promise<string> {
  await ensureMothDirExists();

  if (await mothPathExists(moduleName)) {
    throw new Error(`Module with such name already exists: ${moduleName}`);
  }

  const modulePath = resolveMothPath(moduleName);

  await ensureDirExists(modulePath);
  await writeMothTextFile({
    relativePath: `${moduleName}/${MODULE_MANIFEST_FILE_NAME}`,
    content: '',
  });
  await ensureDirExists(resolveMothPath(moduleName, MODULE_TEMPLATES_DIR_NAME));
  await ensureDirExists(resolveMothPath(moduleName, MODULE_VARIABLES_DIR_NAME));

  return modulePath;
}
