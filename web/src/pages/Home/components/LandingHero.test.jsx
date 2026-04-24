import React from 'react';
import { describe, expect, test } from 'bun:test';
import { StaticRouter } from 'react-router-dom/server';
import { renderToStaticMarkup } from 'react-dom/server';
import LandingHero from './LandingHero';

describe('LandingHero', () => {
  test('keeps two-row three-column homepage structure', () => {
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
