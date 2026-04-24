import React from 'react';
import { Button } from '@douyinfe/semi-ui';
import { Link } from 'react-router-dom';

function LandingFinalCta({ docsLink, t }) {
  return (
    <section className='ald-home-final' data-ald-reveal>
      <img src='/logo.png' alt='AiLink.Dog' className='ald-home-final__logo' />
      <h2>
        {t('接入所有模型')}, <span>{t('自由定义选择')}</span>。
      </h2>
      <p>{t('更低算力成本，享受 AI 浪潮。')}</p>
      <small>All AI, One Link — Follow the Dog.</small>
      <div className='ald-home-final__actions'>
        <Link to='/register'>
          <Button theme='solid' type='primary' className='ald-home-button-primary'>
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
    </section>
  );
}

export default LandingFinalCta;
