import { ensureDirExists } from '@lib/util';
import { MothError } from '@shared/errors';
import {
  ensureMothDirExists,
  mothPathExists,
  resolveMothPath,
  writeMothTextFile,
} from '@shared/moth-dir';
import {
  MODULE_MANIFEST_FILE_NAME,
  MODULE_PRESETS_DIR_NAME,
  MODULE_SNIPPETS_DIR_NAME,
  MODULE_TEMPLATES_DIR_NAME,
  MODULE_VARIABLES_DIR_NAME,
} from './consts';

export async function scaffoldModule(moduleName: string): Promise<string> {
  await ensureMothDirExists();

  if (await mothPathExists(moduleName)) {
    throw new MothError({
      message: `Module with such name already exists: ${moduleName}`,
    });
  }

  const modulePath = resolveMothPath(moduleName);

  await ensureDirExists(modulePath);
  await writeMothTextFile({
    relativePath: `${moduleName}/${MODULE_MANIFEST_FILE_NAME}`,
    content: '',
  });
  await ensureDirExists(resolveMothPath(moduleName, MODULE_TEMPLATES_DIR_NAME));
  await ensureDirExists(resolveMothPath(moduleName, MODULE_VARIABLES_DIR_NAME));
  await ensureDirExists(resolveMothPath(moduleName, MODULE_PRESETS_DIR_NAME));
  await ensureDirExists(resolveMothPath(moduleName, MODULE_SNIPPETS_DIR_NAME));

  return modulePath;
}
