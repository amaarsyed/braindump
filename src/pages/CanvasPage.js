import React, { useRef, useState, useEffect, useCallback } from "react";
import { LuUndo2, LuRedo2 } from "react-icons/lu";

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

function Toolbar({ tool, setTool, color, setColor, isDark, onUndo, onRedo }) {
  const palette = isDark ? COLORS_DARK : COLORS_LIGHT;
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg px-4 py-2 mb-4 gap-2" style={{ minWidth: 400 }}>
      {/* Color Picker */}
      <div className="flex items-center gap-1 mr-4">
        {palette.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-5 h-5 rounded-full border-2 ${color === c ? 'border-blue-500' : 'border-gray-300 dark:border-zinc-700'} flex items-center justify-center`}
            style={{ background: c }}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>
      {/* Tool Buttons */}
      {tools.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => setTool(key)}
          title={label}
          className={`p-2 rounded-lg transition-colors ${tool === key ? "bg-gray-200 dark:bg-zinc-700" : "hover:bg-gray-100 dark:hover:bg-zinc-800"}`}
        >
          {icon}
        </button>
      ))}
      {/* Undo/Redo */}
      <button
        onClick={onUndo}
        title="Undo (Ctrl+Z)"
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 ml-4"
      >
        {undoIcon}
      </button>
      <button
        onClick={onRedo}
        title="Redo (Ctrl+Y)"
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
      >
        {redoIcon}
      </button>
    </div>
  );
}

function isNearPoint(x, y, pt, threshold = 8) {
  return Math.hypot(x - pt.x, y - pt.y) < threshold;
}

export default function CanvasPage() {
  const [tool, setTool] = useState(TOOL_DRAW);
  const [color, setColor] = useState("#222");
  const [lines, setLines] = useState([]); // Each line: { points: [{x, y}], color }
  const [drawing, setDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const canvasRef = useRef(null);
  const isDark = useIsDarkMode();

  // Mouse events for drawing and erasing
  const handlePointerDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (tool === TOOL_DRAW) {
      pushToUndo(lines);
      setLines((prev) => [...prev, { points: [{ x, y }], color }]);
      setDrawing(true);
    } else if (tool === TOOL_ERASE) {
      pushToUndo(lines);
      eraseAt(x, y);
      setDrawing(true);
    }
  };

  const handlePointerMove = (e) => {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (tool === TOOL_DRAW) {
      setLines((prev) => {
        const newLines = [...prev];
        newLines[newLines.length - 1].points.push({ x, y });
        return newLines;
      });
    } else if (tool === TOOL_ERASE) {
      eraseAt(x, y);
    }
  };

  const handlePointerUp = () => {
    setDrawing(false);
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
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="block absolute top-0 left-0 w-full h-full"
        style={{
          cursor: tool === TOOL_DRAW ? "crosshair" : tool === TOOL_ERASE ? "pointer" : "default",
          background: "transparent"
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <Toolbar tool={tool} setTool={setTool} color={color} setColor={setColor} isDark={isDark} onUndo={handleUndo} onRedo={handleRedo} />
    </div>
  );
}
  