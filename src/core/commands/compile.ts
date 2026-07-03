import type { Command } from 'commander';
import { compileModule, listModules } from '@core/modules';
import { MothError } from '@shared/errors';
import { formatName, formatPath, printKeyValue, printSuccess } from './output';

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
            printSuccess(`Module compiled: ${formatName(compiledModule.name)}`);
            printKeyValue({
              label: 'Path',
              value: formatPath(compiledModule.compiledDirPath),
            });
          }
          return;
        }

        if (!moduleName) {
          throw new MothError({
            message: 'Module name is required unless --all is used',
          });
        }

        const compiledDirPath = await compileModule(moduleName);

        printSuccess(`Module compiled: ${formatName(moduleName)}`);
        printKeyValue({ label: 'Path', value: formatPath(compiledDirPath) });
      },
    );
}
