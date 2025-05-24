import React, { useEffect, useRef, useState, useCallback } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Handle mouse movement - direct positioning, no delay
  const handleMouseMove = useCallback((e) => {
    if (cursorRef.current) {
      // Direct transform without any interpolation for zero delay
      cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }
    
    if (!isVisible) {
      setIsVisible(true);
    }
  }, [isVisible]);

  // Handle mouse enter/leave
  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Handle mouse down/up for active state
  const handleMouseDown = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsActive(false);
  }, []);

  // Setup event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp]);

  // Hide default cursor
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: isActive ? 24 : 30,
        height: isActive ? 24 : 30,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        border: `2px solid ${isActive ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.8)'}`,
        borderRadius: '50%',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
        transition: 'width 0.1s ease, height 0.1s ease, border-color 0.1s ease',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden'
      }}
    />
  );
};

export default CustomCursor;