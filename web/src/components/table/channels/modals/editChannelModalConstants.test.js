import { describe, expect, it } from 'vitest';
import {
  DEPRECATED_DOUBAO_CODING_PLAN_BASE_URL,
  MODEL_FETCHABLE_TYPES,
  STATUS_CODE_MAPPING_EXAMPLE,
  type2secretPrompt,
} from './editChannelModalConstants';

describe('editChannelModalConstants', () => {
  it('returns provider-specific secret prompts', () => {
    expect(type2secretPrompt(15)).toBe('按照如下格式输入：APIKey|SecretKey');
    expect(type2secretPrompt(57)).toBe(
      '请输入 JSON 格式的 OAuth 凭据（必须包含 access_token 和 account_id）',
    );
    expect(type2secretPrompt(999)).toBe('请输入渠道对应的鉴权密钥');
  });

  it('exposes stable extracted constants', () => {
    expect(DEPRECATED_DOUBAO_CODING_PLAN_BASE_URL).toBe('doubao-coding-plan');
    expect(STATUS_CODE_MAPPING_EXAMPLE).toEqual({ 400: '500' });
    expect(MODEL_FETCHABLE_TYPES.has(1)).toBe(true);
    expect(MODEL_FETCHABLE_TYPES.has(48)).toBe(true);
  });
});
