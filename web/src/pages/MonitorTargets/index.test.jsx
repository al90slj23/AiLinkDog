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
  const input = (props) => React.createElement('input', props);
  const Typography = {
    Title: ({ children }) => React.createElement('h1', null, children),
    Text: ({ children }) => React.createElement('span', null, children),
    Paragraph: ({ children }) => React.createElement('p', null, children),
  };
  const Form = passthrough;
  Form.Input = input;
  Form.InputNumber = input;
  Form.Switch = input;

  const List = ({ dataSource = [], renderItem }) =>
    React.createElement(
      'div',
      null,
      dataSource.map((item, index) =>
        React.createElement(
          'div',
          { key: index },
          renderItem ? renderItem(item) : JSON.stringify(item),
        ),
      ),
    );
  List.Item = passthrough;

  return {
    Banner: passthrough,
    Button: ({ children, ...props }) =>
      React.createElement('button', props, children),
    Card: passthrough,
    Col: passthrough,
    Descriptions: passthrough,
    Empty: ({ description }) => React.createElement('div', null, description),
    Form,
    List,
    Row: passthrough,
    Skeleton: passthrough,
    Space: passthrough,
    Spin: passthrough,
    Table: ({ dataSource = [] }) =>
      React.createElement(
        'div',
        null,
        dataSource.map((item, index) =>
          React.createElement('div', { key: index }, JSON.stringify(item)),
        ),
      ),
    Tag: ({ children }) => React.createElement('span', null, children),
    Timeline: passthrough,
    Typography,
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../components/common/ui/Loading', () => ({
  default: () => <div>loading</div>,
}));

vi.mock('../../pages/User', () => ({ default: () => <div /> }));
vi.mock('../../components/auth/RegisterForm', () => ({
  default: () => <div />,
}));
vi.mock('../../components/auth/LoginForm', () => ({ default: () => <div /> }));
vi.mock('../../pages/NotFound', () => ({
  default: () => <div>not-found</div>,
}));
vi.mock('../../pages/Forbidden', () => ({ default: () => <div /> }));
vi.mock('../../pages/Setting', () => ({ default: () => <div /> }));
vi.mock('../../components/auth/PasswordResetForm', () => ({
  default: () => <div />,
}));
vi.mock('../../components/auth/PasswordResetConfirm', () => ({
  default: () => <div />,
}));
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
vi.mock('../../components/auth/OAuth2Callback', () => ({
  default: () => <div />,
}));
vi.mock('../../components/settings/PersonalSetting', () => ({
  default: () => <div />,
}));
vi.mock('../../pages/Home', () => ({ default: () => <div /> }));
vi.mock('../../pages/Dashboard', () => ({ default: () => <div /> }));
vi.mock('../../pages/About', () => ({ default: () => <div /> }));
vi.mock('../../pages/UserAgreement', () => ({ default: () => <div /> }));
vi.mock('../../pages/PrivacyPolicy', () => ({ default: () => <div /> }));

vi.mock('../../helpers', () => ({
  AuthRedirect: ({ children }) => (
    <div data-guard='auth-redirect'>{children}</div>
  ),
  PrivateRoute: ({ children }) => (
    <div data-guard='private-route'>{children}</div>
  ),
  AdminRoute: ({ children }) => <div data-guard='admin-route'>{children}</div>,
}));

vi.mock('../../hooks/common/useHeaderBar', () => ({
  parseHeaderNavModules: () => ({ pricing: { requireAuth: false } }),
}));

vi.mock('../../context/Status', () => {
  const React = require('react');
  return {
    StatusContext: React.createContext([{ status: {} }]),
  };
});

vi.mock('../../hooks/monitor/useMonitorTargets', () => ({
  default: () => ({
    loading: false,
    error: '',
    items: [
      {
        id: 12,
        name: 'OpenAI 主监控',
        channelType: 'openai',
        model: 'gpt-4.1-mini',
        statusText: '运行中',
        tag: 'prod',
      },
    ],
  }),
}));

vi.mock('../../hooks/monitor/useMonitorTargetDetail', () => ({
  default: () => ({
    loading: false,
    error: '',
    target: {
      id: 12,
      name: 'OpenAI 主监控',
      channelType: 'openai',
      model: 'gpt-4.1-mini',
      tag: 'prod',
      statusText: '运行中',
    },
    runs: [{ id: 1, statusText: '成功', durationText: '111 ms' }],
    events: [
      { id: 1, title: '探测成功', occurredAtText: '2026-04-24 10:00:00' },
    ],
    billing: [{ id: 1, modelName: 'gpt-4.1-mini', costText: '$0.000001' }],
    refresh: vi.fn(),
  }),
}));

import App from '../../App';
import MonitorTargets from './index';
import EditMonitorTarget from './EditMonitorTarget';

describe('MonitorTargets pages', () => {
  it('列表页渲染基础监控字段', () => {
    const html = renderToStaticMarkup(<MonitorTargets />);

    expect(html).toContain('我的监控');
    expect(html).toContain('OpenAI 主监控');
    expect(html).toContain('openai');
    expect(html).toContain('gpt-4.1-mini');
    expect(html).toContain('运行中');
    expect(html).toContain('prod');
  });

  it('App 在监控相关路由走用户私有路由', () => {
    const listHtml = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/console/monitor-targets']}>
        <App />
      </MemoryRouter>,
    );

    const createHtml = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/console/monitor-targets/new']}>
        <App />
      </MemoryRouter>,
    );

    const detailHtml = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/console/monitor-targets/12']}>
        <App />
      </MemoryRouter>,
    );

    expect(listHtml).toContain('我的监控');
    expect(listHtml).toContain('data-guard="private-route"');
    expect(listHtml).not.toContain('not-found');
    expect(listHtml).not.toContain('data-guard="admin-route"');

    expect(createHtml).toContain('新建监控');
    expect(createHtml).toContain('data-guard="private-route"');
    expect(createHtml).not.toContain('not-found');

    expect(detailHtml).toContain('监控详情');
    expect(detailHtml).toContain('探测成功');
    expect(detailHtml).toContain('data-guard="private-route"');
    expect(detailHtml).not.toContain('not-found');
  });

  it('新建页提供常见 channel type 的模板默认体验', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/console/monitor-targets/new']}>
        <EditMonitorTarget />
      </MemoryRouter>,
    );

    expect(html).toContain('新建监控');
    expect(html).toContain('openai');
    expect(html).toContain('例如：OpenAI 主监控');
    expect(html).toContain('https://api.openai.com');
    expect(html).toContain('gpt-4.1-mini');
  });
});
