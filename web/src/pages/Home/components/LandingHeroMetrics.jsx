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
