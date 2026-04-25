import { describe, expect, it } from 'vitest';
import {
  buildParamOverrideMeta,
  buildRedirectModelList,
  buildUpstreamDetectedModels,
  formatUnixTimeValue,
} from './editChannelModalDerived';

describe('editChannelModalDerived', () => {
  it('builds redirect model list from mapping json', () => {
    expect(buildRedirectModelList('{"a":"x","b":"x","c":"y"}')).toEqual([
      'x',
      'y',
    ]);
    expect(buildRedirectModelList('')).toEqual([]);
  });

  it('deduplicates upstream detected models', () => {
    expect(
      buildUpstreamDetectedModels(['a', ' a ', '', null, 'b', 'a']),
    ).toEqual(['a', 'b']);
  });

  it('builds param override meta', () => {
    const t = (key) => key;
    expect(buildParamOverrideMeta('', t).tagLabel).toBe('不更改');
    expect(buildParamOverrideMeta('{bad', t).tagLabel).toBe('JSON格式错误');
    expect(
      buildParamOverrideMeta('{"operations":[{"path":"temperature"}]}', t)
        .tagLabel,
    ).toContain('新格式模板');
  });

  it('formats unix time values', () => {
    const t = (key) => key;
    expect(formatUnixTimeValue(0, t)).toBe('暂无');
    expect(typeof formatUnixTimeValue(1710000000, t)).toBe('string');
  });
});
