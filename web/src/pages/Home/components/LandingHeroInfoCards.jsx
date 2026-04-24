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
