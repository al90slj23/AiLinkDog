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
