import chalk from 'chalk';

export function printSuccess(message: string): void {
  console.log(`${chalk.green('success')} ${message}`);
}

export function printInfo(message: string): void {
  console.log(`${chalk.blue('info')} ${message}`);
}

export function printError(message: string): void {
  console.error(`${chalk.red('error')} ${message}`);
}

export function printSection(title: string): void {
  console.log(chalk.bold(title));
}

export function printKeyValue({
  label,
  value,
}: {
  label: string;
  value: string | number;
}): void {
  console.log(`${chalk.dim(`${label}:`)} ${value}`);
}

export function printList(items: string[]): void {
  for (const item of items) {
    console.log(`  ${chalk.dim('-')} ${item}`);
  }
}

export function printEmpty(message = 'none'): void {
  console.log(`  ${chalk.dim('-')} ${chalk.dim(message)}`);
}

export function formatName(name: string): string {
  return chalk.bold(name);
}

export function formatPath(path: string): string {
  return chalk.cyan(path);
}
