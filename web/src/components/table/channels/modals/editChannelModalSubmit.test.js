import { describe, expect, test } from 'bun:test';
import { buildSubmitPayload } from './editChannelModalSubmit';

describe('editChannelModalSubmit', () => {
  test('builds submit payload and strips temp fields', () => {
    const payload = buildSubmitPayload({
      localInputs: {
        type: 1,
        force_format: true,
        thinking_to_content: true,
        proxy: 'http://proxy',
        pass_through_body_enabled: true,
        system_prompt: 'hello',
        system_prompt_override: true,
        allow_service_tier: true,
        disable_store: true,
        allow_safety_identifier: true,
        allow_include_obfuscation: true,
        models: ['gpt-4o', 'gpt-4.1'],
        groups: ['default', 'vip'],
        auto_ban: true,
        settings: '{}',
      },
      batch: false,
      multiToSingle: false,
      multiKeyMode: 'random',
      isEdit: false,
      isMultiKeyChannel: false,
      keyMode: 'append',
    });

    expect(payload.mode).toBe('single');
    expect(payload.channel.models).toBe('gpt-4o,gpt-4.1');
    expect(payload.channel.group).toBe('default,vip');
    expect(payload.channel.auto_ban).toBe(1);
    expect(payload.channel.setting).toContain('force_format');
    expect(payload.channel.settings).toContain('allow_service_tier');
    expect(payload.channel.force_format).toBeUndefined();
    expect(payload.channel.groups).toEqual(['default', 'vip']);
  });

  test('builds edit payload with key mode', () => {
    const payload = buildSubmitPayload({
      localInputs: {
        type: 33,
        aws_key_type: 'api_key',
        models: ['a'],
        groups: ['default'],
        auto_ban: false,
      },
      batch: false,
      multiToSingle: false,
      multiKeyMode: 'random',
      isEdit: true,
      isMultiKeyChannel: true,
      keyMode: 'replace',
      channelId: 12,
    });

    expect(payload.id).toBe(12);
    expect(payload.key_mode).toBe('replace');
    expect(payload.models).toBe('a');
  });
});
