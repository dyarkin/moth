import type { Command } from 'commander';
import YAML from 'yaml';
import {
  listModules,
  readModuleTemplatesTree,
  readModuleVariables,
  scaffoldModule,
} from '@core/modules';
import { MOTH_DIR_PATH } from '@shared/moth-dir';
import { switchModulePresetInLocalState } from './switch-module-preset-in-local-state';

export function registerModulesCommand(program: Command): void {
  program
    .command('modules')
    .description(`List modules found in ${MOTH_DIR_PATH}`)
    .action(async () => {
      const modules = await listModules();

      if (modules.length === 0) {
        console.log(`No modules found in ${MOTH_DIR_PATH}`);
        return;
      }

      modules.forEach((moduleName) => console.log(moduleName));
    });

  program
    .command('module-init <moduleName>')
    .description(`Create a new module with default files and dirs`)
    .action(async (moduleName: string) => {
      const modulePath = await scaffoldModule(moduleName);
      console.log(`Module created: ${moduleName}`);
      console.log(`Path: ${modulePath}`);
    });

  program
    .command('module-vars <moduleName>')
    .description(
      'Read and print merged module variables including enabled presets',
    )
    .action(async (moduleName: string) => {
      const variables = await readModuleVariables(moduleName);
      console.log(variables);
      console.log(YAML.stringify(variables).trimEnd());
    });

  program
    .command('module-preset-enable <moduleName> <presetName>')
    .description('Enable a preset for a module')
    .action(async (moduleName: string, presetName: string) => {
      await switchModulePresetInLocalState({
        moduleName,
        presetFullNameInput: presetName,
        operation: 'enable',
      });

      console.log(`Preset enabled: ${moduleName}/${presetName}`);
    });

  program
    .command('module-preset-disable <moduleName> <presetName>')
    .description('Disable a preset for a module')
    .action(async (moduleName: string, presetName: string) => {
      await switchModulePresetInLocalState({
        moduleName,
        presetFullNameInput: presetName,
        operation: 'disable',
      });

      console.log(`Preset disabled: ${moduleName}/${presetName}`);
    });

  program
    .command('module-templates-tree <moduleName>')
    .description('Read and print templates/ tree for a module')
    .action(async (moduleName: string) => {
      const templatesTree = await readModuleTemplatesTree(moduleName);
      console.log(YAML.stringify(templatesTree).trimEnd());
    });
}
