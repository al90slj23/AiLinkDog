import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const defaultSpringOptions = {
  bounce: 0,
  stiffness: 420,
  damping: 30,
  mass: 0.22,
  restDelta: 0.001,
};

export function Spotlight({
  className = '',
  size = 220,
  springOptions = defaultSpringOptions,
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    if (!containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;
    parent.style.position = parent.style.position || 'relative';
    parent.style.overflow = 'hidden';
    setParentElement(parent);
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      if (!event.isTrusted || !parentElement) return;
      const rect = parentElement.getBoundingClientRect();
      const inBounds =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      setIsHovered(inBounds);
      if (!inBounds) return;

      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);
    },
    [mouseX, mouseY, parentElement],
  );

  useEffect(() => {
    if (!parentElement) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [parentElement, handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={`ald-ui-spotlight ${isHovered ? 'is-visible' : ''} ${className}`.trim()}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
      }}
    />
  );
}
