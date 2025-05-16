import React, { useRef, useState, useEffect, useCallback } from "react";
import { LuUndo2, LuRedo2, LuSettings2, LuDownload, LuStickyNote, LuImage, LuSquare, LuCircle, LuTriangle, LuArrowUpRight, LuEraser, LuHand, LuMousePointer2, LuPencil, LuType, LuShapes, LuPalette, LuGripHorizontal, LuChevronDown } from "react-icons/lu";

const TOOL_SELECT = "select";
const TOOL_DRAW = "draw";
const TOOL_ERASE = "erase";
const TOOL_RECT = "rect";
const TOOL_ELLIPSE = "ellipse";
const TOOL_LINE = "line";
const TOOL_TEXT = "text";

// Color palettes for light and dark mode
const COLORS_LIGHT = [
  "#000000", "#ffffff", "#e03131", "#1971c2", "#fab005", "#40c057", "#ae3ec9", "#fd7e14"
];
const COLORS_DARK = [
  "#ffffff", "#000000", "#fa5252", "#4dabf7", "#ffe066", "#69db7c", "#b197fc", "#ffa94d"
];

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

const tools = [
  { key: TOOL_SELECT, label: "Select", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l14 7-7 3-3 7-4-17z"/></svg>
  ) },
  { key: TOOL_DRAW, label: "Draw", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15.5V19h3.5l10-10.1-3.5-3.4L4 15.5z"/></svg>
  ) },
  { key: TOOL_ERASE, label: "Eraser", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="14" width="13" height="3" rx="1.5"/><path d="M5 13l7-7a2 2 0 112.8 2.8l-7 7"/></svg>
  ) },
  { key: TOOL_RECT, label: "Rectangle", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="12" height="12" rx="2"/></svg>
  ) },
  { key: TOOL_ELLIPSE, label: "Ellipse", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="10" cy="10" rx="7" ry="5"/></svg>
  ) },
  { key: TOOL_LINE, label: "Line", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="16" x2="16" y2="4"/></svg>
  ) },
  { key: TOOL_TEXT, label: "Text", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><text x="4" y="16" fontSize="12" fontFamily="sans-serif">T</text></svg>
  ) },
];

const undoIcon = <LuUndo2 size={22} />;
const redoIcon = <LuRedo2 size={22} />;

// Top Toolbar
function TopToolbar({ onUndo, onRedo }) {
  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-end bg-white/80 dark:bg-zinc-900/80 border-b border-gray-200 dark:border-zinc-700 px-4 py-2 z-50 backdrop-blur">
      {/* Braindump title, top left */}
      <div className="absolute left-4 top-1 flex items-center select-none">
        <span style={{
          fontFamily: 'Poppins, Inter, Montserrat, sans-serif',
          fontWeight: 700,
          fontSize: '1.35rem',
          letterSpacing: '0.04em',
          color: 'var(--braindump-title-color, #6366f1)', // indigo-500
          textShadow: '0 1px 8px rgba(99,102,241,0.08)'
        }}>
          braindump
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button title="Undo (Ctrl+Z)" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={onUndo}><LuUndo2 size={22} /></button>
        <button title="Redo (Ctrl+Y)" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={onRedo}><LuRedo2 size={22} /></button>
        <button title="Export" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"><LuDownload size={22} /></button>
        <button title="Preferences" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"><LuSettings2 size={22} /></button>
      </div>
    </div>
  );
}

// Bottom Toolbar
function BottomToolbar({ tool, setTool }) {
  const iconSize = 24;
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg px-4 py-2 mb-4 gap-2" style={{ minWidth: 500 }}>
      <button title="Select" className={`p-2 rounded-lg ${tool === 'select' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('select')}><LuMousePointer2 size={iconSize} /></button>
      <button title="Hand" className={`p-2 rounded-lg ${tool === 'hand' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('hand')}><LuHand size={iconSize} /></button>
      <button title="Draw" className={`p-2 rounded-lg ${tool === 'draw' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('draw')}><LuPencil size={iconSize} /></button>
      <button title="Eraser" className={`p-2 rounded-lg ${tool === 'eraser' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('eraser')}><LuEraser size={iconSize} /></button>
      <button title="Sticky Note" className={`p-2 rounded-lg ${tool === 'sticky' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('sticky')}><LuStickyNote size={iconSize} /></button>
      <button title="Image" className={`p-2 rounded-lg ${tool === 'image' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('image')}><LuImage size={iconSize} /></button>
      <button title="Text" className={`p-2 rounded-lg ${tool === 'text' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('text')}><LuType size={iconSize} /></button>
      <button title="Shapes" className={`p-2 rounded-lg ${tool === 'shapes' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('shapes')}><LuShapes size={iconSize} /></button>
    </div>
  );
}

// Right Toolbar
function RightToolbar() {
  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col items-center gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg px-3 py-4">
      {/* Color palette */}
      <div className="flex flex-wrap gap-1 mb-2">
        {["#fff", "#000", "#e03131", "#1971c2", "#fab005", "#40c057", "#ae3ec9", "#fd7e14"].map((c) => (
          <button key={c} className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-zinc-700" style={{ background: c }} />
        ))}
      </div>
      {/* Opacity slider */}
      <div className="flex items-center gap-2 w-24">
        <LuGripHorizontal />
        <input type="range" min="0" max="1" step="0.01" className="w-full" />
      </div>
      {/* Stroke style */}
      <div className="flex gap-1 mt-2">
        <button className="p-1 rounded border border-gray-300 dark:border-zinc-700"><LuChevronDown /></button>
        <button className="p-1 rounded border border-gray-300 dark:border-zinc-700"><LuChevronDown /></button>
        <button className="p-1 rounded border border-gray-300 dark:border-zinc-700"><LuChevronDown /></button>
      </div>
      {/* Size options */}
      <div className="flex gap-1 mt-2">
        <button className="px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 text-xs">S</button>
        <button className="px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 text-xs">M</button>
        <button className="px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 text-xs">L</button>
        <button className="px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 text-xs">XL</button>
      </div>
    </div>
  );
}

function isNearPoint(x, y, pt, threshold = 8) {
  return Math.hypot(x - pt.x, y - pt.y) < threshold;
}

export default function CanvasPage() {
  const [tool, setTool] = useState('draw');
  const [color, setColor] = useState("#222");
  const [lines, setLines] = useState([]); // Each line: { points: [{x, y}], color }
  const [drawing, setDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [eraserPos, setEraserPos] = useState(null); // {x, y} or null
  const canvasRef = useRef(null);
  const isDark = useIsDarkMode();
  const ERASER_RADIUS = 16;

  // Mouse events for drawing and erasing
  const handlePointerDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (tool === 'draw') {
      pushToUndo(lines);
      setLines((prev) => [...prev, { points: [{ x, y }], color }]);
      setDrawing(true);
    } else if (tool === 'eraser') {
      pushToUndo(lines);
      eraseAt(x, y);
      setDrawing(true);
      setEraserPos({ x, y });
    }
  };

  const handlePointerMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (!drawing) return;
    if (tool === 'draw') {
      setLines((prev) => {
        const newLines = [...prev];
        newLines[newLines.length - 1].points.push({ x, y });
        return newLines;
      });
    } else if (tool === 'eraser') {
      eraseAt(x, y);
      setEraserPos({ x, y });
    }
  };

  const handlePointerUp = () => {
    setDrawing(false);
    setEraserPos(null);
  };

  // Erase lines near pointer
  const eraseAt = (x, y) => {
    setLines((prev) => prev.filter(line => !line.points.some(pt => isNearPoint(x, y, pt))));
  };

  // Undo/Redo logic
  const pushToUndo = (currentLines) => {
    setUndoStack((prev) => [...prev, currentLines]);
    setRedoStack([]);
  };

  const handleUndo = useCallback(() => {
    setUndoStack((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo;
      setRedoStack((prevRedo) => [...prevRedo, lines]);
      const prevLines = prevUndo[prevUndo.length - 1];
      setLines(prevLines);
      return prevUndo.slice(0, -1);
    });
  }, [lines]);

  const handleRedo = useCallback(() => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
      setUndoStack((prevUndo) => [...prevUndo, lines]);
      const nextLines = prevRedo[prevRedo.length - 1];
      setLines(nextLines);
      return prevRedo.slice(0, -1);
    });
  }, [lines]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Draw lines on canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    lines.forEach((line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      line.points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    });
  }, [lines]);

  return (
    <div className="h-screen w-screen relative bg-gray-50 dark:bg-dark">
      <TopToolbar onUndo={handleUndo} onRedo={handleRedo} />
      <RightToolbar />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="block absolute top-0 left-0 w-full h-full"
        style={{
          cursor: tool === 'draw' ? 'crosshair' : tool === 'eraser' ? 'pointer' : 'default',
          background: 'transparent',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      {/* Eraser hover animation */}
      {tool === 'eraser' && drawing && eraserPos && (
        <div
          style={{
            position: 'fixed',
            left: eraserPos.x + canvasRef.current?.getBoundingClientRect().left - ERASER_RADIUS,
            top: eraserPos.y + canvasRef.current?.getBoundingClientRect().top - ERASER_RADIUS,
            width: ERASER_RADIUS * 2,
            height: ERASER_RADIUS * 2,
            pointerEvents: 'none',
            borderRadius: '50%',
            border: '2px solid #f87171', // red-400
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            boxShadow: '0 0 8px 2px rgba(248,113,113,0.2)',
            zIndex: 1000,
          }}
        />
      )}
      <BottomToolbar tool={tool} setTool={setTool} />
    </div>
  );
}
  