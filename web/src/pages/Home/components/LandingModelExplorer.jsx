import React, { useState } from 'react';

const models = [
  { name: 'claude-sonnet-4-5', inPrice: '¥21.00', outPrice: '¥105.00', latency: '1.18s', status: 'OPERATIONAL', bars: [80, 82, 78, 85, 81, 79, 83, 80, 82, 81] },
  { name: 'gpt-5', inPrice: '¥17.50', outPrice: '¥70.00', latency: '0.96s', status: 'OPERATIONAL', bars: [65, 70, 68, 72, 69, 74, 71, 70, 73, 69] },
  { name: 'gemini-2.5-pro', inPrice: '¥8.80', outPrice: '¥35.00', latency: '0.74s', status: 'OPERATIONAL', bars: [50, 55, 52, 58, 54, 56, 53, 57, 55, 56] },
  { name: 'deepseek-v3.2', inPrice: '¥0.98', outPrice: '¥1.96', latency: '0.52s', status: 'OPERATIONAL', bars: [38, 42, 40, 44, 41, 43, 40, 42, 41, 43] },
  { name: 'qwen3-max', inPrice: '¥2.80', outPrice: '¥8.40', latency: '0.61s', status: 'OPERATIONAL', bars: [44, 48, 46, 50, 47, 49, 46, 48, 47, 49] },
  { name: 'moonshot-v2', inPrice: '¥4.20', outPrice: '¥12.60', latency: '0.88s', status: 'DEGRADED', bars: [60, 75, 50, 80, 45, 70, 55, 85, 60, 72] },
];

function LandingModelExplorer({ t }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = models[selectedIndex];

  return (
    <section className='ald-home-section ald-home-section--muted' data-ald-reveal>
      <div className='ald-home-section__header-row'>
        <div className='ald-home-section__heading'>
          <span>§ MODELS</span>
          <h2>{t('多模型统一入口，按需自由切换')}</h2>
          <p>{t('点击任意模型查看实时延迟分布')}</p>
        </div>
        <div className='ald-home-section__actions'>
          <div className='ald-home-section__hint'>{t('价格与状态仅作首页展示，实际以控制台配置为准')}</div>
          <button type='button' className='ald-home-inline-button'>
            {t('查看全部 128 个模型')} →
          </button>
        </div>
      </div>

      <div className='ald-home-models'>
        <div className='ald-home-models__table'>
          <div className='ald-home-models__head'>
            <span>MODEL</span>
            <span>IN / 1M</span>
            <span>OUT / 1M</span>
            <span>P50</span>
            <span>STATUS</span>
          </div>
          {models.map((model, index) => (
            <button
              key={model.name}
              type='button'
              className={`ald-home-models__row ${index === selectedIndex ? 'is-active' : ''}`}
              onClick={() => setSelectedIndex(index)}
            >
              <span>{model.name}</span>
              <span>{model.inPrice}</span>
              <span>{model.outPrice}</span>
              <span>{model.latency}</span>
              <span className={model.status === 'OPERATIONAL' ? 'is-ok' : 'is-degraded'}>
                {model.status}
              </span>
            </button>
          ))}
        </div>

        <div className='ald-home-models__detail'>
          <div>
            <label>SELECTED</label>
            <strong>{selected.name}</strong>
            <p className='ald-home-models__detail-copy'>
              {t('适合需要稳定输出、统一路由与透明计费的生产场景。')}
            </p>
          </div>
          <div>
            <label>EST. 1K TOKENS</label>
            <strong className='ald-home-highlight'>¥0.3360</strong>
            <p className='ald-home-models__detail-copy'>
              {t('以输入 + 输出组合估算，实际价格以后台配置与路由结果为准。')}
            </p>
          </div>
          <div>
            <label>LATENCY · LAST 10 MIN</label>
            <div className='ald-home-models__bars' key={selected.name}>
              {selected.bars.map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <p className='ald-home-models__detail-copy'>
              {t('点击切换模型，快速感知不同模型的延迟与状态分布。')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingModelExplorer;
