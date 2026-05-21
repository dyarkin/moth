import { join } from 'node:path';
import { listMothDir, readMothTextFile } from '@shared/moth-dir';
import type {
  ModuleTemplatesDirectoryTreeItemDir,
  ModuleTemplatesDirectoryTreeItemTemplate,
} from './types';

// TODO:
// 1. reads everything to memory, should optimize in case of large modules
// 2. find a way to deal with binary files
export async function readTemplatesDirectoryTree({
  name,
  relativePath,
}: {
  name: string;
  relativePath: string;
}): Promise<ModuleTemplatesDirectoryTreeItemDir> {
  const { files, dirs } = await listMothDir(relativePath);
  const directoryItems: ModuleTemplatesDirectoryTreeItemDir[] =
    await Promise.all(
      dirs.map((dirName) =>
        readTemplatesDirectoryTree({
          name: dirName,
          relativePath: join(relativePath, dirName),
        }),
      ),
    );
  const templateItems: ModuleTemplatesDirectoryTreeItemTemplate[] =
    await Promise.all(
      files.map(async (fileName) => ({
        name: fileName,
        type: 'template',
        content: await readMothTextFile(join(relativePath, fileName)),
      })),
    );

  return {
    name,
    type: 'dir',
    children: [...directoryItems, ...templateItems],
  };
}
