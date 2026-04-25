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
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@douyinfe/semi-ui';
import LandingHero from './LandingHero';
import LandingCapabilities from './LandingCapabilities';
import LandingModelExplorer from './LandingModelExplorer';
import LandingAudiences from './LandingAudiences';
import LandingFaq from './LandingFaq';
import LandingFinalCta from './LandingFinalCta';
import '../home.css';

const providerItems = [
  'OpenAI',
  'Claude',
  'Gemini',
  'DeepSeek',
  'Qwen',
  'Grok',
  'Moonshot',
  'GLM',
  '128+',
];

const tickerItems = [
  ['claude-sonnet-4-5', 'healthy'],
  ['gpt-5', '+0.3% faster'],
  ['gemini-2.5-pro', 'healthy'],
  ['deepseek-v3.2', '-0.4 / 1M'],
  ['qwen3-max', 'healthy'],
  ['moonshot-v2', 'degraded · rerouting'],
  ['llama-4-405b', 'new · available'],
  ['glm-4.6-plus', 'new · available'],
];

function DefaultLandingPage({
  docsLink,
  isChinese,
  serverAddress,
  themeMode,
  t,
}) {
  const isDark = themeMode === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    const revealNodes = Array.from(
      document.querySelectorAll('[data-ald-reveal]'),
    );

    const updateScrollMetrics = () => {
      const scrollTop = window.scrollY || 0;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, scrollTop / maxScroll) : 0;
      root.style.setProperty('--ald-scroll-progress', `${progress}`);
      root.style.setProperty('--ald-scroll-y', `${scrollTop}`);
    };

    updateScrollMetrics();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateScrollMetrics();
        ticking = false;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    revealNodes.forEach((node) => observer.observe(node));
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className={`ald-home ${isDark ? 'ald-home-dark' : 'ald-home-light'}`}>
      <div className='ald-home-progress' aria-hidden='true' />
      <header className='ald-home-nav'>
        <div className='ald-home-nav__left'>
          <Link to='/' className='ald-home-brand' aria-label='AiLink.Dog'>
            <img
              src='/logo.png'
              alt='AiLink.Dog'
              className='ald-home-brand__logo'
            />
            <span className='ald-home-brand__text'>
              AiLink<span className='ald-home-brand__dot'>.Dog</span>
            </span>
          </Link>
          <span className='ald-home-badge'>ALD</span>
          <nav className='ald-home-nav__links' aria-label='Homepage'>
            <Link to='/pricing'>{t('模型广场')}</Link>
            <Link to='/pricing'>{t('定价')}</Link>
            {docsLink && (
              <a href={docsLink} target='_blank' rel='noreferrer'>
                {t('文档')}
              </a>
            )}
            <Link to='/console'>{t('控制台')}</Link>
          </nav>
        </div>
        <div className='ald-home-nav__right'>
          <span className='ald-home-nav__meta'>
            {isChinese ? '中 / EN' : 'EN / 中'}
          </span>
          <span className='ald-home-nav__meta'>
            {isDark ? 'dark' : 'light'}
          </span>
          <Link to='/login' className='ald-home-nav__login'>
            {t('登录')}
          </Link>
          <Link to='/register'>
            <Button theme='solid' type='primary' className='ald-home-nav__cta'>
              {t('开始接入')}
            </Button>
          </Link>
        </div>
      </header>

      <div className='ald-home-ticker'>
        <div className='ald-home-ticker__track'>
          {[...tickerItems, ...tickerItems].map(([model, status], index) => (
            <span key={`${model}-${index}`} className='ald-home-ticker__item'>
              <span className='ald-home-ticker__dot' />
              <span className='ald-home-ticker__model'>{model}</span>
              <span>{status}</span>
            </span>
          ))}
        </div>
      </div>

      <main>
        <LandingHero docsLink={docsLink} serverAddress={serverAddress} t={t} />
        <section className='ald-home-proof' data-ald-reveal>
          <div className='ald-home-proof__intro'>
            <span>§ TRUST</span>
            <p>{t('支持多家主流模型供应商，面向真实生产场景持续维护')}</p>
          </div>
          <div className='ald-home-proof__grid'>
            {providerItems.map((item, index) => (
              <div
                key={item}
                className={`ald-home-proof__item ald-home-proof__item--${index % 3}`}
              >
                {item}
              </div>
            ))}
          </div>
        </section>
        <LandingCapabilities t={t} />
        <LandingModelExplorer t={t} />
        <LandingAudiences t={t} />
        <LandingFaq t={t} />
        <LandingFinalCta docsLink={docsLink} t={t} />
      </main>
    </div>
  );
}

export default DefaultLandingPage;
