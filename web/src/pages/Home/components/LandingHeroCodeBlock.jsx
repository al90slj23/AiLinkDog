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
import React, { useEffect, useRef, useState } from 'react';

const PRIORITY = ['curl', 'python', 'node', 'go', 'java', 'rust', 'php'];

function LandingHeroCodeBlock({ lang, onChangeLang, snippets, t }) {
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(PRIORITY.length);

  useEffect(() => {
    const updateCount = () => {
      if (!containerRef.current) return;
      // .ald-home-code__tabs contains tab buttons and a span.
      // We estimate the width needed for each button based on PRIORITY order
      // average button width around 50px + gap.
      // But a more robust way is to measure available width.
      const tabsWidth = containerRef.current.clientWidth;
      const rightSpanWidth = 240; // Approximate width of "OpenAI 兼容 · /v1/chat/completions" + padding
      const availableWidth = tabsWidth - rightSpanWidth;

      if (availableWidth <= 0) {
        setVisibleCount(2); // Minimum 2 tabs if very tight
        return;
      }

      // Estimate button widths (including gaps): curl~50, python~65, node~55, go~40, java~50, rust~50, php~45
      const buttonWidths = [50, 65, 55, 40, 50, 50, 45];
      let currentWidth = 0;
      let count = 0;

      for (let i = 0; i < PRIORITY.length; i++) {
        currentWidth += buttonWidths[i];
        if (currentWidth > availableWidth && count >= 2) {
          break;
        }
        count++;
      }

      setVisibleCount(Math.min(PRIORITY.length, count));
    };

    updateCount();
    const observer = new ResizeObserver(updateCount);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const visibleKeys = PRIORITY.slice(0, visibleCount);

  // If the currently selected lang is hidden due to resize, switch to 'curl'
  useEffect(() => {
    if (!visibleKeys.includes(lang) && visibleKeys.length > 0) {
      onChangeLang(visibleKeys[0]);
    }
  }, [visibleKeys, lang, onChangeLang]);

  return (
    <div className='ald-home-hero__secondary-code'>
      <div className='ald-home-code ald-home-code--hero'>
        <div className='ald-home-code__tabs' ref={containerRef}>
          <div className='ald-home-code__tab-buttons'>
            {visibleKeys.map((item) => (
              <button
                key={item}
                type='button'
                className={item === lang ? 'is-active' : ''}
                onClick={() => onChangeLang(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <span>OpenAI 兼容 · /v1/chat/completions</span>
        </div>
        <pre>{snippets[lang] ? snippets[lang].join('\n') : ''}</pre>
        <div className='ald-home-code__log'>
          <div className='ald-home-code__log-header'>
            <span>
              {t ? t('路由日志') : '路由日志'} · {t ? t('实时') : '实时'}
            </span>
            <span className='ald-home-code__ok'>
              <span
                className='ald-pulse'
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  background: 'var(--ald-green)',
                }}
              />
              200 · 1.12s
            </span>
          </div>
          <div>→ upstream-a · 429 rate-limited</div>
          <div>→ upstream-b · 200 · 346ms</div>
          <div className='ald-home-code__reroute'>
            ✓ {t ? t('已自动回源，用户侧无感知') : '已自动回源，用户侧无感知'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingHeroCodeBlock;
