import React from 'react';
import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
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
  test('renders hero headline and primary CTAs', () => {
    const html = renderLandingPage();

    expect(html).toContain('接入所有模型');
    expect(html).toContain('开始接入');
    expect(html).toContain('查看文档');
    expect(html).toContain('ALD');
    expect(html).toContain('ald-home-hero__row--primary');
    expect(html).toContain('ald-home-hero__row--secondary');
  });
});
