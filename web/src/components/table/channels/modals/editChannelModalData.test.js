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
  buildGroupOptions,
  buildModelOptions,
  buildUniqueModels,
} from './editChannelModalData';

describe('editChannelModalData', () => {
  it('builds group options', () => {
    expect(buildGroupOptions(['default', 'vip'])).toEqual([
      { label: 'default', value: 'default' },
      { label: 'vip', value: 'vip' },
    ]);
  });

  it('builds model options and unique models', () => {
    expect(buildModelOptions([{ id: 'gpt-4' }, { id: 'gpt-4o' }])).toEqual([
      { key: 'gpt-4', label: 'gpt-4', value: 'gpt-4' },
      { key: 'gpt-4o', label: 'gpt-4o', value: 'gpt-4o' },
    ]);
    expect(buildUniqueModels(['a', 'a', 'b'])).toEqual(['a', 'b']);
  });
});
