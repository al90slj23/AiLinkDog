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
    </section>
  );
}

export default LandingFinalCta;
