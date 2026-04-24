import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@douyinfe/semi-ui', () => {
  const React = require('react');

  const Typography = {
    Title: ({ children }) => React.createElement('h1', null, children),
    Text: ({ children }) => React.createElement('span', null, children),
    Paragraph: ({ children }) => React.createElement('p', null, children),
  };

  const Table = ({ dataSource = [] }) =>
    React.createElement(
      'div',
      null,
      dataSource.map((item, index) =>
        React.createElement('div', { key: index }, JSON.stringify(item)),
      ),
    );

  return {
    Card: ({ children }) => React.createElement('section', null, children),
    Col: ({ children }) => React.createElement('div', null, children),
    Empty: ({ description }) => React.createElement('div', null, description),
    Row: ({ children }) => React.createElement('div', null, children),
    Select: ({ optionList = [], value }) =>
      React.createElement(
        'select',
        { value },
        optionList.map((item) =>
          React.createElement('option', { key: item.value, value: item.value }, item.label),
        ),
      ),
    Space: ({ children }) => React.createElement('div', null, children),
    Table,
    Tag: ({ children }) => React.createElement('span', null, children),
    Timeline: ({ children }) => React.createElement('div', null, children),
    Typography,
  };
});

vi.mock('../../components/common/ui/Loading', () => ({
  default: () => <div>loading</div>,
}));

vi.mock('../../pages/User', () => ({ default: () => <div /> }));
vi.mock('../../components/auth/RegisterForm', () => ({ default: () => <div /> }));
vi.mock('../../components/auth/LoginForm', () => ({ default: () => <div /> }));
vi.mock('../../pages/NotFound', () => ({ default: () => <div>not-found</div> }));
vi.mock('../../pages/Forbidden', () => ({ default: () => <div /> }));
vi.mock('../../pages/Setting', () => ({ default: () => <div /> }));
vi.mock('../../components/auth/PasswordResetForm', () => ({ default: () => <div /> }));
vi.mock('../../components/auth/PasswordResetConfirm', () => ({ default: () => <div /> }));
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
vi.mock('../../components/auth/OAuth2Callback', () => ({ default: () => <div /> }));
vi.mock('../../components/settings/PersonalSetting', () => ({ default: () => <div /> }));
vi.mock('../../pages/Home', () => ({ default: () => <div /> }));
vi.mock('../../pages/Dashboard', () => ({ default: () => <div /> }));
vi.mock('../../pages/About', () => ({ default: () => <div /> }));
vi.mock('../../pages/UserAgreement', () => ({ default: () => <div /> }));
vi.mock('../../pages/PrivacyPolicy', () => ({ default: () => <div /> }));

vi.mock('../../helpers', () => ({
  AuthRedirect: ({ children }) => <div data-guard='auth-redirect'>{children}</div>,
  PrivateRoute: ({ children }) => <div data-guard='private-route'>{children}</div>,
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

vi.mock('../../hooks/status/useAdminStatus', () => ({
  TIME_WINDOW_OPTIONS: [
    { label: '24 小时', value: '24h' },
    { label: '7 天', value: '7d' },
  ],
  default: () => ({
    loading: false,
    error: '',
    windowValue: '7d',
    setWindowValue: vi.fn(),
    overview: {
      totalServices: 2,
      affectedServices: 1,
      averageLatency: '42 ms',
      overallStatusText: '降级',
      lastUpdatedAt: '2026-04-23 10:00:00',
    },
    serviceRows: [
      { key: 'api', name: 'API 网关', sourceKey: 'gateway-core', statusText: '正常' },
      { key: 'console', name: '控制台', sourceKey: 'console-core', statusText: '降级' },
    ],
    channelRows: [{ key: 'gateway-core', name: 'API 网关', statusText: '正常', latencyText: '42 ms' }],
    events: [{ key: 'evt-1', time: '2026-04-23 09:30', title: '控制台监控发现 1 项降级', levelText: 'warning' }],
    announcements: [{ key: 'ann-1', content: '平台公告：今晚维护窗口', type: 'warning', extra: '预计 10 分钟' }],
  }),
}));

import App from '../../App';
import ServiceStatusCenter from './index';

describe('ServiceStatusCenter', () => {
  it('后台页根据 hook 动态渲染状态数据', () => {
    const html = renderToStaticMarkup(<ServiceStatusCenter />);

    expect(html).toContain('ALD 服务状态中心');
    expect(html).toContain('API 网关');
    expect(html).toContain('控制台');
    expect(html).toContain('控制台监控发现 1 项降级');
    expect(html).toContain('平台公告：今晚维护窗口');
    expect(html).toContain('7 天');
  });

  it('App 在 /console/status 通过 AdminRoute 渲染后台页', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/console/status']}>
        <App />
      </MemoryRouter>,
    );

    expect(html).toContain('ALD 服务状态中心');
    expect(html).not.toContain('not-found');
    expect(html).toContain('data-guard="admin-route"');
    expect(html).not.toContain('data-guard="private-route"');
  });
});
