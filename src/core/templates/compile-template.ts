import nunjucks from 'nunjucks';
import { registerNunjucksSnippetFunctionGlobal } from '@core/snippets/register-nunjucks-snippet-function-global';
import type { SnippetSet } from '@core/snippets/types';
import type { VarSet } from '@core/variables';
import { DEFAULT_NUNJUCKS_ENV_OPTIONS } from '@shared/nunjucks';

type CompileTemplateArgs = {
  templateText: string;
  varSet: VarSet;
  snippets?: SnippetSet;
};

export function compileTemplate({
  templateText,
  varSet,
  snippets = {},
}: CompileTemplateArgs): string {
  const env = new nunjucks.Environment(undefined, DEFAULT_NUNJUCKS_ENV_OPTIONS);

  registerNunjucksSnippetFunctionGlobal({
    env,
    snippets,
    varSet,
  });

  return env.renderString(templateText, varSet);
}
