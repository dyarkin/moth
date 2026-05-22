import type { Command } from 'commander';
import { compileModule, listModules } from '@core/modules';
import { MothError } from '@shared/errors';

type CompileCommandOptions = {
  all?: boolean;
};

export function registerCompileCommand(program: Command): void {
  program
    .command('compile [moduleName]')
    .description('Compile module templates into module .compiled directory')
    .option('--all', 'Compile all modules')
    .action(
      async (
        moduleName: string | undefined,
        options: CompileCommandOptions,
      ) => {
        if (options.all && moduleName) {
          throw new MothError({
            message: 'Use either compile <MODULE_NAME> or compile --all',
          });
        }

        if (options.all) {
          const modules = await listModules();
          const compiledModules = await Promise.all(
            modules.map(async (name) => ({
              name,
              compiledDirPath: await compileModule(name),
            })),
          );

          for (const compiledModule of compiledModules) {
            console.log(`Module compiled: ${compiledModule.name}`);
            console.log(`Path: ${compiledModule.compiledDirPath}`);
          }
          return;
        }

        if (!moduleName) {
          throw new MothError({
            message: 'Module name is required unless --all is used',
          });
        }

        const compiledDirPath = await compileModule(moduleName);

        console.log(`Module compiled: ${moduleName}`);
        console.log(`Path: ${compiledDirPath}`);
      },
    );
}
