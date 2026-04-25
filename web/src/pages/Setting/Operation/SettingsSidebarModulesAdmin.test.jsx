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
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('@douyinfe/semi-ui', () => {
  const passthrough = ({ children, ...props }) =>
    React.createElement('div', props, children);
  const button = ({ children, ...props }) =>
    React.createElement('button', props, children);
  const switchComponent = (props) => React.createElement('input', props);

  return {
    Card: passthrough,
    Form: {
      Section: passthrough,
    },
    Button: button,
    Switch: switchComponent,
    Row: passthrough,
    Col: passthrough,
    Typography: {
      Text: passthrough,
    },
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value) => value,
  }),
}));

vi.mock('../../../helpers', () => ({
  API: { put: vi.fn() },
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

vi.mock('../../../context/Status', () => ({
  StatusContext: React.createContext([{ status: {} }, vi.fn()]),
}));

import SettingsSidebarModulesAdmin from './SettingsSidebarModulesAdmin';

describe('SettingsSidebarModulesAdmin', () => {
  it('管理员区域配置包含服务状态中心', () => {
    const html = renderToStaticMarkup(
      <SettingsSidebarModulesAdmin options={{}} refresh={vi.fn()} />,
    );

    expect(html).toContain('服务状态中心');
  });
});
