import React from 'react';
import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import HeroRobotScene from './HeroRobotScene';

describe('HeroRobotScene', () => {
  test('renders as background scene without live guide frame copy', () => {
    const html = renderToStaticMarkup(
      <HeroRobotScene t={(key) => key} isDesktop={true} shouldLoadScene={false}>
        <div className='robot-test-overlay'>overlay</div>
      </HeroRobotScene>,
    );

    expect(html).toContain('ald-home-robot-bg');
    expect(html).not.toContain('ALD · LIVE GUIDE');
    expect(html).not.toContain('ald-home-robot-card');
    expect(html).toContain('robot-test-overlay');
    expect(html).toContain('ald-home-robot-bg__motion');
  });
});
