import { homedir } from 'node:os';
import { join } from 'node:path';
import {
  ensureDirExists,
  isDirectory,
  listDir,
  pathExists,
  readFileText,
  removePath,
  resolvePathInsideDir,
  writeFileText,
} from '@lib/util';

const DEFAULT_MOTH_DIR_NAME = '.moth';

// Build-time placeholders. Your bundler/build step can replace these with string
// literals for test builds. If they are not replaced, they stay undefined.
declare const __MOTH_DIR_NAME__: string | undefined;
declare const __MOTH_DIR_PATH__: string | undefined;

// `typeof` keeps this safe when placeholders are not defined at runtime.
const buildTimeMothDirName =
  typeof __MOTH_DIR_NAME__ === 'undefined' ? undefined : __MOTH_DIR_NAME__;
const buildTimeMothDirPath =
  typeof __MOTH_DIR_PATH__ === 'undefined' ? undefined : __MOTH_DIR_PATH__;
const runtimeMothDirName = process.env.MOTH_DIR_NAME?.trim() || undefined;
const runtimeMothDirPath = process.env.MOTH_DIR_PATH?.trim() || undefined;

export const MOTH_DIR_NAME =
  buildTimeMothDirName ?? runtimeMothDirName ?? DEFAULT_MOTH_DIR_NAME;
export const MOTH_DIR_PATH =
  buildTimeMothDirPath ?? runtimeMothDirPath ?? join(homedir(), MOTH_DIR_NAME);

export function resolveMothPath(...pathSegments: string[]): string {
  return resolvePathInsideDir(MOTH_DIR_PATH, ...pathSegments);
}

export async function ensureMothDirExists(): Promise<string> {
  return ensureDirExists(MOTH_DIR_PATH);
}

export async function mothPathExists(relativePath = ''): Promise<boolean> {
  const path = resolveMothPath(relativePath);

  return pathExists(path);
}

export async function isMothPathDirectory(relativePath = ''): Promise<boolean> {
  const path = resolveMothPath(relativePath);

  return isDirectory(path);
}

export async function listMothDir(relativePath = ''): Promise<{
  files: string[];
  dirs: string[];
}> {
  const path = resolveMothPath(relativePath);

  return listDir(path);
}

export async function readMothTextFile(relativePath: string): Promise<string> {
  const path = resolveMothPath(relativePath);

  return readFileText(path);
}

type WriteMothTextFileArgs = {
  relativePath: string;
  content: string;
};

export async function writeMothTextFile({
  relativePath,
  content,
}: WriteMothTextFileArgs): Promise<void> {
  const path = resolveMothPath(relativePath);

  await writeFileText({
    filePath: path,
    content,
  });
}

export async function removeMothPath(relativePath: string): Promise<void> {
  const path = resolveMothPath(relativePath);

  await removePath(path);
}
