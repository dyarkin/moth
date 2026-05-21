import { isMothPathDirectory, listMothDir } from '@shared/moth-dir';

export async function listModules(): Promise<string[]> {
  if (!(await isMothPathDirectory())) {
    return [];
  }

  const { dirs } = await listMothDir();

  return dirs.filter((dirName) => !dirName.startsWith('.')).sort();
}
