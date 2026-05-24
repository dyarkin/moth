import { compileTemplate } from './compile-template';
import type { ModuleTemplatesTreeItem } from './types';
import type { SnippetSet } from '@core/snippets/types';
import type { VarSet } from '@core/variables';

export function compileTemplatesTreeItems({
  items,
  varSet,
  snippets = {},
}: {
  items: ModuleTemplatesTreeItem[];
  varSet: VarSet;
  snippets?: SnippetSet;
}): ModuleTemplatesTreeItem[] {
  return items.map((item) => {
    if (item.type === 'dir') {
      return {
        ...item,
        children: compileTemplatesTreeItems({
          items: item.children,
          varSet,
          snippets,
        }),
      };
    }

    return {
      ...item,
      content: compileTemplate({
        templateText: item.content,
        varSet,
        snippets,
      }),
    };
  });
}
