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
import React, { useEffect, useState } from 'react';
import { Button } from '@douyinfe/semi-ui';
import { Link } from 'react-router-dom';

function DogMark() {
  return (
    <span className='ald-home-dog-mark' aria-hidden='true'>
      <img src='/logo.png' alt='' />
    </span>
  );
}

function LandingHeroCopy({ docsLink, t }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // 以 1536 为 100% 的基准比例
      let newScale = width / 1536;
      
      // 在极小屏幕下稍微收底，大屏幕下封顶，避免过度缩放
      newScale = Math.min(Math.max(newScale, 0.5), 1.5);
      
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始计算

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='ald-home-hero__primary-copy-container'>
      <div 
        className='ald-home-hero__primary-copy'
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: '100%'
        }}
      >
        <div className='ald-home-chip'>
          All 128 models operational · 实时监控中
        </div>
        <div className='ald-home-eyebrow'>ALD · AI API Aggregation Platform</div>
        <h1>
          {t('接入所有模型')},
          <br />
          <span>{t('自由定义选择')}。</span>
        </h1>
        <p className='ald-home-hero__desc'>
          <span>{t('面向 AI 开发者与应用团队的无忧中转平台.')}</span>
        </p>
        <p className='ald-home-hero__slogan ald-home-hero__slogan--emphasis'>
          <span>All AI, One Link — Follow the Dog!</span>
          <DogMark />
        </p>
        <div className='ald-home-hero__actions'>
          <Link to='/register'>
            <Button
              theme='solid'
              type='primary'
              className='ald-home-button-primary'
            >
              {t('开始接入')}
            </Button>
          </Link>
          {docsLink && (
            <a href={docsLink} target='_blank' rel='noreferrer'>
              <Button theme='borderless' className='ald-home-button-secondary'>
                {t('查看文档')}
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingHeroCopy;
