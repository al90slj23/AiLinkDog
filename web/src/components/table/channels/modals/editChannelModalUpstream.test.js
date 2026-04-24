import { describe, expect, test } from 'bun:test';
import {
  normalizeFetchedModels,
  prepareModelMappingModalState,
} from './editChannelModalUpstream';

describe('editChannelModalUpstream', () => {
  test('normalizes fetched models', () => {
    expect(normalizeFetchedModels(['a', ' a ', '', null, 'b', 'a'])).toEqual([
      'a',
      'b',
    ]);
  });

  test('prepares model mapping modal state', () => {
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
