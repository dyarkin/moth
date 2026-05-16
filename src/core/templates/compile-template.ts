import nunjucks from 'nunjucks';
import type { VarSet } from '@core/variables';

type CompileTemplateArgs = {
  templateText: string;
  varSet: VarSet;
};

export function compileTemplate({
  templateText,
  varSet,
}: CompileTemplateArgs): string {
  return nunjucks.renderString(templateText, varSet);
}
