import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

const useSidebarMock = vi.fn(() => ({
  isModuleVisible: (sectionKey, moduleKey) =>
    (sectionKey === 'admin' && moduleKey === 'statuscenter') ||
    (sectionKey === 'admin' && moduleKey === 'upstreamtracking') ||
    (sectionKey === 'personal' && moduleKey === 'monitortargets'),
  hasSectionVisibleModules: (sectionKey) =>
    sectionKey === 'admin' || sectionKey === 'personal',
  loading: false,
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => React.createElement('a', { href: to, ...props }, children),
  useLocation: () => ({ pathname: '/console/status' }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value) => value,
  }),
}));

vi.mock('../../helpers/render', () => ({
  getLucideIcon: () => null,
}));

vi.mock('../../helpers', () => ({
  isAdmin: () => true,
  isRoot: () => false,
  showError: vi.fn(),
}));

vi.mock('../../hooks/common/useSidebarCollapsed', () => ({
  useSidebarCollapsed: () => [false, vi.fn()],
}));

vi.mock('../../hooks/common/useSidebar', () => ({
  useSidebar: () => useSidebarMock(),
}));

vi.mock('../../hooks/common/useMinimumLoadingTime', () => ({
  useMinimumLoadingTime: (value) => value,
}));

vi.mock('./components/SkeletonWrapper', () => ({
  default: ({ children }) => children,
}));

vi.mock('@douyinfe/semi-ui', () => {
  const wrapNavChildren = (children, renderWrapper) =>
    React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      if (child.type === NavItem) {
        const itemElement = React.createElement(NavItem, child.props);
        return renderWrapper
          ? renderWrapper({ itemElement, props: child.props })
          : itemElement;
      }

      if (child.type === NavSub) {
        return React.createElement(NavSub, {
          ...child.props,
          children: wrapNavChildren(child.props.children, renderWrapper),
        });
      }

      return React.cloneElement(child, {
        children: wrapNavChildren(child.props.children, renderWrapper),
      });
    });

  const NavRoot = ({ children, renderWrapper }) =>
    React.createElement('nav', null, wrapNavChildren(children, renderWrapper));
  const NavItem = ({ text, itemKey, className }) =>
    React.createElement('div', { 'data-item-key': itemKey, className }, text);
  const NavSub = ({ children, text, itemKey }) =>
    React.createElement(
      'section',
      {
        'data-item-key': itemKey,
      },
      text,
      children,
    );

  NavRoot.Item = NavItem;
  NavRoot.Sub = NavSub;

  return {
    Nav: NavRoot,
    Divider: () => React.createElement('hr'),
    Button: ({ children, ...props }) => React.createElement('button', props, children),
  };
});

if (!globalThis.localStorage) {
  const storage = new Map();
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
    clear: () => storage.clear(),
  };
}

if (!globalThis.document) {
  globalThis.document = {
    body: {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
    },
  };
}

import SiderBar from './SiderBar';

describe('SiderBar', () => {
  it('管理员且模块可见时显示服务状态中心入口', () => {
    const html = renderToStaticMarkup(<SiderBar />);

    expect(html).toContain('管理员');
    expect(html).toContain('服务状态中心');
    expect(html).toContain('href="/console/status"');
  });

  it('个人中心可见时显示我的监控入口', () => {
    const html = renderToStaticMarkup(<SiderBar />);

    expect(html).toContain('个人中心');
    expect(html).toContain('我的监控');
    expect(html).toContain('href="/console/monitor-targets"');
  });

  it('管理员且模块可见时显示上游跟踪入口', () => {
    const html = renderToStaticMarkup(<SiderBar />);

    expect(html).toContain('上游跟踪');
    expect(html).toContain('href="/console/upstreamtracking"');
  });
});
