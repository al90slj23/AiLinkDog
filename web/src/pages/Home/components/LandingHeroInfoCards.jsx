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

function LandingHeroInfoCards({ serverAddress, t }) {
  return (
    <div className='ald-home-hero__secondary-info'>
      <div className='ald-home-hero__meta-grid ald-home-hero__meta-grid--stacked'>
        <div className='ald-home-hero__meta-card'>
          <span>{t('兼容方式')}</span>
          <strong>{t('OpenAI Drop-in')}</strong>
        </div>
        <div className='ald-home-hero__meta-card'>
          <span>{t('默认接入')}</span>
          <strong>{serverAddress}/v1</strong>
        </div>
        <div className='ald-home-hero__meta-card'>
          <span>{t('鉴权方式')}</span>
          <strong>{t('Bearer API Key')}</strong>
        </div>
        <div className='ald-home-hero__meta-card'>
          <span>{t('接入成本')}</span>
          <strong>{t('改一行 base_url')}</strong>
        </div>
      </div>
    </div>
  );
}

export default LandingHeroInfoCards;
