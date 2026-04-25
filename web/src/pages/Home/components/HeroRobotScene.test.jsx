import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

if (!globalThis.document) {
  globalThis.document = {
    documentElement: {
      style: {
        setProperty: vi.fn(),
      },
      scrollHeight: 0,
    },
    querySelectorAll: () => [],
  };
}

if (!globalThis.window) {
  globalThis.window = {
    scrollY: 0,
    innerHeight: 1000,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    location: { reload: vi.fn() },
    requestAnimationFrame: (cb) => cb(),
  };
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
}

vi.mock('../../../components/ui/spline-scene', () => ({
  SplineScene: () =>
    React.createElement('div', { className: 'ald-home-robot-bg__motion' }),
}));

vi.mock('../../../helpers', () => ({
  API: { put: vi.fn(() => Promise.resolve({ data: { success: true } })) },
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

vi.mock('../../../context/Status', () => {
  const React = require('react');
  return {
    StatusContext: React.createContext([{ status: {} }]),
  };
});

vi.mock('@douyinfe/semi-ui', () => ({
  Slider: () => React.createElement('div', null),
}));

import HeroRobotScene from './HeroRobotScene';

describe('HeroRobotScene', () => {
  it('renders as background scene without live guide frame copy', () => {
    const html = renderToStaticMarkup(
      <HeroRobotScene t={(key) => key} isDesktop={true} shouldLoadScene={false}>
        <div className='robot-test-overlay'>overlay</div>
      </HeroRobotScene>,
    );

    expect(html).toContain('ald-home-robot-bg');
    expect(html).not.toContain('ALD · LIVE GUIDE');
    expect(html).not.toContain('ald-home-robot-card');
    expect(html).toContain('robot-test-overlay');
    expect(html).toContain('ald-home-robot-bg__placeholder');
  });
});
