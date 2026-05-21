import type { Command } from 'commander';
import { listModules, scaffoldModule } from '@core/modules';
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
    .description(
      'Create a new module with manifest.toml, templates/ and variables/',
    )
    .action(async (moduleName: string) => {
      const modulePath = await scaffoldModule(moduleName);
      console.log(`Module created: ${moduleName}`);
      console.log(`Path: ${modulePath}`);
    });
}
