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
import { MemoryRouter } from 'react-router-dom';

vi.mock('@douyinfe/semi-ui', () => {
  const React = require('react');
  const passthrough = ({ children, ...props }) =>
    React.createElement('div', props, children);
  const Tabs = ({ children }) => React.createElement('div', null, children);
  Tabs.TabPane = ({ children }) => React.createElement('div', null, children);
  const Form = ({ children }) => React.createElement('form', null, children);
  Form.Input = passthrough;
  Form.TextArea = passthrough;
  Form.Switch = passthrough;
  Form.Select = passthrough;
  Form.Section = passthrough;
  const Collapse = passthrough;
  Collapse.Panel = passthrough;
  const Descriptions = passthrough;
  Descriptions.Item = passthrough;
  return {
    Banner: passthrough,
    Button: passthrough,
    Card: passthrough,
    Collapse,
    Descriptions,
    Form,
    Input: passthrough,
    Select: passthrough,
    Space: passthrough,
    Spin: passthrough,
    Table: passthrough,
    Tabs,
    Tag: passthrough,
    Typography: {
      Title: ({ children }) => React.createElement('h1', null, children),
      Text: ({ children }) => React.createElement('span', null, children),
    },
  };
});

vi.mock('axios', () => ({
  default: {
    create: () => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      interceptors: { response: { use: vi.fn() } },
    }),
  },
}));

vi.mock('../../helpers', () => ({
  AuthRedirect: ({ children }) => (
    <div data-guard='auth-redirect'>{children}</div>
  ),
  PrivateRoute: ({ children }) => (
    <div data-guard='private-route'>{children}</div>
  ),
  AdminRoute: ({ children }) => <div data-guard='admin-route'>{children}</div>,
  authHeader: () => ({}),
  getUserIdFromLocalStorage: () => '1',
  isAdmin: () => true,
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

vi.mock('../../pages/Home', () => ({ default: () => <div /> }));
vi.mock('../../pages/User', () => ({ default: () => <div /> }));
vi.mock('../../pages/Channel', () => ({ default: () => <div /> }));
vi.mock('../../pages/Token', () => ({ default: () => <div /> }));
vi.mock('../../pages/Redemption', () => ({ default: () => <div /> }));
vi.mock('../../pages/TopUp', () => ({ default: () => <div /> }));
vi.mock('../../pages/Log', () => ({ default: () => <div /> }));
vi.mock('../../pages/Chat', () => ({ default: () => <div /> }));
vi.mock('../../pages/Chat2Link', () => ({ default: () => <div /> }));
vi.mock('../../pages/Midjourney', () => ({ default: () => <div /> }));
vi.mock('../../pages/ReferralCenter', () => ({ default: () => <div /> }));
vi.mock('../../pages/ReferralManage', () => ({ default: () => <div /> }));
vi.mock('../../pages/Pricing', () => ({ default: () => <div /> }));
vi.mock('../../pages/Task', () => ({ default: () => <div /> }));
vi.mock('../../pages/Model', () => ({ default: () => <div /> }));
vi.mock('../../pages/ModelDeployment', () => ({ default: () => <div /> }));
vi.mock('../../pages/Playground', () => ({ default: () => <div /> }));
vi.mock('../../pages/Subscription', () => ({ default: () => <div /> }));
vi.mock('../../pages/ServiceStatus', () => ({ default: () => <div /> }));
vi.mock('../../pages/ServiceStatusCenter', () => ({ default: () => <div /> }));
vi.mock('../../pages/MonitorTargets', () => ({ default: () => <div /> }));
vi.mock('../../pages/MonitorTargets/EditMonitorTarget', () => ({
  default: () => <div />,
}));
vi.mock('../../pages/MonitorTargets/MonitorTargetDetail', () => ({
  default: () => <div />,
}));
vi.mock('../../pages/Dashboard', () => ({ default: () => <div /> }));
vi.mock('../../pages/About', () => ({ default: () => <div /> }));
vi.mock('../../pages/UserAgreement', () => ({ default: () => <div /> }));
vi.mock('../../pages/PrivacyPolicy', () => ({ default: () => <div /> }));
vi.mock('../../pages/Setting', () => ({ default: () => <div /> }));
vi.mock('../../components/auth/RegisterForm', () => ({
  default: () => <div />,
}));
vi.mock('../../components/auth/LoginForm', () => ({ default: () => <div /> }));
vi.mock('../../components/auth/PasswordResetForm', () => ({
  default: () => <div />,
}));
vi.mock('../../components/auth/PasswordResetConfirm', () => ({
  default: () => <div />,
}));
vi.mock('../../components/auth/OAuth2Callback', () => ({
  default: () => <div />,
}));
vi.mock('../../components/settings/PersonalSetting', () => ({
  default: () => <div />,
}));
vi.mock('../../pages/NotFound', () => ({
  default: () => <div>not-found</div>,
}));
vi.mock('../../pages/Forbidden', () => ({ default: () => <div /> }));
vi.mock('../../components/common/ui/Loading', () => ({
  default: () => <div>loading</div>,
}));
vi.mock('../../context/Status', () => {
  const React = require('react');
  return { StatusContext: React.createContext([{ status: {} }]) };
});

import App from '../../App';
import UpstreamTracking from './index';

describe('UpstreamTracking', () => {
  it('页面组件可导入并显示标题', () => {
    const html = renderToStaticMarkup(<UpstreamTracking />);
    expect(html).toContain('上游跟踪与同步评估');
  });

  it('App 在 /console/upstreamtracking 通过 AdminRoute 渲染页面', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/console/upstreamtracking']}>
        <App />
      </MemoryRouter>,
    );

    expect(html).toContain('上游跟踪与同步评估');
    expect(html).toContain('data-guard="admin-route"');
    expect(html).not.toContain('not-found');
  });
});
