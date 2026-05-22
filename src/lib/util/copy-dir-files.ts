import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ensureDirExists, isDirectory, pathExists } from './files';

export const COPY_DIR_FILES_ERROR_CODES = {
  TARGET_PATH_IS_NOT_DIRECTORY: 'TARGET_PATH_IS_NOT_DIRECTORY',
  TARGET_FILE_ALREADY_EXISTS: 'TARGET_FILE_ALREADY_EXISTS',
} as const;

export type CopyDirFilesErrorCode =
  (typeof COPY_DIR_FILES_ERROR_CODES)[keyof typeof COPY_DIR_FILES_ERROR_CODES];

type CopyDirFilesErrorArgs = {
  code: CopyDirFilesErrorCode;
  path: string;
};

export class CopyDirFilesError extends Error {
  code: CopyDirFilesErrorCode;
  path: string;

  constructor({ code, path }: CopyDirFilesErrorArgs) {
    super(code);
    this.name = 'CopyDirFilesError';
    this.code = code;
    this.path = path;
  }
}

export function isCopyDirFilesError(
  error: unknown,
): error is CopyDirFilesError {
  return error instanceof CopyDirFilesError;
}

export async function copyDirFilesRecursively({
  sourceDirPath,
  targetDirPath,
}: {
  sourceDirPath: string;
  targetDirPath: string;
}): Promise<void> {
  if (
    (await pathExists(targetDirPath)) &&
    !(await isDirectory(targetDirPath))
  ) {
    throw new CopyDirFilesError({
      code: COPY_DIR_FILES_ERROR_CODES.TARGET_PATH_IS_NOT_DIRECTORY,
      path: targetDirPath,
    });
  }

  await ensureDirExists(targetDirPath);

  const entries = await readdir(sourceDirPath, {
    withFileTypes: true,
  });
  const dirs = entries.filter((entry) => entry.isDirectory());
  const files = entries.filter((entry) => entry.isFile());

  for (const dir of dirs) {
    await copyDirFilesRecursively({
      sourceDirPath: join(sourceDirPath, dir.name),
      targetDirPath: join(targetDirPath, dir.name),
    });
  }

  for (const file of files) {
    const sourceFilePath = join(sourceDirPath, file.name);
    const targetFilePath = join(targetDirPath, file.name);

    if (await pathExists(targetFilePath)) {
      throw new CopyDirFilesError({
        code: COPY_DIR_FILES_ERROR_CODES.TARGET_FILE_ALREADY_EXISTS,
        path: targetFilePath,
      });
    }

    await writeFile(targetFilePath, await readFile(sourceFilePath));
  }
}
