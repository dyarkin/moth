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

  const snippets: SnippetSet = {};
  const snippetSources: Record<string, string> = {};

  await readSnippetsDirectory({
    moduleName,
    relativePath: snippetsRelativePath,
    publicNameSegments: [],
    snippets,
    snippetSources,
  });

  return snippets;
}

async function readSnippetsDirectory({
  moduleName,
  relativePath,
  publicNameSegments,
  snippets,
  snippetSources,
}: {
  moduleName: string;
  relativePath: string;
  publicNameSegments: string[];
  snippets: SnippetSet;
  snippetSources: Record<string, string>;
}): Promise<void> {
  const { files, dirs } = await listMothDir(relativePath);

  for (const fileName of files) {
    const snippetName = getSnippetName({ fileName, publicNameSegments });
    const snippetRelativePath = join(relativePath, fileName);

    if (Object.hasOwn(snippetSources, snippetName)) {
      const existingSnippetSource = snippetSources[snippetName];

      throw new MothError({
        message: `Duplicate snippet name in module ${moduleName}: ${snippetName}. Conflicting files: ${existingSnippetSource}, ${snippetRelativePath}`,
      });
    }

    snippetSources[snippetName] = snippetRelativePath;
    snippets[snippetName] = await readMothTextFile(snippetRelativePath);
  }

  for (const dirName of dirs) {
    await readSnippetsDirectory({
      moduleName,
      relativePath: join(relativePath, dirName),
      publicNameSegments: [...publicNameSegments, dirName],
      snippets,
      snippetSources,
    });
  }
}

function getSnippetName({
  fileName,
  publicNameSegments,
}: {
  fileName: string;
  publicNameSegments: string[];
}): string {
  return [...publicNameSegments, basename(fileName, extname(fileName))].join(
    '/',
  );
}
