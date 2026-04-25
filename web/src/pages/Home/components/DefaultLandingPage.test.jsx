import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { vi } from 'vitest';

vi.mock('@douyinfe/semi-ui', () => ({
  Button: ({ children, ...props }) =>
    React.createElement('button', props, children),
}));

vi.mock('@douyinfe/semi-icons', () => ({}));

vi.mock('../../../components/ui/spotlight', () => ({
  Spotlight: ({ children }) => React.createElement('div', null, children),
}));

vi.mock('./HeroRobotScene', () => ({
  default: ({ children }) =>
    React.createElement(
      'div',
      { className: 'ald-home-hero__primary-robot' },
      children,
    ),
}));

import DefaultLandingPage from './DefaultLandingPage';

function renderLandingPage() {
  return renderToStaticMarkup(
    <StaticRouter location='/'>
      <DefaultLandingPage
        docsLink='https://docs.example.com'
        isChinese={true}
        serverAddress='https://api.ailink.dog'
        themeMode='light'
        t={(key) => key}
      />
    </StaticRouter>,
  );
}

describe('DefaultLandingPage', () => {
  it('renders hero headline and primary CTAs', () => {
    const html = renderLandingPage();

    expect(html).toContain('接入所有模型');
    expect(html).toContain('开始接入');
    expect(html).toContain('查看文档');
    expect(html).toContain('ALD');
    expect(html).toContain('ald-home-hero__row--primary');
    expect(html).toContain('ald-home-hero__row--secondary');
  });
});
