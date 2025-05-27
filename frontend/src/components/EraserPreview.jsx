import React from 'react';

const EraserPreview = ({ x, y, radius = 24 }) => (
  <div
    style={{
      position: 'fixed',
      pointerEvents: 'none',
      left: x - radius,
      top: y - radius,
      width: radius * 2,
      height: radius * 2,
      borderRadius: '50%',
      background: 'rgba(59,130,246,0.2)', // translucent blue
      border: '2px solid rgba(59,130,246,0.5)',
      zIndex: 9999,
      mixBlendMode: 'multiply',
      transition: 'background 0.1s, border 0.1s',
    }}
  />
);

export default EraserPreview; 