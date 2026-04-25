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
    ['01', t('注册账号，获取 API Key'), 'ailink.dog/register'],
    ['02', t('将 base_url 指向站点 API 地址'), `${serverAddress}/v1`],
    ['03', t('调用任意模型，实时查看用量与账单'), 'console.ailink.dog'],
  ];

  return (
    <div className='ald-home-hero__secondary-info'>
      <div className='ald-home-hero__secondary-header'>
        <span>§ QUICK START</span>
        <p>{t('3 步完成接入')}</p>
      </div>
      <div className='ald-home-steps--compact'>
        {steps.map(([index, title, value]) => (
          <div key={index} className='ald-home-steps__item--compact'>
            <div className='ald-home-steps__item-header'>
              <span>{index}</span>
              <strong>{title}</strong>
            </div>
            <code>{value}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingQuickStart;
