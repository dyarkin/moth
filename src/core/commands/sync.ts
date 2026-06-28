import type { Command } from 'commander';
import { printApplyCompiledResult } from '@core/commands/apply';
import { applyCompiled, combineModulesCompiled } from '@core/sync';

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
      const compiledDirPath = await combineModulesCompiled({
        // Commander negated flags: default is `true`; passing `--no-compilation` sets it to `false`.
        shouldCompile: options.compilation,
      });

      if (options.prepare) {
        console.log(`Sync prepared: ${compiledDirPath}`);
        return;
      }

      printApplyCompiledResult(await applyCompiled());
    });
}
