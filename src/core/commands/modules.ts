import type { Command } from 'commander';
import YAML from 'yaml';
import { MODULE_COMPILED_DIR_NAME } from '@core/modules/consts';
import {
  listModules,
  readModuleTemplatesTree,
  readModuleVariables,
  scaffoldModule,
} from '@core/modules';
import {
  compileTemplatesTreeItems,
  writeTemplatesTreeToDir,
} from '@core/templates';
import { removePath } from '@lib/util';
import { MOTH_DIR_PATH, resolveMothPath } from '@shared/moth-dir';

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

  program
    .command('module-templates-tree <moduleName>')
    .description('Read and print templates/ tree for a module')
    .action(async (moduleName: string) => {
      const templatesTree = await readModuleTemplatesTree(moduleName);
      console.log(YAML.stringify(templatesTree).trimEnd());
    });

  program
    .command('module-compile <moduleName>')
    .description('Compile module templates into module .compiled directory')
    .option(
      '--to-console',
      'Print compiled templates tree instead of writing files',
    )
    .action(
      async (
        moduleName: string,
        options: {
          toConsole?: boolean;
        },
      ) => {
        const templatesTree = await readModuleTemplatesTree(moduleName);
        const moduleVariables = await readModuleVariables(moduleName);
        const compiledTemplatesTree = compileTemplatesTreeItems({
          items: templatesTree,
          varSet: moduleVariables,
        });

        if (options.toConsole) {
          console.log(YAML.stringify(compiledTemplatesTree).trimEnd());
          return;
        }

        const compiledDirPath = resolveMothPath(
          moduleName,
          MODULE_COMPILED_DIR_NAME,
        );

        await removePath(compiledDirPath);
        await writeTemplatesTreeToDir({
          targetDirPath: compiledDirPath,
          items: compiledTemplatesTree,
          createDirsIfMissing: true,
        });

        console.log(`Module compiled: ${moduleName}`);
        console.log(`Path: ${compiledDirPath}`);
      },
    );
}
