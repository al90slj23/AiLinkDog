import React from 'react';
import { describe, expect, it } from 'vitest';
import { StaticRouter } from 'react-router-dom/server';
import { renderToStaticMarkup } from 'react-dom/server';
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

import LandingHero from './LandingHero';

describe('LandingHero', () => {
  it('keeps two-row three-column homepage structure', () => {
    const html = renderToStaticMarkup(
      <StaticRouter location='/'>
        <LandingHero
          docsLink='https://docs.example.com'
          serverAddress='https://api.ailink.dog'
          t={(key) => key}
        />
      </StaticRouter>,
    );

    expect(html).toContain('ald-home-hero__row--primary');
    expect(html).toContain('ald-home-hero__row--secondary');
    expect(html).toContain('ald-home-hero__row--metrics');
    expect(html).toContain('ald-home-hero__primary-copy');
    expect(html).toContain('ald-home-hero__primary-robot');
    expect(html).toContain('ald-home-hero__secondary-left');
    expect(html).toContain('ald-home-hero__secondary-code');
  });
});
