import React, { useRef, useEffect, useState } from 'react';

export function HomeRow({ split, left, right, children, className = '' }) {
  if (split) {
    return (
      <div className={`ald-home-row ald-home-row--split ${className}`}>
        <div className="ald-home-col ald-home-col--left">
          {left}
        </div>
        <div className="ald-home-col ald-home-col--right">
          {right}
        </div>
      </div>
    );
  }
  return (
    <div className={`ald-home-row ald-home-row--full ${className}`}>
      <div className="ald-home-col ald-home-col--full">
        {children}
      </div>
    </div>
  );
}

export function ScaleBlock({ children, baseWidth = 768 }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState('auto');

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !contentRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      if (containerWidth === 0) return;
      
      let newScale = containerWidth / baseWidth;
      setScale(newScale);
      
      const contentHeight = contentRef.current.offsetHeight;
      setHeight(contentHeight * newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    const observer = new ResizeObserver(updateScale);
    if (contentRef.current) observer.observe(contentRef.current);
    if (containerRef.current) observer.observe(containerRef.current);
    
    return () => {
      window.removeEventListener('resize', updateScale);
      observer.disconnect();
    };
  }, [baseWidth]);

  return (
    <div ref={containerRef} style={{ width: '100%', height, position: 'relative' }}>
      <div 
        ref={contentRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: baseWidth,
          position: 'absolute',
          left: '50%',
          marginLeft: -(baseWidth / 2)
        }}
      >
        {children}
      </div>
    </div>
  );
}
