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
import { describe, expect, test } from 'bun:test';
import {
  normalizeSubmitInputs,
  parseModelMappingOrThrow,
} from './editChannelModalSubmitValidation';

describe('editChannelModalSubmitValidation', () => {
  test('parses model mapping json', () => {
    expect(parseModelMappingOrThrow('{"a":"b"}', () => true)).toEqual({
      a: 'b',
    });
    expect(() => parseModelMappingOrThrow('{bad', () => false)).toThrow();
  });

  test('normalizes submit inputs', () => {
    const normalized = normalizeSubmitInputs({
      localInputs: {
        models: [' gpt-4 ', '', 'gpt-4o'],
        base_url: 'https://api.example.com/',
        type: 18,
        other: '',
      },
    });

    expect(normalized.models).toEqual(['gpt-4', 'gpt-4o']);
    expect(normalized.base_url).toBe('https://api.example.com');
    expect(normalized.other).toBe('v2.1');
  });
});
