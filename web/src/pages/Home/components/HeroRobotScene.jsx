import React, { useState } from 'react';
import { SplineScene } from '../../../components/ui/spline-scene';

function HeroRobotScene({ children, isDesktop = true, shouldLoadScene = true }) {
  const showScene = isDesktop && shouldLoadScene;
  
  // 调试面板状态
  const [debugScale, setDebugScale] = useState(0.95);
  const [debugX, setDebugX] = useState(0);
  const [debugY, setDebugY] = useState(0);
  const [debugWidth, setDebugWidth] = useState(68);

  return (
    <div className={`ald-home-robot-bg ${showScene ? 'ald-home-robot-bg--active' : 'ald-home-robot-bg--idle'}`}>
      
      {/* --- DEBUG PANEL --- */}
      <div style={{ position: 'fixed', top: 120, right: 20, zIndex: 9999, background: 'rgba(0,0,0,0.85)', color: 'white', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '15px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', width: '320px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <h4 style={{ margin: 0, paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', fontSize: '16px' }}>🤖 机器人调试面板</h4>
        
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '13px' }}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>缩放 (Scale)</span><span>{debugScale.toFixed(2)}</span></div>
          <input type="range" min="0.3" max="2" step="0.01" value={debugScale} onChange={e => setDebugScale(parseFloat(e.target.value))} />
        </label>
        
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '13px' }}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>X 轴偏移 (水平)</span><span>{debugX}px</span></div>
          <input type="range" min="-1000" max="1000" step="1" value={debugX} onChange={e => setDebugX(parseInt(e.target.value))} />
        </label>
        
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '13px' }}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Y 轴偏移 (垂直)</span><span>{debugY}px</span></div>
          <input type="range" min="-1000" max="1000" step="1" value={debugY} onChange={e => setDebugY(parseInt(e.target.value))} />
        </label>
        
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '13px' }}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>容器宽度 (%)</span><span>{debugWidth}%</span></div>
          <input type="range" min="30" max="150" step="1" value={debugWidth} onChange={e => setDebugWidth(parseInt(e.target.value))} />
          <span style={{ fontSize: '11px', color: '#aaa', lineHeight: '1.4' }}>如果机器人左右被截断，请调大这个宽度（建议100%），然后再缩小 Scale 调整整体大小。</span>
        </label>
        
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '12px', marginBottom: '5px', color: '#aaa' }}>调整好后，复制这里面的参数发给我：</div>
          <textarea 
            readOnly 
            value={`flex: 0 0 ${debugWidth}%;\ntransform: translate3d(${debugX}px, ${debugY}px, 50px) scale(${debugScale});`} 
            style={{ width: '100%', height: '50px', backgroundColor: '#222', color: '#0f0', border: '1px solid #444', borderRadius: '4px', padding: '5px', fontSize: '12px', fontFamily: 'monospace', resize: 'none' }} 
            onClick={e => e.target.select()}
          />
        </div>
      </div>
      {/* --- DEBUG PANEL END --- */}

      <div className='ald-home-robot-bg__gradient' aria-hidden='true' />
      {children ? <div className='ald-home-robot-bg__mid-layer'>{children}</div> : null}
      <div className='ald-home-robot-bg__scene'>
        {showScene ? (
          <div 
            className='ald-home-robot-bg__canvas' 
            style={{ 
              flex: `0 0 ${debugWidth}%`,
              transform: `translate3d(${debugX}px, ${debugY}px, 50px) scale(${debugScale})`,
              transition: 'none' // Disable transition for immediate feedback
            }}
          >
            <SplineScene
              scene='/ald-robot.scene.splinecode'
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : (
          <div className='ald-home-robot-bg__placeholder' aria-hidden='true'>
            <div className='ald-home-robot-bg__orb' />
            <div className='ald-home-robot-bg__halo' />
            <div className='ald-home-robot-bg__core' />
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroRobotScene;
