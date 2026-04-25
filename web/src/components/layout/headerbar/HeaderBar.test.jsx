import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

let headerNavModules = {
  home: true,
  status: true,
  console: true,
  pricing: {
    enabled: true,
    requireAuth: false,
  },
  docs: false,
  about: true,
};

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) =>
    React.createElement('a', { href: to, ...props }, children),
}));

vi.mock('../../../hooks/common/useHeaderBar', () => ({
  useHeaderBar: () => ({
    userState: { user: { id: 1 } },
    statusState: {},
    isMobile: false,
    collapsed: false,
    logoLoaded: true,
    currentLang: 'zh',
    isLoading: false,
    systemName: 'AiLinkDog',
    logo: '',
    isNewYear: false,
    isSelfUseMode: false,
    docsLink: '',
    isDemoSiteMode: false,
    isConsoleRoute: false,
    theme: 'light',
    headerNavModules,
    pricingRequireAuth: false,
    logout: vi.fn(),
    handleLanguageChange: vi.fn(),
    handleThemeToggle: vi.fn(),
    handleMobileMenuToggle: vi.fn(),
    navigate: vi.fn(),
    t: (value) => value,
  }),
}));

vi.mock('../../../hooks/common/useNotifications', () => ({
  useNotifications: () => ({
    noticeVisible: false,
    unreadCount: 0,
    handleNoticeOpen: vi.fn(),
    handleNoticeClose: vi.fn(),
    getUnreadKeys: () => [],
  }),
}));

vi.mock('../NoticeModal', () => ({
  default: () => null,
}));

vi.mock('./MobileMenuButton', () => ({
  default: () => null,
}));

vi.mock('./HeaderLogo', () => ({
  default: () => null,
}));

vi.mock('./ActionButtons', () => ({
  default: () => null,
}));

vi.mock('../components/SkeletonWrapper', () => ({
  default: ({ children }) => children,
}));

import HeaderBar from './index';

describe('HeaderBar', () => {
  it('status 为 true 时显示服务状态入口并指向 /status', () => {
    headerNavModules = {
      home: true,
      status: true,
      console: true,
      pricing: {
        enabled: true,
        requireAuth: false,
      },
      docs: false,
      about: true,
    };

    const html = renderToStaticMarkup(
      <HeaderBar onMobileMenuToggle={vi.fn()} drawerOpen={false} />,
    );

    expect(html).toContain('服务状态');
    expect(html).toContain('href="/status"');
  });

  it('缺省 status 时也显示服务状态入口', () => {
    headerNavModules = {
      home: true,
      console: true,
      pricing: {
        enabled: true,
        requireAuth: false,
      },
      docs: false,
      about: true,
    };

    const html = renderToStaticMarkup(
      <HeaderBar onMobileMenuToggle={vi.fn()} drawerOpen={false} />,
    );

    expect(html).toContain('服务状态');
    expect(html).toContain('href="/status"');
  });

  it('status 为 false 时不显示服务状态入口', () => {
    headerNavModules = {
      home: true,
      status: false,
      console: true,
      pricing: {
        enabled: true,
        requireAuth: false,
      },
      docs: false,
      about: true,
    };

    const html = renderToStaticMarkup(
      <HeaderBar onMobileMenuToggle={vi.fn()} drawerOpen={false} />,
    );

    expect(html).not.toContain('服务状态');
    expect(html).not.toContain('href="/status"');
  });
});
