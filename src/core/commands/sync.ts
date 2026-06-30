import type { Command } from 'commander';
import { printApplyCompiledResult } from '@core/commands/apply';
import { applyCompiled, combineModulesCompiled } from '@core/sync';

type SyncCommandOptions = {
  prepareOnly?: boolean;
  compile: boolean;
};

export function registerSyncCommand(program: Command): void {
  program
    .command('sync')
    .description('Sync compiled config files')
    .option('--prepare-only', 'Only prepare root .compiled directory')
    .option('--no-compile', 'Do not recompile modules before preparing')
    .action(async (options: SyncCommandOptions) => {
      const compiledDirPath = await combineModulesCompiled({
        // Commander negated flags: default is `true`; passing `--no-compile` sets it to `false`.
        shouldCompile: options.compile,
      });

      if (options.prepareOnly) {
        console.log(`Sync prepared: ${compiledDirPath}`);
        return;
      }

      printApplyCompiledResult(await applyCompiled());
    });
}
