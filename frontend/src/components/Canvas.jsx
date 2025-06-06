/**
 * Canvas Component with Camera Controls
 * 
 * Implementation inspired by:
 * - tldraw's canvas implementation: https://tldraw.dev/docs/editor/canvas
 * - Excalidraw's canvas component: https://github.com/excalidraw/excalidraw/blob/master/src/components/Canvas.tsx
 * - Figma's canvas viewport: https://www.figma.com/plugin-docs/api/properties/figma-viewport/
 * 
 * Features:
 * - Camera-controlled canvas viewport
 * - Zoom and pan interactions
 * - Responsive canvas container
 * - Transform application
 * - Eraser tool with translucent preview
 */

import React, { useRef, useEffect, useState } from 'react';
import EraserPreview from './EraserPreview';

const Canvas = () => {
  const canvasRef = useRef(null);

  // Tool state
  const [currentTool, setCurrentTool] = useState('select'); // 'select' | 'eraser'
  const [eraserPos, setEraserPos] = useState(null);
  const [isErasing, setIsErasing] = useState(false);

  // Example: handle mouse move for eraser preview
  const handleMouseMove = (e) => {
    if (currentTool === 'eraser') {
      setEraserPos({ x: e.clientX, y: e.clientY });
      if (isErasing) {
        // Example: log erasing position
        console.log('Erasing at', e.clientX, e.clientY);
        // TODO: 
      }
    }
  };

  const handleMouseDown = (e) => {
    if (currentTool === 'eraser') {
      setIsErasing(true);
      // Example: log erasing start
      console.log('Start erasing at', e.clientX, e.clientY);
      // TODO: Add your erase logic here
    }
  };

  const handleMouseUp = () => {
    setIsErasing(false);
  };

  // Example: toggle tool with a button (for demo)
  const toggleTool = () => {
    setCurrentTool((prev) => (prev === 'eraser' ? 'select' : 'eraser'));
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <button
        onClick={toggleTool}
        style={{ position: 'absolute', top: 16, left: 16, zIndex: 10000 }}
      >
        {currentTool === 'eraser' ? 'Switch to Select' : 'Switch to Eraser'}
      </button>
      <div
        ref={canvasRef}
        className="canvas-container"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          cursor: currentTool === 'eraser' ? 'none' : 'grab',
        }}
      >
        <div className="canvas-content">
          {/* add elements here */}
        </div>
        {/* Eraser preview */}
        {currentTool === 'eraser' && eraserPos && (
          <EraserPreview x={eraserPos.x} y={eraserPos.y} />
        )}
      </div>
    </div>
  );
};

export default Canvas; 