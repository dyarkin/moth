import YAML from 'yaml';
import type { VarSet } from './types';
import { readFileText } from '@lib/util';
import { MothError } from '@shared/errors';

export async function readVarSetFromYaml(filePath: string): Promise<VarSet> {
  try {
    const text = await readFileText(filePath);
    const readObject = YAML.parse(text);

    return readObject;
  } catch (e) {
    throw new MothError({
      message: `Failed to read variables set from yaml by path: ${filePath}. Error: ${e}`,
    });
  }
}
