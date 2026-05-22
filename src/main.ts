import { Command } from 'commander';
import { registerCommands } from '@core/commands';
import { isMothError } from '@shared/errors';

const program = new Command();

program
  .name('moth')
  .description('CLI tool for managing and composing config files.');

registerCommands(program);

try {
  await program.parseAsync();
} catch (e) {
  if (isMothError(e)) {
    console.error(e.message);
    process.exit(1);
  }

  console.error(e);
  process.exit(1);
}
