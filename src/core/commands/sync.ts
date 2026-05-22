import type { Command } from 'commander';
import { combineModulesCompiled } from '@core/sync';
import { MothError } from '@shared/errors';

type SyncCommandOptions = {
  prepare?: boolean;
  compilation: boolean;
};

export function registerSyncCommand(program: Command): void {
  program
    .command('sync')
    .description('Sync compiled config files')
    .option('--prepare', 'Only prepare root .compiled directory')
    .option('--no-compilation', 'Do not recompile modules before preparing')
    .action(async (options: SyncCommandOptions) => {
      if (!options.prepare) {
        throw new MothError({
          message: 'sync without --prepare is not implemented yet',
        });
      }

      const compiledDirPath = await combineModulesCompiled({
        // Commander negated flags: default is `true`; passing `--no-compilation` sets it to `false`.
        shouldCompile: options.compilation,
      });

      console.log(`Sync prepared: ${compiledDirPath}`);
    });
}
