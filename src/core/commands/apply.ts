import type { Command } from 'commander';
import { applyCompiled, type ApplyCompiledResult } from '@core/sync';

export function registerApplyCommand(program: Command): void {
  program
    .command('apply')
    .description('Apply prepared root .compiled files to target paths')
    .action(async () => {
      printApplyCompiledResult(await applyCompiled());
    });
}

export function printApplyCompiledResult(result: ApplyCompiledResult): void {
  console.log(`Created links: ${result.createdLinksCount}`);
  console.log(`Removed obsolete links: ${result.removedObsoleteLinksCount}`);
  console.log(`Already-correct links: ${result.alreadyCorrectLinksCount}`);

  printTargetPathGroup('Created links', result.createdTargetPaths);
  printTargetPathGroup(
    'Already-correct links',
    result.alreadyCorrectTargetPaths,
  );
  printTargetPathGroup(
    'Removed obsolete links',
    result.removedObsoleteTargetPaths,
  );
}

function printTargetPathGroup(title: string, targetPaths: string[]): void {
  console.log(`${title}:`);

  if (targetPaths.length === 0) {
    console.log('- none');
    return;
  }

  for (const targetPath of targetPaths) {
    console.log(`- ${targetPath}`);
  }
}
