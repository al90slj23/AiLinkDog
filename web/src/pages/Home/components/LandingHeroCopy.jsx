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
      // 以 1920 为 100% 的基准比例
      let newScale = width / 1920;
      
      // 在极小屏幕下稍微收底，避免文字小到无法看清
      if (newScale < 0.4) {
        newScale = 0.4;
      }
      
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
