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
