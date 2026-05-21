import { join } from 'node:path';
import { ensureDirExists, writeFileText } from '@lib/util';
import type { ModuleTemplatesTreeItem } from './types';

export async function writeTemplatesTreeToDir({
  targetDirPath,
  items,
  createDirsIfMissing = true,
}: {
  targetDirPath: string;
  items: ModuleTemplatesTreeItem[];
  createDirsIfMissing?: boolean;
}): Promise<void> {
  if (createDirsIfMissing) {
    await ensureDirExists(targetDirPath);
  }

  await Promise.all(
    items.map(async (item) => {
      const itemPath = join(targetDirPath, item.name);

      if (item.type === 'dir') {
        if (createDirsIfMissing) {
          await ensureDirExists(itemPath);
        }

        await writeTemplatesTreeToDir({
          targetDirPath: itemPath,
          items: item.children,
          createDirsIfMissing,
        });
        return;
      }

      await writeFileText({
        filePath: itemPath,
        content: item.content,
      });
    }),
  );
}
