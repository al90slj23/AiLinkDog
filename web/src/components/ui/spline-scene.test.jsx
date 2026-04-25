import React from 'react';
import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { SplineScene } from './spline-scene';

describe('SplineScene', () => {
  test('renders identifiable fallback shell', () => {
    const html = renderToStaticMarkup(
      <SplineScene
        scene='https://example.com/scene.splinecode'
        className='demo-scene'
      />,
    );

    expect(html).toContain('ald-ui-spline-shell');
    expect(html).toContain('ald-ui-spline-host');
  });
});
