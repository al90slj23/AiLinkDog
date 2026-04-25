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
