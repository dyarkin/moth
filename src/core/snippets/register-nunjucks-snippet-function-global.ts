import type { VarSet } from '@core/variables';
import type { Environment } from 'nunjucks';
import { MothError } from '@shared/errors';
import type { SnippetArgs, SnippetSet } from './types';

export function registerNunjucksSnippetFunctionGlobal({
  env,
  snippets,
  varSet,
}: {
  env: Environment;
  snippets: SnippetSet;
  varSet: VarSet;
}): void {
  env.addGlobal(
    'snippet',
    (snippetName: string, args: SnippetArgs = {}): string => {
      const snippetTemplate = snippets[snippetName];

      if (!snippetTemplate) {
        throw new MothError({
          message: `Snippet not found: ${snippetName}`,
        });
      }

      const compiledSnippet = env.renderString(snippetTemplate, {
        ...varSet,
        ...args,
      });

      return removeFinalLineBreak(compiledSnippet);
    },
  );
}

function removeFinalLineBreak(text: string): string {
  return text.replace(/\r?\n$/, '');
}
