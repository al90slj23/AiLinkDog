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

function LandingQuickStart({ serverAddress, t }) {
  const steps = [
    {
      num: '01',
      title: t('获取 API Key'),
      desc: t('注册并创建您的统一调用密钥'),
    },
    {
      num: '02',
      title: t('修改 Base URL'),
      desc: `${t('将 API 地址指向')} ${serverAddress}/v1`,
    },
    {
      num: '03',
      title: t('开始调用'),
      desc: t('兼容 OpenAI SDK，一键接入上百款模型'),
    },
  ];

  const metrics = [
    { value: '99.98%', label: t('30 天可用率') },
    { value: '128+', label: t('接入模型数') },
    { value: '< 80ms', label: t('路由转发开销') },
  ];

  const features = [
    {
      icon: '🛡️',
      title: t('零日志保留'),
      desc: t('默认不留存对话数据，保障隐私'),
    },
    {
      icon: '⚡️',
      title: t('高并发支持'),
      desc: t('企业级吞吐量，毫秒级响应'),
    },
    {
      icon: '🔄',
      title: t('无缝兼容生态'),
      desc: t('支持 LangChain/Dify 等主流框架'),
    },
  ];

  return (
    <div className='ald-home-hero__secondary-info'>
      <div className='ald-home-hero__quickstart-layout'>
        
        {/* Column 1: Platform Metrics */}
        <div className='ald-home-hero__quickstart-column'>
          <div className='ald-home-hero__secondary-header'>
            <span>§ CORE METRICS</span>
            <p>{t('平台核心指标')}</p>
          </div>
          <div className='ald-home-hero__quickstart-metrics'>
            {metrics.map((m, i) => (
              <div key={i} className='ald-home-hero__quickstart-metric-item'>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Start */}
        <div className='ald-home-hero__quickstart-column'>
          <div className='ald-home-hero__secondary-header'>
            <span>§ QUICK START</span>
            <p>{t('三步完成接入')}</p>
          </div>
          <div className='ald-home-hero__timeline'>
            <div className='ald-home-hero__timeline-line'>
              <div className='ald-home-hero__timeline-glow'></div>
            </div>

            {steps.map((step, i) => (
              <div key={i} className='ald-home-hero__timeline-item'>
                <div className='ald-home-hero__timeline-dot'>{step.num}</div>
                <div className='ald-home-hero__timeline-content'>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Enterprise Ready */}
        <div className='ald-home-hero__quickstart-column'>
          <div className='ald-home-hero__secondary-header'>
            <span>§ ENTERPRISE</span>
            <p>{t('安全与生态')}</p>
          </div>
          <div className='ald-home-hero__features'>
            {features.map((feature, i) => (
              <div key={i} className='ald-home-hero__feature-item'>
                <div className='ald-home-hero__feature-icon'>{feature.icon}</div>
                <div className='ald-home-hero__feature-content'>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row: Framework Logos / Tags */}
      <div className='ald-home-hero__frameworks'>
        <span className='ald-home-hero__frameworks-label'>{t('已完美支持以下框架')}</span>
        <div className='ald-home-hero__frameworks-list'>
          {['LangChain', 'LlamaIndex', 'Dify', 'FastGPT', 'Next.js', 'Vercel AI SDK', 'AnythingLLM'].map((fw, i) => (
            <div key={i} className='ald-home-hero__framework-tag'>
              {fw}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingQuickStart;
