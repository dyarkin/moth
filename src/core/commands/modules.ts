import type { Command } from 'commander';
import YAML from 'yaml';
import {
  listModules,
  readModuleTemplatesTree,
  readModuleVariables,
  scaffoldModule,
} from '@core/modules';
import { MothError } from '@shared/errors';
import { MOTH_DIR_PATH } from '@shared/moth-dir';
import { switchModulePresetInLocalState } from './switch-module-preset-in-local-state';

export function registerModulesCommand(program: Command): void {
  program
    .command('module <parts...>')
    .description('Manage modules')
    .usage(
      'list | init <moduleName> | <moduleName> vars | <moduleName> preset enable <presetName> | <moduleName> preset disable <presetName> | <moduleName> templates tree',
    )
    .addHelpText(
      'after',
      `
Commands:
  module list
  module init <moduleName>
  module <moduleName> vars
  module <moduleName> preset enable <presetName>
  module <moduleName> preset disable <presetName>
  module <moduleName> templates tree`,
    )
    .action(async (parts: string[]) => {
      const [moduleName, action, subaction, value] = parts;

      if (parts.length === 1 && moduleName === 'list') {
        const modules = await listModules();

        if (modules.length === 0) {
          console.log(`No modules found in ${MOTH_DIR_PATH}`);
          return;
        }

        modules.forEach((name) => console.log(name));
        return;
      }

      if (parts.length === 2 && moduleName === 'init' && action) {
        const modulePath = await scaffoldModule(action);
        console.log(`Module created: ${action}`);
        console.log(`Path: ${modulePath}`);
        return;
      }

      if (parts.length === 2 && moduleName && action === 'vars') {
        const variables = await readModuleVariables(moduleName);
        console.log(variables);
        console.log(YAML.stringify(variables).trimEnd());
        return;
      }

      if (
        parts.length === 4 &&
        moduleName &&
        action === 'preset' &&
        (subaction === 'enable' || subaction === 'disable') &&
        value
      ) {
        await switchModulePresetInLocalState({
          moduleName,
          presetFullNameInput: value,
          operation: subaction,
        });

        console.log(`Preset ${subaction}d: ${moduleName}/${value}`);
        return;
      }

      if (
        parts.length === 3 &&
        moduleName &&
        action === 'templates' &&
        subaction === 'tree'
      ) {
        const templatesTree = await readModuleTemplatesTree(moduleName);
        console.log(YAML.stringify(templatesTree).trimEnd());
        return;
      }

      throw new MothError({
        message: `Unknown module command: module ${parts.join(' ')}`,
      });
    });
}
