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

const audiences = [
  [
    '开发者 / 独立开发者',
    '一个人也能跑起来的底层 AI 基础设施。按量计费，零最低消费。',
  ],
  ['AI 应用团队', '生产流量下的稳定保障，多渠道容灾，不被单一 provider 绑架。'],
  ['AI 创业团队', '把精力留给产品。账单、路由、鉴权、监控交给我们。'],
  ['出海团队', '中美双区节点，跨境可达，合规链路透明。'],
];

function LandingAudiences({ t }) {
  return (
    <section className='ald-home-section' data-ald-reveal>
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
    </section>
  );
}

export default LandingAudiences;
