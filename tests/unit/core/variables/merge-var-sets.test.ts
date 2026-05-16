import { describe, expect, it } from 'bun:test';
import { mergeVarSets, type VarSet } from '@core/variables';

describe('mergeVarSets', () => {
  it('merges additional sets into main and allows later values to override earlier ones', () => {
    const main = {
      primary: { value: 'main' },
      shared: { value: 'main-shared' },
    };

    const additional: VarSet[] = [
      { shared: { value: 'override' } },
      { secondary: { value: 'additional' } },
    ];

    expect(
      mergeVarSets({
        main,
        additional,
      }),
    ).toEqual({
      primary: { value: 'main' },
      shared: { value: 'override' },
      secondary: { value: 'additional' },
    });
  });
});
