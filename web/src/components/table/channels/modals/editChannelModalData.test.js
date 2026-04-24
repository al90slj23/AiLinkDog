import { describe, expect, test } from 'bun:test';
import {
  buildGroupOptions,
  buildModelOptions,
  buildUniqueModels,
} from './editChannelModalData';

describe('editChannelModalData', () => {
  test('builds group options', () => {
    expect(buildGroupOptions(['default', 'vip'])).toEqual([
      { label: 'default', value: 'default' },
      { label: 'vip', value: 'vip' },
    ]);
  });

  test('builds model options and unique models', () => {
    expect(buildModelOptions([{ id: 'gpt-4' }, { id: 'gpt-4o' }])).toEqual([
      { key: 'gpt-4', label: 'gpt-4', value: 'gpt-4' },
      { key: 'gpt-4o', label: 'gpt-4o', value: 'gpt-4o' },
    ]);
    expect(buildUniqueModels(['a', 'a', 'b'])).toEqual(['a', 'b']);
  });
});
