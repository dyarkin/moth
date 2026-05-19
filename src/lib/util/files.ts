import {
  lstat,
  mkdir,
  readFile,
  readlink,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { dirname } from 'node:path';

/*
We delibirately abstract from js-runtime specific methods so we can migrate to a different runtime with ease if it's needed
*/

export async function readFileText(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, 'utf8');
  } catch (e) {
    throw new Error(`Failed to read file: ${filePath}. Error: ${e}`);
  }
}

export async function ensureDirExists(dirPath: string): Promise<string> {
  await mkdir(dirPath, { recursive: true });

  return dirPath;
}

export async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (e) {
    if (isNotFoundError(e)) {
      return false;
    }

    throw e;
  }
}

function isNotFoundError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }

  // ENOENT means the filesystem entry simply does not exist.
  // We treat only this case as a regular `false` branch and rethrow all others.
  return error.code === 'ENOENT';
}

export async function isDirectory(path: string): Promise<boolean> {
  try {
    const pathStats = await stat(path);
    return pathStats.isDirectory();
  } catch (e) {
    if (isNotFoundError(e)) {
      return false;
    }

    throw e;
  }
}

type ListDirResult = {
  files: string[];
  dirs: string[];
};

export async function listDir(path: string): Promise<ListDirResult> {
  const entries = await readdir(path, { withFileTypes: true });

  return entries.reduce<ListDirResult>(
    (acc, entry) => {
      if (entry.isDirectory()) {
        acc.dirs.push(entry.name);
      } else {
        acc.files.push(entry.name);
      }

      return acc;
    },
    { files: [], dirs: [] },
  );
}

export async function writeFileText({
  filePath,
  content,
}: {
  filePath: string;
  content: string;
}): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, 'utf8');
}

export async function removePath(path: string): Promise<void> {
  await rm(path, { recursive: true, force: true });
}

export async function getSymlinkTarget(path: string): Promise<string | null> {
  const pathStats = await lstat(path);

  if (!pathStats.isSymbolicLink()) {
    return null;
  }

  return readlink(path);
}
