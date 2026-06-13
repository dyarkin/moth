import { join } from 'node:path';
import YAML from 'yaml';
import { MODULE_LOCAL_STATE_FILE_NAME } from './consts';
import type { ModuleLocalState } from './types';
import { writeMothTextFile } from '@shared/moth-dir';

export async function writeModuleLocalState({
  moduleName,
  state,
}: {
  moduleName: string;
  state: ModuleLocalState;
}): Promise<void> {
  await writeMothTextFile({
    relativePath: join(moduleName, MODULE_LOCAL_STATE_FILE_NAME),
    content: `${YAML.stringify(state).trimEnd()}\n`,
  });
}
