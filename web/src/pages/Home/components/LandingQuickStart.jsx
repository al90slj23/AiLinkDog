import React from 'react';

const audiences = [
  [
    '开发者 / 独立开发者',
    '一个人也能跑起来的底层 AI 基础设施。按量计费，零最低消费。',
  ],
  ['AI 应用团队', '生产流量下的稳定保障，多渠道容灾，不被单一 provider 绑架。'],
  ['AI 创业团队', '把精力留给产品。账单、路由、鉴权、监控交给我们。'],
  ['出海团队', '中美双区节点，跨境可达，合规链路透明。'],
];

function LandingQuickStart({ serverAddress, t }) {
  const steps = [
    ['01', t('注册账号，获取 API Key'), 'ailink.dog/register'],
    ['02', t('将 base_url 指向站点 API 地址'), `${serverAddress}/v1`],
    ['03', t('调用任意模型，实时查看用量与账单'), 'console.ailink.dog'],
  ];

  return (
    <section className='ald-home-section ald-home-quickstart' data-ald-reveal>
      <div>
        <div className='ald-home-section__heading'>
          <span>§ QUICK START</span>
          <h2>{t('3 步完成接入')}</h2>
        </div>
        <div className='ald-home-steps'>
          {steps.map(([index, title, value]) => (
            <div key={index} className='ald-home-steps__item'>
              <span>{index}</span>
              <strong>{title}</strong>
              <code>{value}</code>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className='ald-home-section__heading'>
          <span>§ FOR</span>
          <h2>{t('为谁而做')}</h2>
        </div>
        <div className='ald-home-grid ald-home-grid--two'>
          {audiences.map(([title, description]) => (
            <article key={title} className='ald-home-card ald-home-card--lift'>
              <span className='ald-home-card__tag'>{t('适用')}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingQuickStart;
