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
