import React from 'react';

function LandingHeroCodeBlock({ lang, onChangeLang, snippets, t }) {
  return (
    <div className='ald-home-hero__secondary-code'>
      <div className='ald-home-code ald-home-code--hero'>
        <div className='ald-home-code__tabs'>
          <div className='ald-home-code__tab-buttons'>
            {Object.keys(snippets).map((item) => (
              <button
                key={item}
                type='button'
                className={item === lang ? 'is-active' : ''}
                onClick={() => onChangeLang(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <span>OpenAI 兼容 · /v1/chat/completions</span>
        </div>
        <pre>{snippets[lang] ? snippets[lang].join('\n') : ''}</pre>
        <div className='ald-home-code__log'>
          <div className='ald-home-code__log-header'>
            <span>{t ? t('路由日志') : '路由日志'} · {t ? t('实时') : '实时'}</span>
            <span className='ald-home-code__ok'>
              <span className="ald-pulse" style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--ald-green)' }}/>
              200 · 1.12s
            </span>
          </div>
          <div>→ upstream-a · 429 rate-limited</div>
          <div>→ upstream-b · 200 · 346ms</div>
          <div className='ald-home-code__reroute'>✓ {t ? t('已自动回源，用户侧无感知') : '已自动回源，用户侧无感知'}</div>
        </div>
      </div>
    </div>
  );
}

export default LandingHeroCodeBlock;
