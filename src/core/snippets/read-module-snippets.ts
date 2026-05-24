import { basename, extname, join } from 'node:path';
import { MODULE_SNIPPETS_DIR_NAME } from '@core/modules/consts';
import { MothError } from '@shared/errors';
import {
  listMothDir,
  mothPathExists,
  readMothTextFile,
} from '@shared/moth-dir';
import type { SnippetSet } from './types';

export async function readModuleSnippets(
  moduleName: string,
): Promise<SnippetSet> {
  const snippetsRelativePath = join(moduleName, MODULE_SNIPPETS_DIR_NAME);

  if (!(await mothPathExists(snippetsRelativePath))) {
    return {};
  }

  const { files } = await listMothDir(snippetsRelativePath);
  const snippets: SnippetSet = {};

  for (const fileName of files) {
    const snippetName = getSnippetName(fileName);

    if (Object.hasOwn(snippets, snippetName)) {
      throw new MothError({
        message: `Duplicate snippet name in module ${moduleName}: ${snippetName}`,
      });
    }

    snippets[snippetName] = await readMothTextFile(
      join(snippetsRelativePath, fileName),
    );
  }

  return snippets;
}

function getSnippetName(fileName: string): string {
  return basename(fileName, extname(fileName));
}
