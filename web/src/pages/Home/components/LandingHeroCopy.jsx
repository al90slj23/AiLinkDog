import React, { useState } from 'react';
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
  const [debugBaseWidth, setDebugBaseWidth] = useState(1440);
  const [debugMinScale, setDebugMinScale] = useState(0.7);
  const [debugMaxScale, setDebugMaxScale] = useState(1.3);
  const [debugOriginX, setDebugOriginX] = useState('center');
  const [debugOriginY, setDebugOriginY] = useState('center');

  return (
    <>
      <div 
        className='ald-home-hero__primary-copy'
        style={{
          transform: `scale(clamp(${debugMinScale}, 100vw / ${debugBaseWidth}, ${debugMaxScale}))`,
          transformOrigin: `${debugOriginX} ${debugOriginY}`
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

      <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 9999, background: 'var(--ald-card)', color: 'var(--ald-text)', padding: 20, borderRadius: 16, border: '1px solid var(--ald-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 14 }}>📝 文案缩放调试器</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, marginBottom: 10 }}>
          <div style={{display:'flex', justifyContent:'space-between'}}><span>基准屏幕宽度(vw)</span><span>{debugBaseWidth}px</span></div>
          <input type="range" min="800" max="2500" step="10" value={debugBaseWidth} onChange={e=>setDebugBaseWidth(e.target.value)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, marginBottom: 10 }}>
          <div style={{display:'flex', justifyContent:'space-between'}}><span>最小缩放</span><span>{debugMinScale}</span></div>
          <input type="range" min="0.1" max="1" step="0.05" value={debugMinScale} onChange={e=>setDebugMinScale(e.target.value)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, marginBottom: 10 }}>
          <div style={{display:'flex', justifyContent:'space-between'}}><span>最大缩放</span><span>{debugMaxScale}</span></div>
          <input type="range" min="1" max="3" step="0.05" value={debugMaxScale} onChange={e=>setDebugMaxScale(e.target.value)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, marginBottom: 10 }}>
          <span>变换原点 (X, Y)</span>
          <select value={debugOriginX} onChange={e=>setDebugOriginX(e.target.value)}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
          <select value={debugOriginY} onChange={e=>setDebugOriginY(e.target.value)}>
            <option value="top">Top</option>
            <option value="center">Center</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>

        <textarea 
          readOnly 
          value={`transform: scale(clamp(${debugMinScale}, 100vw / ${debugBaseWidth}, ${debugMaxScale}));\ntransform-origin: ${debugOriginX} ${debugOriginY};`}
          style={{ width: '100%', height: 60, fontSize: 11, background: '#222', color: '#0f0', resize: 'none', padding: 5 }} 
          onClick={e=>e.target.select()}
        />
      </div>
    </>
  );
}

export default LandingHeroCopy;
