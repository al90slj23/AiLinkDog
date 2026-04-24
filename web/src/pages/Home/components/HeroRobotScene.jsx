import React from 'react';
import { SplineScene } from '../../../components/ui/spline-scene';

function HeroRobotScene({ children, isDesktop = true, shouldLoadScene = true }) {
  const showScene = isDesktop && shouldLoadScene;

  return (
    <div className={`ald-home-robot-bg ${showScene ? 'ald-home-robot-bg--active' : 'ald-home-robot-bg--idle'}`}>
      <div className='ald-home-robot-bg__gradient' aria-hidden='true' />
      {children ? <div className='ald-home-robot-bg__mid-layer'>{children}</div> : null}
      <div className='ald-home-robot-bg__scene'>
        {showScene ? (
          <SplineScene
            scene='/ald-robot.scene.splinecode'
            className='ald-home-robot-bg__canvas'
          />
        ) : (
          <div className='ald-home-robot-bg__placeholder' aria-hidden='true'>
            <div className='ald-home-robot-bg__orb' />
            <div className='ald-home-robot-bg__halo' />
            <div className='ald-home-robot-bg__core' />
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroRobotScene;
