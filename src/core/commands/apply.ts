import type { Command } from 'commander';
import { applyCompiled, type ApplyCompiledResult } from '@core/sync';
import {
  formatPath,
  printEmpty,
  printKeyValue,
  printList,
  printSection,
} from './output';

export function registerApplyCommand(program: Command): void {
  program
    .command('apply')
    .description('Apply prepared root .compiled files to target paths')
    .action(async () => {
      printApplyCompiledResult(await applyCompiled());
    });
}

export function printApplyCompiledResult(result: ApplyCompiledResult): void {
  printSection('Apply summary');
  printKeyValue({ label: 'Created links', value: result.createdLinksCount });
  printKeyValue({
    label: 'Removed obsolete links',
    value: result.removedObsoleteLinksCount,
  });
  printKeyValue({
    label: 'Already-correct links',
    value: result.alreadyCorrectLinksCount,
  });

  console.log();

  printTargetPathGroup({
    title: 'Created links',
    targetPaths: result.createdTargetPaths,
  });
  printTargetPathGroup({
    title: 'Already-correct links',
    targetPaths: result.alreadyCorrectTargetPaths,
  });
  printTargetPathGroup({
    title: 'Removed obsolete links',
    targetPaths: result.removedObsoleteTargetPaths,
  });
}

function printTargetPathGroup({
  title,
  targetPaths,
}: {
  title: string;
  targetPaths: string[];
}): void {
  printSection(title);

  if (targetPaths.length === 0) {
    printEmpty();
    return;
  }

  printList(targetPaths.map(formatPath));
}
