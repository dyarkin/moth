import { Command } from 'commander';
import { registerCommands } from '@core/commands';

const program = new Command();

program
  .name('moth')
  .description('CLI tool for managing and composing config files.');

registerCommands(program);

await program.parseAsync();
