import React from 'react';

const capabilities = [
  ['01', '稳定性优先', 'Stability First', '多路由自动回源，provider 波动用户无感。持续监控模型健康状态。'],
  ['02', '真实、不掺水', 'No Dilution', '模型能力与运行状态透明展示，不做营销话术修饰。'],
  ['03', 'OpenAI 兼容', 'Drop-in API', '改 base_url 即可完成迁移。所有官方 SDK 与工具链开箱可用。'],
  ['04', '统一入口', 'One Gateway', '一个密钥、一套账单，按需在 128+ 模型之间自由切换。'],
  ['05', '鉴别与持续监控', 'Active Monitoring', '后台特有的渠道鉴别逻辑，实时筛选劣质节点，只保留健康上游。'],
  ['06', '综合成本更低', 'Real Lower Cost', '智能路由 + 缓存 + 压缩，让账单真实下降，而非仅卷表面单价。'],
];

function LandingCapabilities() {
  return (
    <section className='ald-home-section' data-ald-reveal>
      <div className='ald-home-section__heading'>
        <span>§ CORE</span>
        <h2>六项核心能力</h2>
        <p>Six things we take seriously.</p>
      </div>
      <div className='ald-home-grid ald-home-grid--three'>
        {capabilities.map(([index, title, subtitle, body]) => (
          <article key={index} className='ald-home-card ald-home-card--lift'>
            <div className='ald-home-card__meta'>
              <span>— {index}</span>
              <span className='ald-home-card__dot'>●</span>
            </div>
            <h3>{title}</h3>
            <small>{subtitle}</small>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LandingCapabilities;
