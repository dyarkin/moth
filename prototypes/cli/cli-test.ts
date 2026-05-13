import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program.name('mycli').description('A Bun CLI with commander').version('1.0.0');

program.command('hello <name>').action((name: string) => {
  console.log(chalk.green(`Hello, ${name}!`));
});

program.parse();
