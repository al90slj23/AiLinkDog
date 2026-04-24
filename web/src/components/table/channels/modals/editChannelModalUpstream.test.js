import { describe, expect, it } from 'vitest';
import {
  normalizeFetchedModels,
  prepareModelMappingModalState,
} from './editChannelModalUpstream';

describe('editChannelModalUpstream', () => {
  it('normalizes fetched models', () => {
    expect(normalizeFetchedModels(['a', ' a ', '', null, 'b', 'a'])).toEqual([
      'a',
      'b',
    ]);
  });

  it('prepares model mapping modal state', () => {
    expect(
      prepareModelMappingModalState({
        pairKey: 'gpt-4',
        value: 'model-a',
        models: ['model-a', ' model-b ', ''],
      }),
    ).toEqual({
      mappingKey: 'gpt-4',
      models: ['model-a', 'model-b'],
      selected: 'model-a',
    });
  });
});
