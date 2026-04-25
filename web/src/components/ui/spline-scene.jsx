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
import React, { Suspense, lazy, useEffect, useRef } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

function SplineFallback({ error = false }) {
  return (
    <div
      className='ald-ui-spline-host'
      style={{ width: '100%', height: '100%' }}
    >
      <div
        className={`ald-ui-spline-shell ${error ? 'is-error' : 'is-loading'}`}
      >
        <div className='ald-ui-spline-fallback'>
          <span className='ald-ui-loader' />
        </div>
        <div className='ald-ui-spline-copy'>
          <strong>{error ? '3D Scene Unavailable' : 'Loading 3D Scene'}</strong>
          <span>
            {error
              ? '已自动回退到轻量模式，主页其余内容可继续使用。'
              : '正在加载交互式机器人场景...'}
          </span>
        </div>
      </div>
    </div>
  );
}

class SplineSceneBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('[SplineScene]', error);
  }

  render() {
    if (this.state.hasError) {
      return <SplineFallback error={true} />;
    }

    return this.props.children;
  }
}

export function SplineScene({ scene, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    let frameId = 0;
    let lastEvent = null;

    const dispatchPointerMove = () => {
      frameId = 0;
      const canvas = root.querySelector('canvas');
      if (!canvas || !lastEvent) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = Math.min(
        Math.max(lastEvent.clientX, rect.left + 1),
        rect.right - 1,
      );
      const clientY = Math.min(
        Math.max(lastEvent.clientY, rect.top + 1),
        rect.bottom - 1,
      );

      const pointerPayload = {
        bubbles: true,
        clientX,
        clientY,
        pointerId: 1,
        pointerType: 'mouse',
      };

      canvas.dispatchEvent(new PointerEvent('pointermove', pointerPayload));
      canvas.dispatchEvent(
        new MouseEvent('mousemove', {
          bubbles: true,
          clientX,
          clientY,
        }),
      );
    };

    const handleWindowMove = (event) => {
      lastEvent = event;
      if (frameId) return;
      frameId = requestAnimationFrame(dispatchPointerMove);
    };

    const handleWindowEnter = (event) => {
      lastEvent = event;
      const canvas = root.querySelector('canvas');
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = Math.min(
        Math.max(event.clientX, rect.left + 1),
        rect.right - 1,
      );
      const clientY = Math.min(
        Math.max(event.clientY, rect.top + 1),
        rect.bottom - 1,
      );
      canvas.dispatchEvent(
        new MouseEvent('mouseenter', {
          bubbles: true,
          clientX,
          clientY,
        }),
      );
    };

    window.addEventListener('pointermove', handleWindowMove, { passive: true });
    window.addEventListener('mouseenter', handleWindowEnter, { passive: true });

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handleWindowMove);
      window.removeEventListener('mouseenter', handleWindowEnter);
    };
  }, []);

  return (
    <SplineSceneBoundary>
      <Suspense fallback={<SplineFallback />}>
        <div
          ref={containerRef}
          className={`ald-ui-spline-host ${className}`}
          style={{ width: '100%', height: '100%' }}
        >
          <Spline scene={scene} style={{ width: '100%', height: '100%' }} />
        </div>
      </Suspense>
    </SplineSceneBoundary>
  );
}
