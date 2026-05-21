import type { Command } from 'commander';
import { registerModulesCommand } from '@core/commands/modules';

export function registerCommands(program: Command): void {
  registerModulesCommand(program);
}
