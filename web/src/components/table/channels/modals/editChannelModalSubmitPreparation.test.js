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
import { prepareSubmitInputsBeforeValidation } from './editChannelModalSubmitPreparation';

describe('editChannelModalSubmitPreparation', () => {
  test('blocks codex batch mode', async () => {
    const result = await prepareSubmitInputsBeforeValidation({
      localInputs: { type: 57, key: '{}' },
      batch: true,
      isEdit: false,
      useManualInput: false,
      vertexKeys: [],
      vertexFileList: [],
      t: (key) => key,
      verifyJSON: () => true,
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('codex_batch_not_supported');
  });

  test('normalizes codex key json', async () => {
    const result = await prepareSubmitInputsBeforeValidation({
      localInputs: {
        type: 57,
        key: '{"access_token":"a","account_id":"b"}',
      },
      batch: false,
      isEdit: false,
      useManualInput: false,
      vertexKeys: [],
      vertexFileList: [],
      t: (key) => key,
      verifyJSON: () => true,
    });

    expect(result.ok).toBe(true);
    expect(result.localInputs.key).toContain('access_token');
  });

  test('handles vertex uploaded keys', async () => {
    const result = await prepareSubmitInputsBeforeValidation({
      localInputs: { type: 41, vertex_key_type: 'json' },
      batch: false,
      isEdit: false,
      useManualInput: false,
      vertexKeys: [{ a: 1 }],
      vertexFileList: [],
      t: (key) => key,
      verifyJSON: () => true,
    });

    expect(result.ok).toBe(true);
    expect(result.localInputs.key).toBe('{"a":1}');
  });
});
