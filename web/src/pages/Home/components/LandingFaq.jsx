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

const items = [
  [
    '与直接调用 provider 官方 API 有什么区别?',
    '同样的接口格式，多一层路由与监控。provider 波动时自动回源，并且可以跨模型统一计费。',
  ],
  [
    '会在中间存储我的 prompt 或 response 吗?',
    '默认不存储，仅保留计费所需的 token 计数与延迟指标。可在控制台显式开启日志。',
  ],
  [
    '稳定性与监控具体是怎么做的?',
    '每个模型有多条上游渠道，后台鉴别系统持续探测质量，异常节点自动降权或剔除。',
  ],
  [
    '能对接我们自部署的模型吗?',
    '可以。后续可以把私有模型或私有路由纳入统一网关，共用同一套密钥、监控与计费体系。',
  ],
  [
    '最低消费是多少?',
    '无最低消费。按实际 token 使用量计费，注册即可开始测试。',
  ],
];

function LandingFaq() {
  return (
    <section
      className='ald-home-section ald-home-section--muted'
      data-ald-reveal
    >
      <div className='ald-home-section__heading'>
        <span>§ FAQ</span>
        <h2>常见问题</h2>
      </div>
      <div className='ald-home-faq'>
        {items.map(([question, answer]) => (
          <details key={question} className='ald-home-faq__item'>
            <summary>
              <span>{question}</span>
              <span>+</span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default LandingFaq;
