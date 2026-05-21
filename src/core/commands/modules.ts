import type { Command } from 'commander';
import YAML from 'yaml';
import { listModules, scaffoldModule } from '@core/modules';
import { readModuleVariables } from '@core/variables';
import { MOTH_DIR_PATH } from '@shared/moth-dir';

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
      'Read and print merged module variables from variables/*.yaml files',
    )
    .action(async (moduleName: string) => {
      const variables = await readModuleVariables(moduleName);
      console.log(variables);
      console.log(YAML.stringify(variables).trimEnd());
    });
}
