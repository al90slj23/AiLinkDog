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
