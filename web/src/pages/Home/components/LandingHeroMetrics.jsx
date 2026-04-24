import React from 'react';
import LandingHeroAnimatedMetric from './LandingHeroAnimatedMetric';

function LandingHeroMetrics({ t }) {
  return (
    <div className='ald-home-hero__primary-metrics'>
      <div className='ald-home-stats ald-home-stats--stacked'>
        <div>
          <strong>
            <LandingHeroAnimatedMetric value={99.98} suffix='%' decimals={2} />
          </strong>
          <span>{t('30 天可用率')}</span>
        </div>
        <div>
          <strong>
            <LandingHeroAnimatedMetric value={128} suffix='+' />
          </strong>
          <span>{t('接入模型数')}</span>
        </div>
        <div>
          <strong>
            <LandingHeroAnimatedMetric value={80} suffix='ms' prefix='< ' />
          </strong>
          <span>{t('路由转发开销')}</span>
        </div>
      </div>
    </div>
  );
}

export default LandingHeroMetrics;
