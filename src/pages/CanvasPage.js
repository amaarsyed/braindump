import React, { useRef, useState, useEffect, useCallback } from "react";
import { LuUndo2, LuRedo2, LuSettings2, LuDownload, LuStickyNote, LuImage, LuSquare, LuCircle, LuTriangle, LuArrowUpRight, LuEraser, LuHand, LuMousePointer2, LuPencil, LuType, LuShapes, LuPalette, LuGripHorizontal, LuChevronDown, LuSun, LuMoon, LuBrain } from "react-icons/lu";
import { motion } from 'framer-motion';

const TOOL_SELECT = "select";
const TOOL_DRAW = "draw";
const TOOL_ERASE = "erase";
const TOOL_RECT = "rect";
const TOOL_ELLIPSE = "ellipse";
const TOOL_LINE = "line";
const TOOL_TEXT = "text";


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

// Custom DarkModeToggle for top right
function DarkModeToggleTop() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="p-2 ml-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <LuSun size={22} color="#fff" /> : <LuMoon size={22} color="#222" />}
    </button>
  );
}

function TopControlsBox({ onUndo, onRedo }) {
  // Detect dark mode for icon color
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const iconColor = isDark ? "#fff" : "#222";
  // Toggle dark mode
  const toggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    setIsDark(!isDark);
  };
  return (
    <div className="fixed top-4 right-6 z-50 flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg px-3 py-2">
      <button title="Undo (Ctrl+Z)" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={onUndo}><LuUndo2 size={22} color={iconColor} /></button>
      <button title="Redo (Ctrl+Y)" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={onRedo}><LuRedo2 size={22} color={iconColor} /></button>
      <button title="Export" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"><LuDownload size={22} color={iconColor} /></button>
      <button title="Preferences" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"><LuSettings2 size={22} color={iconColor} /></button>
      <button title={isDark ? "Switch to light mode" : "Switch to dark mode"} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={toggleDark}>
        {isDark ? <LuSun size={22} color="#fff" /> : <LuMoon size={22} color="#222" />}
      </button>
    </div>
  );
}

function LogoStandalone() {
  // Use LuBrain icon for a literal brain representation
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const iconColor = isDark ? "#fff" : "#222";
  return (
    <div className="fixed top-4 left-6 z-50 flex items-center select-none" style={{height: '3.5rem', padding: '0.25rem 0.5rem'}}>
      <LuBrain size={48} color={iconColor} style={{marginRight: 16, flexShrink: 0}} />
      <span style={{ fontFamily: 'Montserrat, Inter, sans-serif', fontWeight: 600, fontSize: '2.1rem', letterSpacing: '0.01em', lineHeight: 1, color: iconColor }}>braindump</span>
    </div>
  );
}

// Bottom Toolbar
function BottomToolbar({ tool, setTool }) {
  const iconSize = 24;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg px-4 py-2 gap-2" style={{ minWidth: 400 }}>
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

function Draggable({ x, y, children, onDrag, style, ...props }) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef();

  const handlePointerDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - x,
      y: e.clientY - y,
    });
    e.stopPropagation();
  };
  const handlePointerMove = (e) => {
    if (!dragging) return;
    onDrag({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const handlePointerUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }
  });

  return (
    <div
      ref={ref}
      style={{ position: "absolute", left: x, top: y, cursor: dragging ? "grabbing" : "grab", ...style }}
      onPointerDown={handlePointerDown}
      {...props}
    >
      {children}
    </div>
  );
}

// AddImageModal component
function AddImageModal({ open, onClose, onAdd, position, isDark }) {
  const [tab, setTab] = useState('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [gifs, setGifs] = useState([]);
  const [gifQuery, setGifQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'gif' && gifQuery) {
      setLoading(true);
      fetch(`https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${encodeURIComponent(gifQuery)}&limit=12`)
        .then(res => res.json())
        .then(data => {
          setGifs(data.data);
          setLoading(false);
        });
    }
  }, [tab, gifQuery]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60">
      <div className={`bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 w-[370px] max-w-full relative border border-gray-200 dark:border-zinc-700`}>
        <button onClick={onClose} className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&times;</button>
        <div className="mb-4 flex gap-2">
          <button onClick={() => setTab('url')} className={`px-4 py-1.5 rounded-t-lg border ${tab==='url' ? 'bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 font-semibold' : 'bg-transparent border-transparent'}`}>URL</button>
          <button onClick={() => setTab('upload')} className={`px-4 py-1.5 rounded-t-lg border ${tab==='upload' ? 'bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 font-semibold' : 'bg-transparent border-transparent'}`}>Upload</button>
          <button onClick={() => setTab('gif')} className={`px-4 py-1.5 rounded-t-lg border ${tab==='gif' ? 'bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 font-semibold' : 'bg-transparent border-transparent'}`}>GIF</button>
        </div>
        {tab === 'url' && (
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-200">Image URL</label>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 mb-4" />
            <button className="w-full py-2 rounded bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-60" disabled={!url} onClick={() => { onAdd({ type: 'url', src: url, position }); onClose(); }}>Add Image</button>
          </div>
        )}
        {tab === 'upload' && (
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-200">Upload Image</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="mb-4" />
            <button className="w-full py-2 rounded bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-60" disabled={!file} onClick={() => {
              const reader = new FileReader();
              reader.onload = (ev) => { onAdd({ type: 'upload', src: ev.target.result, position }); onClose(); };
              reader.readAsDataURL(file);
            }}>Add Image</button>
          </div>
        )}
        {tab === 'gif' && (
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-200">Search GIFs</label>
            <input type="text" value={gifQuery} onChange={e => setGifQuery(e.target.value)} placeholder="funny cat" className="w-full px-3 py-2 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 mb-2" />
            <div className="h-32 overflow-y-auto grid grid-cols-3 gap-2 mb-2">
              {loading ? <div className="col-span-3 text-center text-gray-400">Loading...</div> :
                gifs.map(gif => (
                  <img key={gif.id} src={gif.images.fixed_width_small.url} alt={gif.title} className="rounded cursor-pointer hover:scale-105 transition" onClick={() => { onAdd({ type: 'gif', src: gif.images.original.url, position }); onClose(); }} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Comic Sans', value: 'Comic Sans MS, Comic Sans, cursive' },
  { label: 'Serif', value: 'serif' },
  { label: 'Mono', value: 'monospace' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
];

function StickyNote({
  id, x, y, width, height, rotation, color, font, text, isEditing, onChange, onEdit, onDelete, onDrag, onResize, onRotate, colorPalette, onColorChange, onFontChange
}) {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [local, setLocal] = useState({ x, y, width, height, rotation });
  const noteRef = useRef();

  // Drag logic
  function handleDrag(e, info) {
    setLocal(l => ({ ...l, x: info.point.x, y: info.point.y }));
    if (onDrag) onDrag({ x: info.point.x, y: info.point.y });
  }

  // Resize logic
  function handleResize(e) {
    e.stopPropagation();
    setResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = local.width;
    const startH = local.height;
    function onMove(ev) {
      const newW = Math.max(80, startW + (ev.clientX - startX));
      const newH = Math.max(40, startH + (ev.clientY - startY));
      setLocal(l => ({ ...l, width: newW, height: newH }));
      if (onResize) onResize({ width: newW, height: newH });
    }
    function onUp() {
      setResizing(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  // Rotate logic
  function handleRotate(e) {
    e.stopPropagation();
    setRotating(true);
    const rect = noteRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    function onMove(ev) {
      const dx = ev.clientX - centerX;
      const dy = ev.clientY - centerY;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      setLocal(l => ({ ...l, rotation: angle }));
      if (onRotate) onRotate({ rotation: angle });
    }
    function onUp() {
      setRotating(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  // Font and color change
  function handleFontChange(e) {
    if (onFontChange) onFontChange(e.target.value);
  }
  function handleColorChange(c) {
    if (onColorChange) onColorChange(c);
  }

  return (
    <motion.div
      ref={noteRef}
      className="absolute shadow-lg rounded-lg"
      style={{
        left: local.x,
        top: local.y,
        width: local.width,
        height: local.height,
        background: color,
        fontFamily: font,
        transform: `rotate(${local.rotation || 0}deg)`,
        transition: dragging || resizing || rotating ? 'none' : 'box-shadow 0.2s, transform 0.2s',
        zIndex: dragging ? 100 : 10,
        boxShadow: dragging ? '0 8px 32px 0 rgba(0,0,0,0.18)' : '0 2px 8px 0 rgba(0,0,0,0.10)',
        userSelect: isEditing ? 'text' : 'none',
      }}
      drag
      dragMomentum={false}
      dragElastic={0.18}
      onDragStart={() => setDragging(true)}
      onDragEnd={(e, info) => { setDragging(false); if (onDrag) onDrag({ x: info.point.x, y: info.point.y }); }}
      onDrag={handleDrag}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-white/60 dark:bg-zinc-900/60 rounded-t-lg" style={{ cursor: 'move', borderBottom: '1px solid #eee' }}>
        <select value={font} onChange={handleFontChange} className="text-xs rounded px-1 py-0.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700">
          {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <div className="flex gap-0.5 ml-2">
          {colorPalette.map(c => (
            <button key={c} className="w-4 h-4 rounded-full border-2 border-white dark:border-zinc-700" style={{ background: c }} onClick={() => handleColorChange(c)} />
          ))}
        </div>
        <button onClick={onEdit} className="ml-auto text-xs px-1 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800">✏️</button>
        <button onClick={onDelete} className="text-xs px-1 py-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900">🗑️</button>
        <button onPointerDown={handleRotate} className="text-xs px-1 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-alias">⟳</button>
      </div>
      {/* Content */}
      {isEditing ? (
        <textarea
          autoFocus
          value={text}
          onChange={e => onChange && onChange(e.target.value)}
          onBlur={onEdit}
          className="w-full h-full bg-transparent resize-none outline-none p-2 text-base rounded-b-lg"
          style={{ fontFamily: font, background: 'transparent' }}
        />
      ) : (
        <div
          className="w-full h-full p-2 text-base rounded-b-lg cursor-pointer"
          style={{ fontFamily: font, background: 'transparent', minHeight: 40, minWidth: 80 }}
          onDoubleClick={onEdit}
        >
          {text}
        </div>
      )}
      {/* Resize handle */}
      <div
        onPointerDown={handleResize}
        className="absolute right-1.5 bottom-1.5 w-3 h-3 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded cursor-se-resize"
        style={{ zIndex: 20 }}
      />
    </motion.div>
  );
}

export default function CanvasPage() {
  // Unified state for all elements
  const [elements, setElements] = useState({
    lines: [],
    stickyNotes: [],
    images: [],
    textBoxes: [],
  });
  const [drawing, setDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [eraserPos, setEraserPos] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);
  const [editingStickyId, setEditingStickyId] = useState(null);
  const [tool, setTool] = useState('draw');
  const [color, setColor] = useState("#222");
  const canvasRef = useRef(null);
  const isDark = useIsDarkMode();
  const ERASER_RADIUS = 16;
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [pendingImagePos, setPendingImagePos] = useState(null);

  // Helper: push to undo stack
  const pushToUndo = (current) => {
    setUndoStack((prev) => [...prev, current]);
    setRedoStack([]);
  };

  // Erase logic for all elements
  function eraseAt(x, y) {
    setElements((prev) => {
      // Erase lines
      const lines = prev.lines.filter(line => !line.points.some(pt => isNearPoint(x, y, pt)));
      // Erase sticky notes
      const stickyNotes = prev.stickyNotes.filter(note => !isInBox(x, y, note.x, note.y, 120, 80));
      // Erase images
      const images = prev.images.filter(img => !isInBox(x, y, img.x, img.y, img.width, img.height));
      // Erase text boxes
      const textBoxes = prev.textBoxes.filter(tb => !isInBox(x, y, tb.x, tb.y, 120, 40));
      return { lines, stickyNotes, images, textBoxes };
    });
  }
  function isInBox(x, y, bx, by, bw, bh) {
    return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
  }

  // Mouse events for drawing and erasing
  const handlePointerDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (tool === 'draw') {
      pushToUndo(elements);
      setElements((prev) => ({
        ...prev,
        lines: [...prev.lines, { points: [{ x, y }], color }],
      }));
      setDrawing(true);
    } else if (tool === 'eraser') {
      pushToUndo(elements);
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
      setElements((prev) => {
        const newLines = [...prev.lines];
        newLines[newLines.length - 1].points.push({ x, y });
        return { ...prev, lines: newLines };
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

  // Add sticky note, image, or text box
  const handleCanvasPointerDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (tool === 'sticky') {
      pushToUndo(elements);
      setElements((prev) => ({
        ...prev,
        stickyNotes: [
          ...prev.stickyNotes,
          { id: Date.now(), x, y, text: "Sticky note" }
        ]
      }));
    } else if (tool === 'text') {
      pushToUndo(elements);
      setElements((prev) => ({
        ...prev,
        textBoxes: [
          ...prev.textBoxes,
          { id: Date.now(), x, y, text: "Text" }
        ]
      }));
    } else {
      handlePointerDown(e);
    }
  };

  // Add handler for adding image from modal
  function handleAddImage({ type, src, position }) {
    pushToUndo(elements);
    setElements((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { id: Date.now(), x: position.x, y: position.y, src, width: 120, height: 90 }
      ]
    }));
  }

  // Undo/Redo logic
  const handleUndo = useCallback(() => {
    setUndoStack((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo;
      setRedoStack((prevRedo) => [...prevRedo, elements]);
      const prevElements = prevUndo[prevUndo.length - 1];
      setElements(prevElements);
      return prevUndo.slice(0, -1);
    });
  }, [elements]);

  const handleRedo = useCallback(() => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
      setUndoStack((prevUndo) => [...prevUndo, elements]);
      const nextElements = prevRedo[prevRedo.length - 1];
      setElements(nextElements);
      return prevRedo.slice(0, -1);
    });
  }, [elements]);

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
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    elements.lines.forEach((line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      line.points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    });
  }, [elements.lines]);

  // Replace setTool usage to intercept 'image' tool selection
  function handleToolbarToolSelect(selectedTool) {
    setTool(selectedTool);
    if (selectedTool === 'image') {
      // Center of viewport
      const x = window.innerWidth / 2 - 60;
      const y = window.innerHeight / 2 - 45;
      setPendingImagePos({ x, y });
      setShowAddImageModal(true);
    }
  }

  return (
    <div className="h-screen w-screen relative bg-gray-50 dark:bg-dark">
      <LogoStandalone />
      <TopControlsBox onUndo={handleUndo} onRedo={handleRedo} />
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
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      {/* Sticky Notes */}
      {elements.stickyNotes.map((note) => (
        <StickyNote
          key={note.id}
          id={note.id}
          x={note.x}
          y={note.y}
          width={120}
          height={80}
          rotation={0}
          color={note.color || "#fff"}
          font={note.font || "Inter, sans-serif"}
          text={note.text}
          isEditing={editingStickyId === note.id}
          onChange={(newText) => {
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              stickyNotes: prev.stickyNotes.map(n => n.id === note.id ? { ...n, text: newText } : n)
            }));
          }}
          onEdit={() => setEditingStickyId(note.id)}
          onDelete={() => {
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              stickyNotes: prev.stickyNotes.filter(n => n.id !== note.id)
            }));
          }}
          onDrag={(pos) => {
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              stickyNotes: prev.stickyNotes.map(n => n.id === note.id ? { ...n, ...pos } : n)
            }));
          }}
          onResize={(size) => {
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              stickyNotes: prev.stickyNotes.map(n => n.id === note.id ? { ...n, ...size } : n)
            }));
          }}
          onRotate={(rotation) => {
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              stickyNotes: prev.stickyNotes.map(n => n.id === note.id ? { ...n, rotation } : n)
            }));
          }}
          colorPalette={COLORS_LIGHT}
          onColorChange={(newColor) => {
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              stickyNotes: prev.stickyNotes.map(n => n.id === note.id ? { ...n, color: newColor } : n)
            }));
          }}
          onFontChange={(newFont) => {
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              stickyNotes: prev.stickyNotes.map(n => n.id === note.id ? { ...n, font: newFont } : n)
            }));
          }}
        />
      ))}
      {/* Images */}
      {elements.images.map((img) => (
        <Draggable
          key={img.id}
          x={img.x}
          y={img.y}
          onDrag={(pos) => {
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              images: prev.images.map(i => i.id === img.id ? { ...i, ...pos } : i)
            }));
          }}
        >
          <img src={img.src} alt="uploaded" style={{ width: img.width, height: img.height, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
        </Draggable>
      ))}
      {/* Text Boxes */}
      {elements.textBoxes.map((tb) => (
        <Draggable
          key={tb.id}
          x={tb.x}
          y={tb.y}
          onDrag={(pos) => {
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              textBoxes: prev.textBoxes.map(t => t.id === tb.id ? { ...t, ...pos } : t)
            }));
          }}
        >
          {editingTextId === tb.id ? (
            <input
              autoFocus
              value={tb.text}
              onChange={e => setElements((prev) => ({
                ...prev,
                textBoxes: prev.textBoxes.map(t => t.id === tb.id ? { ...t, text: e.target.value } : t)
              }))}
              onBlur={() => setEditingTextId(null)}
              className="rounded bg-white/80 dark:bg-zinc-900/80 px-2 py-1 text-base shadow border border-gray-200 dark:border-zinc-700"
              style={{ fontFamily: 'inherit', fontWeight: 500, minWidth: 60 }}
            />
          ) : (
            <div
              className="rounded bg-white/80 dark:bg-zinc-900/80 px-2 py-1 text-base shadow border border-gray-200 dark:border-zinc-700 cursor-pointer"
              style={{ fontFamily: 'inherit', fontWeight: 500, minWidth: 60 }}
              onDoubleClick={() => setEditingTextId(tb.id)}
            >
              {tb.text}
            </div>
          )}
        </Draggable>
      ))}
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
      <BottomToolbar tool={tool} setTool={handleToolbarToolSelect} />
      <AddImageModal open={showAddImageModal} onClose={() => setShowAddImageModal(false)} onAdd={handleAddImage} position={pendingImagePos} isDark={isDark} />
    </div>
  );
}
  