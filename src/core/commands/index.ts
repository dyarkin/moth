import type { Command } from 'commander';
import { registerApplyCommand } from '@core/commands/apply';
import { registerCompileCommand } from '@core/commands/compile';
import { registerModulesCommand } from '@core/commands/modules';
import { registerSyncCommand } from '@core/commands/sync';

export function registerCommands(program: Command): void {
  registerModulesCommand(program);
  registerCompileCommand(program);
  registerApplyCommand(program);
  registerSyncCommand(program);
}
