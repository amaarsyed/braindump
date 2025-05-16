import React from 'react';
import { useCursorify } from '@cursorify/react';

const CustomCursor = () => {
  const { mouseState } = useCursorify();

  return (
    <div
      style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        border: '1px solid rgba(0, 0, 0, 0.8)',
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: `translate(${mouseState.x - 15}px, ${mouseState.y - 15}px)`,
        mixBlendMode: 'difference',
        ...(mouseState.isHovering && {
          transform: `translate(${mouseState.x - 15}px, ${mouseState.y - 15}px) scale(1.5)`,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: '2px',
        }),
        ...(mouseState.isClicking && {
          transform: `translate(${mouseState.x - 15}px, ${mouseState.y - 15}px) scale(0.8)`,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: '2px',
        }),
      }}
    >
      <div
        style={{
          width: '4px',
          height: '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '50%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          ...(mouseState.isHovering && {
            transform: 'translate(-50%, -50%) scale(0.5)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }),
          ...(mouseState.isClicking && {
            transform: 'translate(-50%, -50%) scale(0.8)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }),
        }}
      />
    </div>
  );
};

export default CustomCursor; 