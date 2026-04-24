import React from 'react';
import { SplineScene } from '../../../components/ui/spline-scene';
import { Spotlight } from '../../../components/ui/spotlight';

function HeroRobotSceneSplineBackup({ t, isDesktop = true, shouldLoadScene = true }) {
  const showScene = isDesktop && shouldLoadScene;

  return (
    <div className={`ald-home-robot-card ${showScene ? 'ald-home-robot-card--active' : 'ald-home-robot-card--idle'}`}>
      <Spotlight className='ald-home-robot-card__spotlight' size={280} />
      <div className='ald-home-robot-card__overlay'>
        <span className='ald-home-robot-card__label'>ALD · LIVE GUIDE</span>
        <span className='ald-home-robot-card__badge'>Mouse-reactive</span>
      </div>
      <div className='ald-home-robot-card__scene'>
        {showScene ? (
          <SplineScene
            scene='/ald-robot.scene.splinecode'
            className='ald-home-robot-card__canvas'
          />
        ) : (
          <div className='ald-home-robot-card__placeholder' aria-hidden='true'>
            <div className='ald-home-robot-card__orb' />
            <div className='ald-home-robot-card__halo' />
            <div className='ald-home-robot-card__core' />
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroRobotSceneSplineBackup;
