import { compileTemplate } from './compile-template';
import type { ModuleTemplatesTreeItem } from './types';
import type { VarSet } from '@core/variables';

export function compileTemplatesTreeItems({
  items,
  varSet,
}: {
  items: ModuleTemplatesTreeItem[];
  varSet: VarSet;
}): ModuleTemplatesTreeItem[] {
  return items.map((item) => {
    if (item.type === 'dir') {
      return {
        ...item,
        children: compileTemplatesTreeItems({
          items: item.children,
          varSet,
        }),
      };
    }

    return {
      ...item,
      content: compileTemplate({
        templateText: item.content,
        varSet,
      }),
    };
  });
}
