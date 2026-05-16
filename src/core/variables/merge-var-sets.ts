import type { VarSet } from './types';

export function mergeVarSets({
  main,
  additional,
}: {
  main: VarSet;
  additional: VarSet[];
}): VarSet {
  return additional.reduce((acc, cur) => {
    return Object.assign(acc, cur);
  }, main);
}
