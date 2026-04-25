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
