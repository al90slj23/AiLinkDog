import { describe, expect, it } from 'vitest';
import {
  buildCustomModelMergeResult,
  buildDeduplicatedKeysResult,
} from './editChannelModalActions';

describe('editChannelModalActions', () => {
  it('deduplicates key lines preserving order', () => {
    const result = buildDeduplicatedKeysResult('a\nb\na\n');
    expect(result.beforeCount).toBe(4);
    expect(result.afterCount).toBe(2);
    expect(result.text).toBe('a\nb');
  });

  it('merges custom models without duplicates', () => {
    const result = buildCustomModelMergeResult({
      customModel: 'gpt-4o, gpt-4.1, gpt-4o',
      currentModels: ['gpt-4o-mini'],
      currentModelOptions: [
        { key: 'gpt-4o-mini', label: 'gpt-4o-mini', value: 'gpt-4o-mini' },
      ],
    });

    expect(result.models).toEqual(['gpt-4o-mini', 'gpt-4o', 'gpt-4.1']);
    expect(result.addedModels).toEqual(['gpt-4o', 'gpt-4.1']);
    expect(result.nextCustomModel).toBe('');
  });
});
