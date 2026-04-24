import { describe, expect, it, vi } from 'vitest';

vi.mock('../../helpers', () => ({
  API: { get: () => Promise.resolve({ data: { success: true, data: [] } }) },
  showError: () => {},
}));

import {
  buildStatusQueryParams,
  getInitialTimeWindow,
  normalizeStatusWindow,
} from './useAdminStatus';

describe('useAdminStatus helpers', () => {
  it('窗口参数支持合法值并回退非法值', () => {
    expect(normalizeStatusWindow('24h')).toBe('24h');
    expect(normalizeStatusWindow('7d')).toBe('7d');
    expect(normalizeStatusWindow('30d')).toBe('30d');
    expect(normalizeStatusWindow('bad')).toBe('24h');
  });

  it('从查询参数读取初始窗口', () => {
    expect(getInitialTimeWindow('?window=7d')).toBe('7d');
    expect(getInitialTimeWindow('?window=bad')).toBe('24h');
    expect(getInitialTimeWindow('')).toBe('24h');
  });

  it('为 uptime 接口构造最小请求参数', () => {
    expect(buildStatusQueryParams('24h')).toEqual({});
    expect(buildStatusQueryParams('7d')).toEqual({ window: '7d' });
  });
});
