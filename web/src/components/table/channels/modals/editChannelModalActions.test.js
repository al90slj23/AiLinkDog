/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
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
