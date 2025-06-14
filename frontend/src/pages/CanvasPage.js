import React, { useRef, useState, useEffect, useCallback } from "react";
import { LuUndo2, LuRedo2, LuSettings2, LuDownload, LuStickyNote, LuImage, LuSquare, LuCircle, LuTriangle, LuArrowUpRight, LuEraser, LuHand, LuMousePointer2, LuPencil, LuType, LuShapes, LuPalette, LuGripHorizontal, LuChevronDown, LuSun, LuMoon, LuBrain, LuShare2, LuFileText, LuImage as LuImageIcon } from "react-icons/lu";
import io from "socket.io-client";

const TOOL_SELECT = "select";
const TOOL_DRAW = "draw";
const TOOL_ERASE = "erase";
const TOOL_RECT = "rect";
const TOOL_ELLIPSE = "ellipse";
const TOOL_LINE = "line";
const TOOL_TEXT = "text";

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Comic Sans', value: 'Comic Sans MS, Comic Sans, cursive' },
  { label: 'Serif', value: 'serif' },
  { label: 'Mono', value: 'monospace' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
];

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

// Download Modal Component
function DownloadModal({ open, onClose, onDownload, isDark }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60">
      <div className={`bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 w-[370px] max-w-full relative border border-gray-200 dark:border-zinc-700`}>
        <button onClick={onClose} className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&times;</button>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Download Options</h2>
        <div className="space-y-4">
          <button
            onClick={() => onDownload('pdf')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <LuFileText size={24} className="text-blue-500" />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-gray-100">Download as PDF</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">High quality vector format</div>
            </div>
          </button>
          <button
            onClick={() => onDownload('jpg')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <LuImageIcon size={24} className="text-green-500" />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-gray-100">Download as JPG</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Image format</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function TopControlsBox({ onUndo, onRedo, boardId, onDownload }) {
  // Detect dark mode for icon color
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const iconColor = isDark ? "#fff" : "#222";
  // Toggle dark mode
  const handleDropdownToggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    setIsDark(!isDark);
    setDropdownOpen(false);
  };
  // Share logic
  const url = `${window.location.origin}${window.location.pathname}#${boardId}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="fixed top-4 right-6 z-50 flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg px-3 py-2">
      <button title="Undo (Ctrl+Z)" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={onUndo}><LuUndo2 size={22} color={iconColor} /></button>
      <button title="Redo (Ctrl+Y)" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={onRedo}><LuRedo2 size={22} color={iconColor} /></button>
      <button title="Export" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={() => setShowDownloadModal(true)}><LuDownload size={22} color={iconColor} /></button>
      {/* Preferences with dropdown */}
      <div className="relative z-[9999]">
        <button
          title="Preferences"
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
          onClick={() => setDropdownOpen((v) => !v)}
        >
          <LuSettings2 size={22} color={iconColor} />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg py-2 z-[9999] text-sm bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm pointer-events-auto">
            <div className="flex items-center justify-between px-4 py-2 gap-3">
              <div className="flex items-center gap-2">
                <LuMoon size={18} className="text-zinc-500 dark:text-zinc-200" />
                <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <button
                aria-label="Toggle dark mode"
                onClick={handleDropdownToggleDark}
                className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${isDark ? 'bg-teal-500' : 'bg-zinc-300'}`}
                style={{ minWidth: 40 }}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${isDark ? 'translate-x-4' : ''}`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Share icon button */}
      <div className="relative">
        <button
          title="Copy board link"
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
          onClick={handleCopy}
        >
          <LuShare2 size={22} color={iconColor} />
        </button>
        {copied && (
          <div className="absolute right-0 mt-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded shadow">Link copied!</div>
        )}
      </div>
      <DownloadModal 
        open={showDownloadModal} 
        onClose={() => setShowDownloadModal(false)} 
        onDownload={onDownload}
        isDark={isDark}
      />
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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg px-3 py-2 gap-1" style={{ minWidth: 320 }}>
      <button title="Select" className={`p-2 rounded-lg ${tool === 'select' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('select')}><LuMousePointer2 size={iconSize} /></button>
      <button title="Hand" className={`p-2 rounded-lg ${tool === 'hand' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('hand')}><LuHand size={iconSize} /></button>
      <button title="Draw" className={`p-2 rounded-lg ${tool === 'draw' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('draw')}><LuPencil size={iconSize} /></button>
      <button title="Eraser" className={`p-2 rounded-lg ${tool === 'eraser' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('eraser')}><LuEraser size={iconSize} /></button>
      <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1"></div>
      <button title="Sticky Note" className={`p-2 rounded-lg ${tool === 'sticky' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('sticky')}><LuStickyNote size={iconSize} /></button>
      <button title="Image" className={`p-2 rounded-lg ${tool === 'image' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('image')}><LuImage size={iconSize} /></button>
      <button title="Text" className={`p-2 rounded-lg ${tool === 'text' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('text')}><LuType size={iconSize} /></button>
      <button title="Shapes" className={`p-2 rounded-lg ${tool === 'shapes' ? 'bg-gray-200 dark:bg-zinc-700' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`} onClick={() => setTool('shapes')}><LuShapes size={iconSize} /></button>
    </div>
  );
}

// Right Toolbar
function RightToolbar({ tool, eraserSize, setEraserSize, color, setColor, opacity, setOpacity, penThickness, setPenThickness, selectedStickyId, selectedTextId, stickyFont, textFont, onStickyColorChange, onStickyFontChange, onTextColorChange, onTextFontChange, elements, hidePenControls }) {
  const COLORS = ["#fff", "#000", "#e03131", "#1971c2", "#fab005", "#40c057", "#ae3ec9", "#fd7e14"];
  
  // Determine if color palette should be enabled
  const isColorEnabled = tool === 'draw' || selectedStickyId || selectedTextId;
  
  // Get the current color based on selection
  const getCurrentColor = () => {
    if (tool === 'draw') return color;
    if (selectedStickyId) {
      const note = elements.stickyNotes.find(n => n.id === selectedStickyId);
      return note?.color || "#fff";
    }
    if (selectedTextId) {
      const text = elements.textBoxes.find(t => t.id === selectedTextId);
      return text?.color || "#222";
    }
    return color;
  };

  // Handle color change based on current selection
  const handleColorChange = (newColor) => {
    if (tool === 'draw') {
      setColor(newColor);
    } else if (selectedStickyId) {
      onStickyColorChange(newColor);
    } else if (selectedTextId) {
      onTextColorChange(newColor);
    }
  };

  return (
    <div className="fixed top-20 right-6 z-40 flex flex-col items-center gap-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg px-4 py-5 min-w-[180px]">
      {/* Unified color palette */}
      <div className="w-full">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
          {tool === 'draw' ? 'Pen Color' : selectedStickyId ? 'Sticky Color' : selectedTextId ? 'Text Color' : 'Color'}
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-100 ${isColorEnabled && getCurrentColor() === c ? 'border-zinc-900 dark:border-white scale-110 shadow' : 'border-gray-300 dark:border-zinc-700'} ${!isColorEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ background: c }}
              onClick={() => isColorEnabled && handleColorChange(c)}
              aria-label={`Select color ${c}`}
              disabled={!isColorEnabled}
            >
              {isColorEnabled && getCurrentColor() === c && <span className="w-2 h-2 rounded-full bg-white border border-zinc-900 dark:border-white" />}
            </button>
          ))}
        </div>
      </div>
      {/* Pen thickness slider - only show when draw tool is selected */}
      {tool === 'draw' && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Pen Thickness</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{penThickness}px</span>
          </div>
          <div className="flex items-center gap-2">
            <LuGripHorizontal />
            <input
              type="range"
              min="1"
              max="20"
              value={penThickness}
              onChange={e => setPenThickness(Number(e.target.value))}
              className="w-full accent-blue-500"
              aria-label="Pen thickness"
            />
          </div>
        </div>
      )}
      {/* Opacity slider */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Opacity</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(opacity * 100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <LuGripHorizontal />
          <input type="range" min="0.1" max="1" step="0.01" value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-full accent-blue-500" aria-label="Pen opacity" />
        </div>
      </div>
      {/* Font dropdown for sticky notes */}
      {selectedStickyId && (
        <div className="w-full">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Sticky Font</div>
          <select
            className="w-full px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm disabled:opacity-50"
            value={stickyFont || ''}
            onChange={e => onStickyFontChange(e.target.value)}
          >
            <option value="" disabled>Select font</option>
            {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
      )}
      {/* Font dropdown for text boxes */}
      {selectedTextId && (
        <div className="w-full">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Text Font</div>
          <select
            className="w-full px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm disabled:opacity-50"
            value={textFont || ''}
            onChange={e => onTextFontChange(e.target.value)}
          >
            <option value="" disabled>Select font</option>
            {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
      )}
      {/* Eraser size control - only show when eraser tool is selected */}
      {tool === 'eraser' && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Eraser Size</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{eraserSize}px</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={eraserSize}
            onChange={(e) => setEraserSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}
      {!hidePenControls && tool === 'draw' && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Pen Thickness</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{penThickness}px</span>
          </div>
          <div className="flex items-center gap-2">
            <LuGripHorizontal />
            <input
              type="range"
              min="1"
              max="20"
              value={penThickness}
              onChange={e => setPenThickness(Number(e.target.value))}
              className="w-full accent-blue-500"
              aria-label="Pen thickness"
            />
          </div>
        </div>
      )}
      {!hidePenControls && tool === 'draw' && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Opacity</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(opacity * 100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <LuGripHorizontal />
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={opacity}
              onChange={e => setOpacity(Number(e.target.value))}
              className="w-full accent-blue-500"
              aria-label="Pen opacity"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function isInBox(x, y, bx, by, bw, bh) {
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

function Draggable({ x, y, children, onDrag, style, ...props }) {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x, y });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setDragging(true);
  };

  const handlePointerMove = (e) => {
    if (dragging) {
      const newX = e.clientX;
      const newY = e.clientY;
      setPosition({ x: newX, y: newY });
      onDrag && onDrag({ x: newX, y: newY });
    }
  };

  const handlePointerUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: dragging ? 'grabbing' : 'grab',
        transition: dragging ? 'none' : 'all 0.15s ease-out',
        ...style
      }}
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

function StickyNote({
  id, x, y, width, height, rotation, color, font, text, isEditing, isSelected, onClick, onChange, onEdit, onDelete, onDrag, onResize, editingRef, onSelectionChange
}) {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(null); // null or one of 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, noteX: 0, noteY: 0 });
  const noteRef = useRef();
  const contentRef = useRef();
  const [selection, setSelection] = useState(null);

  // Drag logic
  function handleToolbarPointerDown(e) {
    if (isEditing) return;
    setDragging(true);
    const rect = noteRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    window.addEventListener('pointermove', handleToolbarPointerMove);
    window.addEventListener('pointerup', handleToolbarPointerUp);
    noteRef.current.setPointerCapture(e.pointerId);
  }
  function handleToolbarPointerMove(e) {
    if (!dragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    if (noteRef.current) {
      noteRef.current.style.left = newX + 'px';
      noteRef.current.style.top = newY + 'px';
    }
  }
  function handleToolbarPointerUp(e) {
    if (!dragging) return;
    setDragging(false);
    window.removeEventListener('pointermove', handleToolbarPointerMove);
    window.removeEventListener('pointerup', handleToolbarPointerUp);
    noteRef.current.releasePointerCapture(e.pointerId);
    // Commit final position to state
    const rect = noteRef.current.getBoundingClientRect();
    if (onDrag) onDrag({ x: rect.left, y: rect.top });
  }

  // Resize logic
  function handleResizePointerDown(corner) {
    return (e) => {
      e.stopPropagation();
      setResizing(corner);
      setResizeStart({ x: e.clientX, y: e.clientY, width, height, noteX: x, noteY: y });
      window.addEventListener('pointermove', handleResizePointerMove);
      window.addEventListener('pointerup', handleResizePointerUp);
      noteRef.current.setPointerCapture(e.pointerId);
    };
  }
  function handleResizePointerMove(e) {
    if (!resizing) return;
    const { x: startX, y: startY, width: startW, height: startH, noteX: startNoteX, noteY: startNoteY } = resizeStart;
    let newX = x, newY = y, newW = width, newH = height;
    const minW = 80, minH = 40;
    if (resizing === 'bottom-right') {
      newW = Math.max(minW, startW + (e.clientX - startX));
      newH = Math.max(minH, startH + (e.clientY - startY));
    } else if (resizing === 'bottom-left') {
      newW = Math.max(minW, startW - (e.clientX - startX));
      newH = Math.max(minH, startH + (e.clientY - startY));
      newX = startNoteX + (e.clientX - startX);
    } else if (resizing === 'top-right') {
      newW = Math.max(minW, startW + (e.clientX - startX));
      newH = Math.max(minH, startH - (e.clientY - startY));
      newY = startNoteY + (e.clientY - startY);
    } else if (resizing === 'top-left') {
      newW = Math.max(minW, startW - (e.clientX - startX));
      newH = Math.max(minH, startH - (e.clientY - startY));
      newX = startNoteX + (e.clientX - startX);
      newY = startNoteY + (e.clientY - startY);
    }
    if (noteRef.current) {
      noteRef.current.style.left = newX + 'px';
      noteRef.current.style.top = newY + 'px';
      noteRef.current.style.width = newW + 'px';
      noteRef.current.style.height = newH + 'px';
    }
  }
  function handleResizePointerUp(e) {
    if (!resizing) return;
    setResizing(null);
    window.removeEventListener('pointermove', handleResizePointerMove);
    window.removeEventListener('pointerup', handleResizePointerUp);
    noteRef.current.releasePointerCapture(e.pointerId);
    // Commit final size/position to state
    const rect = noteRef.current.getBoundingClientRect();
    if (onResize) onResize({
      x: rect.left,
      y: rect.top,
      width: noteRef.current.offsetWidth,
      height: noteRef.current.offsetHeight
    });
  }

  // Keep the note in sync with state when not dragging/resizing
  useEffect(() => {
    if (!dragging && !resizing && noteRef.current) {
      noteRef.current.style.left = x + 'px';
      noteRef.current.style.top = y + 'px';
      noteRef.current.style.width = width + 'px';
      noteRef.current.style.height = height + 'px';
    }
  }, [x, y, width, height, dragging, resizing]);

  function handleSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && contentRef.current && contentRef.current.contains(sel.anchorNode)) {
      setSelection(sel.getRangeAt(0));
      if (onSelectionChange) onSelectionChange(sel.getRangeAt(0));
    } else {
      setSelection(null);
      if (onSelectionChange) onSelectionChange(null);
    }
  }

  // In StickyNote, add keydown handler to contentEditable for Ctrl+A
  function handleContentKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      // Prevent selecting the whole sticky note when editing text
      e.stopPropagation();
      // Let browser select all text in the contentEditable
    }
  }

  return (
    <div
      ref={noteRef}
      className={`absolute shadow-lg rounded-lg ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      style={{
        left: x,
        top: y,
        width,
        height,
        background: color,
        fontFamily: font,
        transform: `rotate(${rotation || 0}deg)`,
        transition: dragging || resizing ? 'none' : 'box-shadow 0.2s, transform 0.2s',
        zIndex: dragging || resizing ? 100 : 10,
        boxShadow: dragging || resizing ? '0 8px 32px 0 rgba(0,0,0,0.18)' : '0 2px 8px 0 rgba(0,0,0,0.10)',
        userSelect: isEditing ? 'text' : 'none',
        cursor: isEditing ? 'text' : dragging ? 'grabbing' : resizing ? 'nwse-resize' : 'grab',
      }}
      onClick={onClick}
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-2 py-1 bg-white/60 dark:bg-zinc-900/60 rounded-t-lg"
        style={{ cursor: 'move', borderBottom: '1px solid #eee' }}
        onPointerDown={handleToolbarPointerDown}
      >
        <button onClick={onEdit} className="ml-auto text-xs px-1 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800">✏️</button>
        {isSelected && !isEditing && (
          <button onClick={e => { e.stopPropagation(); onDelete(); }} type="button" className="text-xs px-1 py-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900">🗑️</button>
        )}
      </div>
      {/* Content */}
      {isEditing ? (
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          className="w-full h-full bg-transparent resize-none outline-none p-2 text-base rounded-b-lg"
          style={{ fontFamily: font, background: 'transparent', minHeight: 40, minWidth: 80 }}
          onBlur={onEdit}
          onInput={e => onChange && onChange(e.currentTarget.innerHTML)}
          onSelect={handleSelection}
          onKeyUp={handleSelection}
          onMouseUp={handleSelection}
          onKeyDown={handleContentKeyDown}
          autoFocus
        >
          {text === "" && document.activeElement === contentRef.current && contentRef.current?.innerText === "" && (
            <span style={{ opacity: 0.5, pointerEvents: 'none', position: 'absolute' }} className="animate-pulse">Type here...</span>
          )}
        </div>
      ) : (
        <div
          className="w-full h-full p-2 text-base rounded-b-lg cursor-pointer"
          style={{ fontFamily: font, background: 'transparent', minHeight: 40, minWidth: 80 }}
          onDoubleClick={onEdit}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
      {/* Four-corner resize handles, only if selected */}
      {isSelected && <>
        <div className="resizer top-left" onPointerDown={handleResizePointerDown('top-left')} style={{ position: 'absolute', left: -8, top: -8, width: 16, height: 16, borderRadius: '50%', background: '#fff', border: '2px solid #4286f4', cursor: 'nwse-resize', zIndex: 20 }} />
        <div className="resizer top-right" onPointerDown={handleResizePointerDown('top-right')} style={{ position: 'absolute', right: -8, top: -8, width: 16, height: 16, borderRadius: '50%', background: '#fff', border: '2px solid #4286f4', cursor: 'nesw-resize', zIndex: 20 }} />
        <div className="resizer bottom-left" onPointerDown={handleResizePointerDown('bottom-left')} style={{ position: 'absolute', left: -8, bottom: -8, width: 16, height: 16, borderRadius: '50%', background: '#fff', border: '2px solid #4286f4', cursor: 'nesw-resize', zIndex: 20 }} />
        <div className="resizer bottom-right" onPointerDown={handleResizePointerDown('bottom-right')} style={{ position: 'absolute', right: -8, bottom: -8, width: 16, height: 16, borderRadius: '50%', background: '#fff', border: '2px solid #4286f4', cursor: 'nwse-resize', zIndex: 20 }} />
      </>}
    </div>
  );
}

const SOCKET_SERVER_URL = "http://localhost:4000"; // Change if deploying

// --- Smoothing function for pen lines ---
function getCatmullRomSpline(points, tension = 0.5, numOfSegments = 16) {
  if (points.length < 2) return points;
  let result = [];
  for (let i = 0; i < points.length - 1; i++) {
    let p0 = points[i - 1] || points[i];
    let p1 = points[i];
    let p2 = points[i + 1] || points[i];
    let p3 = points[i + 2] || p2;
    for (let t = 0; t < numOfSegments; t++) {
      let tt = t / numOfSegments;
      let tt2 = tt * tt;
      let tt3 = tt2 * tt;
      let x = 0.5 * ((2 * p1.x) +
        (-p0.x + p2.x) * tt +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * tt3);
      let y = 0.5 * ((2 * p1.y) +
        (-p0.y + p2.y) * tt +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * tt3);
      result.push({ x, y });
    }
  }
  result.push(points[points.length - 1]);
  return result;
}

function PenMiniToolbar({ color, setColor, penThickness, setPenThickness, opacity, setOpacity, visible }) {
  const COLORS = ["#000000", "#e03131", "#1971c2", "#fab005", "#40c057", "#ae3ec9", "#fd7e14", "#ffffff"];

  if (!visible) return null;
  return (
    <div
      className="z-40 flex flex-col items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg px-4 py-3 gap-3 select-none min-w-[200px] fixed top-20 right-6"
      aria-label="Pen quick settings toolbar"
      style={{ transition: 'box-shadow 0.2s, top 0.3s cubic-bezier(.4,2,.6,1)' }}
    >
      {/* Color row */}
      <div className="flex gap-2 mb-1 items-center justify-center w-full">
        {COLORS.map((c, idx) => (
          <button
            key={c + idx}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-blue-400 ${color === c ? 'border-zinc-900 dark:border-white scale-110 shadow' : 'border-gray-300 dark:border-zinc-700'}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            aria-label={`Select pen color ${c}`}
            tabIndex={0}
          >
            {color === c && <span className="w-2 h-2 rounded-full bg-white border border-zinc-900 dark:border-white" />}
          </button>
        ))}
      </div>
      <div className="w-full h-px bg-gray-200 dark:bg-zinc-700 mb-1" />
      {/* Thickness and Opacity sliders */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">Thickness</span>
          <span className="text-[12px] text-gray-500 dark:text-gray-400">{penThickness}px</span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={penThickness}
          onChange={e => setPenThickness(Number(e.target.value))}
          className="w-full accent-blue-500"
          aria-label="Pen thickness"
        />
        <div className="flex items-center justify-between mt-1">
          <span className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">Opacity</span>
          <span className="text-[12px] text-gray-500 dark:text-gray-400">{Math.round(opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.01"
          value={opacity}
          onChange={e => setOpacity(Number(e.target.value))}
          className="w-full accent-blue-500"
          aria-label="Pen opacity"
        />
      </div>
    </div>
  );
}

export default function CanvasPage() {
  // Initialize boardId first
  const [boardId] = useState(() => {
    // Use URL param or random for now
    const urlId = window.location.hash.replace('#', '');
    if (urlId) return urlId;
    const randomId = Math.random().toString(36).slice(2, 10);
    window.location.hash = randomId;
    return randomId;
  });

  // Unified state for all elements
  const [elements, setElements] = useState(() => {
    try {
      const savedState = localStorage.getItem(`canvas-state-${boardId}`);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return {
          lines: parsed.lines || [],
          stickyNotes: parsed.stickyNotes || [],
          images: parsed.images || [],
          textBoxes: parsed.textBoxes || [],
        };
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
    return {
      lines: [],
      stickyNotes: [],
      images: [],
      textBoxes: []
    };
  });

  const [drawing, setDrawing] = useState(false);
  // Initialize undo/redo stacks from localStorage
  const [undoStack, setUndoStack] = useState(() => {
    try {
      const savedUndo = localStorage.getItem(`undo-stack-${boardId}`);
      return savedUndo ? JSON.parse(savedUndo) : [];
    } catch (error) {
      console.error('Error loading undo stack:', error);
      return [];
    }
  });
  const [redoStack, setRedoStack] = useState(() => {
    try {
      const savedRedo = localStorage.getItem(`redo-stack-${boardId}`);
      return savedRedo ? JSON.parse(savedRedo) : [];
    } catch (error) {
      console.error('Error loading redo stack:', error);
      return [];
    }
  });

  // Save undo/redo stacks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(`undo-stack-${boardId}`, JSON.stringify(undoStack));
    } catch (error) {
      console.error('Error saving undo stack:', error);
    }
  }, [undoStack, boardId]);

  useEffect(() => {
    try {
      localStorage.setItem(`redo-stack-${boardId}`, JSON.stringify(redoStack));
    } catch (error) {
      console.error('Error saving redo stack:', error);
    }
  }, [redoStack, boardId]);

  const [eraserSize, setEraserSize] = useState(16);
  const [eraserPos, setEraserPos] = useState(null);
  const [eraserPreview, setEraserPreview] = useState(false);
  const [editingTextId, setEditingTextId] = useState(null);
  const [editingStickyId, setEditingStickyId] = useState(null);
  const [selectedStickyId, setSelectedStickyId] = useState(null);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [tool, setTool] = useState('select');
  const [color, setColor] = useState("#222");
  const [opacity, setOpacity] = useState(1);
  const [penThickness, setPenThickness] = useState(2);
  const canvasRef = useRef(null);
  const isDark = useIsDarkMode();
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [pendingImagePos, setPendingImagePos] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const socketRef = useRef(null);
  const [stickyFont, setStickyFont] = useState('Inter, sans-serif');
  const editingStickyRef = useRef(null);
  const [editingStickySelection, setEditingStickySelection] = useState(null);
  const editingTextRef = useRef(null);
  const [editingTextSelection, setEditingTextSelection] = useState(null);
  const [lastEraserPos, setLastEraserPos] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const eraserPointsRef = useRef([]); // Store eraser points for batching
  const erasingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const eraserCursorRef = useRef(null);
  const cursorAnimationFrameRef = useRef(null);
  // Position the toolbar under the top controls bar by default (right-aligned, matching screenshot)
  const [position, setPosition] = useState({ x: window.innerWidth - 24 - 320, y: 80 });

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

  const handleDownload = async (format) => {
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // Create a temporary canvas to combine all elements
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      // Draw background
      tempCtx.fillStyle = isDark ? '#18181b' : '#fafafa';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      // Draw all elements
      // Draw lines
      elements.lines.forEach((line) => {
        tempCtx.save();
        tempCtx.strokeStyle = line.color;
        tempCtx.globalAlpha = line.opacity !== undefined ? line.opacity : 1;
        tempCtx.lineWidth = line.thickness || 2.5;
        tempCtx.beginPath();
        const smoothPoints = getCatmullRomSpline(line.points);
        ctx.moveTo(smoothPoints[0].x, smoothPoints[0].y);
        for (let i = 1; i < smoothPoints.length; i++) {
          ctx.lineTo(smoothPoints[i].x, smoothPoints[i].y);
        }
        ctx.stroke();
        tempCtx.restore();
      });
      // Draw sticky notes
      elements.stickyNotes.forEach((note) => {
        tempCtx.save();
        tempCtx.fillStyle = note.color || '#fff';
        tempCtx.fillRect(note.x, note.y, 120, 80);
        tempCtx.fillStyle = '#000';
        tempCtx.font = '14px sans-serif';
        tempCtx.fillText(note.text, note.x + 10, note.y + 20);
        tempCtx.restore();
      });
      // Draw text boxes
      elements.textBoxes.forEach((text) => {
        tempCtx.save();
        tempCtx.fillStyle = text.color || '#000';
        tempCtx.font = '14px sans-serif';
        tempCtx.fillText(text.text, text.x, text.y);
        tempCtx.restore();
      });
      // Draw images
      const imagePromises = elements.images.map((img) => {
        return new Promise((resolve) => {
          const image = new Image();
          image.crossOrigin = 'anonymous';
          image.onload = () => {
            tempCtx.drawImage(image, img.x, img.y, img.width, img.height);
            resolve();
          };
          image.onerror = () => resolve();
          image.src = img.src;
        });
      });
      await Promise.all(imagePromises);
      if (format === 'pdf') {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [tempCanvas.width, tempCanvas.height]
        });
        pdf.addImage(
          tempCanvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );
        pdf.save('canvas-export.pdf');
      } else {
        const link = document.createElement('a');
        link.download = 'canvas-export.jpg';
        link.href = tempCanvas.toDataURL('image/jpeg', 0.8);
        link.click();
      }
      setShowDownloadModal(false);
    } catch (error) {
      console.error('Error downloading:', error);
      alert('Error downloading the canvas. Please try again.');
    }
  };

  // Save state to localStorage whenever elements change
  useEffect(() => {
    try {
      localStorage.setItem(`canvas-state-${boardId}`, JSON.stringify(elements));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [elements, boardId]);

  // Helper: push to undo stack
  const pushToUndo = (current) => {
    setUndoStack((prev) => [...prev, current]);
    setRedoStack([]);
  };

  // Batched erase logic
  const batchErase = useCallback(() => {
    if (eraserPointsRef.current.length === 0) return;
    setElements((prev) => {
      let newElements = { ...prev };
      eraserPointsRef.current.forEach(({ x, y }) => {
        newElements.lines = newElements.lines.filter(line => !line.points.some(pt => Math.hypot(x - pt.x, y - pt.y) < eraserSize / 2));
        newElements.stickyNotes = newElements.stickyNotes.filter(note => !isInBox(x, y, note.x, note.y, 120, 80));
        newElements.images = newElements.images.filter(img => !isInBox(x, y, img.x, img.y, img.width, img.height));
        newElements.textBoxes = newElements.textBoxes.filter(tb => !isInBox(x, y, tb.x, tb.y, 120, 40));
      });
      // Always return all keys, even if empty
      return {
        lines: newElements.lines || [],
        stickyNotes: newElements.stickyNotes || [],
        images: newElements.images || [],
        textBoxes: newElements.textBoxes || [],
      };
    });
    eraserPointsRef.current = [];
  }, [eraserSize]);

  // Animation frame loop for erasing
  useEffect(() => {
    if (!erasingRef.current) return;
    const loop = () => {
      batchErase();
      animationFrameRef.current = requestAnimationFrame(loop);
    };
    animationFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [batchErase]);

  // Add effect for smooth cursor movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!eraserCursorRef.current || tool !== 'eraser') return;
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Cancel any pending animation frame
      if (cursorAnimationFrameRef.current) {
        cancelAnimationFrame(cursorAnimationFrameRef.current);
      }

      // Use requestAnimationFrame for smooth cursor movement
      cursorAnimationFrameRef.current = requestAnimationFrame(() => {
        if (eraserCursorRef.current) {
          eraserCursorRef.current.style.transform = `translate3d(${x - eraserSize / 2}px, ${y - eraserSize / 2}px, 0)`;
        }
      });
      
      // Update state for other operations
      setMousePos({ x, y });
    };

    if (tool === 'eraser') {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (cursorAnimationFrameRef.current) {
        cancelAnimationFrame(cursorAnimationFrameRef.current);
      }
    };
  }, [tool, eraserSize]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Only process erasing/drawing if we're actually drawing
    if (!drawing) return;
    
    // Handle eraser and drawing in requestAnimationFrame
    if (tool === 'eraser') {
      requestAnimationFrame(() => {
        // Add point to eraser points array
        eraserPointsRef.current.push({ x, y });
        // Instantly erase at this point
        setElements((prev) => {
          let newElements = { ...prev };
          newElements.lines = newElements.lines.filter(line => !line.points.some(pt => Math.hypot(x - pt.x, y - pt.y) < eraserSize / 2));
          newElements.stickyNotes = newElements.stickyNotes.filter(note => !isInBox(x, y, note.x, note.y, 120, 80));
          newElements.images = newElements.images.filter(img => !isInBox(x, y, img.x, img.y, img.width, img.height));
          newElements.textBoxes = newElements.textBoxes.filter(tb => !isInBox(x, y, tb.x, tb.y, 120, 40));
          return {
            lines: newElements.lines || [],
            stickyNotes: newElements.stickyNotes || [],
            images: newElements.images || [],
            textBoxes: newElements.textBoxes || [],
          };
        });
      });
    } else if (tool === 'draw') {
      requestAnimationFrame(() => {
        setElements((prev) => {
          if (!prev.lines.length) return prev;
          const lines = [...prev.lines];
          const currentLine = lines[lines.length - 1];
          lines[lines.length - 1] = {
            ...currentLine,
            points: [...currentLine.points, { x, y }],
            thickness: penThickness
          };
          return { ...prev, lines };
        });
      });
    }
  };

  // Handler functions with real logic
  const handleCanvasPointerDown = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'draw') {
      setDrawing(true);
      pushToUndo(elements);
      setElements(prev => ({
        ...prev,
        lines: [...prev.lines, {
          points: [{ x, y }],
          color,
          opacity,
          thickness: penThickness
        }]
      }));
    } else if (tool === 'eraser') {
      pushToUndo(elements);
      eraserPointsRef.current = [{ x, y }];
      setDrawing(true);
      setEraserPos({ x, y });
      setEraserPreview(true);
      erasingRef.current = true;
      // Add initial erase point
      setElements((prev) => {
        let newElements = { ...prev };
        newElements.lines = newElements.lines.filter(line => !line.points.some(pt => Math.hypot(x - pt.x, y - pt.y) < eraserSize / 2));
        newElements.stickyNotes = newElements.stickyNotes.filter(note => !isInBox(x, y, note.x, note.y, 120, 80));
        newElements.images = newElements.images.filter(img => !isInBox(x, y, img.x, img.y, img.width, img.height));
        newElements.textBoxes = newElements.textBoxes.filter(tb => !isInBox(x, y, tb.x, tb.y, 120, 40));
        return {
          lines: newElements.lines || [],
          stickyNotes: newElements.stickyNotes || [],
          images: newElements.images || [],
          textBoxes: newElements.textBoxes || [],
        };
      });
    } else if (tool === 'sticky') {
      pushToUndo(elements);
      const newId = Date.now();
      setElements(prev => ({
        ...prev,
        stickyNotes: [...prev.stickyNotes, {
          id: newId,
          x,
          y,
          width: 120,
          height: 80,
          color: "#fff",
          text: "",
          font: stickyFont,
          rotation: 0
        }]
      }));
      setEditingStickyId(newId);
      setSelectedStickyId(newId);
    } else if (tool === 'text') {
      pushToUndo(elements);
      const newId = Date.now();
      setElements(prev => ({
        ...prev,
        textBoxes: [...prev.textBoxes, {
          id: newId,
          x,
          y,
          width: 120,
          height: 40,
          color: "#222",
          text: "",
          font: "Inter, sans-serif"
        }]
      }));
      setEditingTextId(newId);
      setSelectedTextId(newId);
    } else if (tool === 'image') {
      setPendingImagePos({ x, y });
      setShowAddImageModal(true);
    }
  };

  const handleTextSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editingTextRef.current && editingTextRef.current.contains(sel.anchorNode)) {
      setEditingTextSelection(sel.getRangeAt(0));
    } else {
      setEditingTextSelection(null);
    }
  };

  const handleToolbarToolSelect = (selectedTool) => {
    console.log('handleToolbarToolSelect called with:', selectedTool);
    setTool(selectedTool);
    if (selectedTool === 'image') {
      const x = window.innerWidth / 2 - 60;
      const y = window.innerHeight / 2 - 45;
      setPendingImagePos({ x, y });
      setShowAddImageModal(true);
    }
  };

  const handleAddImage = ({ type, src, position }) => {
    pushToUndo(elements);
    setElements((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { id: Date.now(), x: position.x, y: position.y, src, width: 120, height: 90 }
      ]
    }));
  };

  const safeElements = elements && typeof elements === 'object' ? elements : { lines: [], stickyNotes: [], images: [], textBoxes: [] };

  const handlePointerUp = () => {
    if (tool === 'eraser') {
      batchErase(); // Final erase for any remaining points
      eraserPointsRef.current = []; // Clear eraser points
    }
    setDrawing(false);
    setEraserPos(null);
    setEraserPreview(false);
    erasingRef.current = false;
  };

  // Debug: log tool state changes
  useEffect(() => {
    console.log('Current tool:', tool);
  }, [tool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all lines with smoothing
    elements.lines.forEach(line => {
      if (!line.points.length) return;
      ctx.save();
      ctx.strokeStyle = line.color;
      ctx.globalAlpha = line.opacity !== undefined ? line.opacity : 1;
      ctx.lineWidth = line.thickness || 2.5;
      ctx.beginPath();
      const smoothPoints = getCatmullRomSpline(line.points);
      ctx.moveTo(smoothPoints[0].x, smoothPoints[0].y);
      for (let i = 1; i < smoothPoints.length; i++) {
        ctx.lineTo(smoothPoints[i].x, smoothPoints[i].y);
      }
      ctx.stroke();
      ctx.restore();
    });
  }, [elements.lines]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        handleRedo();
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedStickyId) {
        e.preventDefault();
        // Find the sticky note and delete it
        pushToUndo(elements);
        setElements((prev) => ({
          ...prev,
          stickyNotes: prev.stickyNotes.filter(n => n.id !== selectedStickyId)
        }));
        setSelectedStickyId(null);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        // Only select all sticky notes if not editing any
        if (!editingStickyId) {
          e.preventDefault();
          // Optionally, select all sticky notes or perform your own logic here
          // For now, do nothing (or you could set a multi-select state)
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedStickyId, elements, editingStickyId]);

  // --- Touch event handlers for drawing ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Touch start
    const handleTouchStart = (e) => {
      if (tool !== 'draw') return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setDrawing(true);
      pushToUndo(elements);
      setElements(prev => ({
        ...prev,
        lines: [...prev.lines, {
          points: [{ x, y }],
          color,
          opacity,
          thickness: penThickness
        }]
      }));
    };
    // Touch move
    const handleTouchMove = (e) => {
      if (!drawing || tool !== 'draw') return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setElements((prev) => {
        if (!prev.lines.length) return prev;
        const lines = [...prev.lines];
        const currentLine = lines[lines.length - 1];
        lines[lines.length - 1] = {
          ...currentLine,
          points: [...currentLine.points, { x, y }],
          thickness: penThickness
        };
        return { ...prev, lines };
      });
    };
    // Touch end
    const handleTouchEnd = () => {
      setDrawing(false);
    };
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [tool, drawing, color, opacity, penThickness, elements]);

  return (
    <div 
      className="h-screen w-screen relative bg-gray-50 dark:bg-dark"
    >
      <LogoStandalone />
      <TopControlsBox 
        onUndo={handleUndo} 
        onRedo={handleRedo} 
        boardId={boardId} 
        onDownload={handleDownload}
      />
      <PenMiniToolbar
        color={color}
        setColor={setColor}
        penThickness={penThickness}
        setPenThickness={setPenThickness}
        opacity={opacity}
        setOpacity={setOpacity}
        visible={tool === 'draw'}
      />
      {tool !== 'draw' && (
        <RightToolbar
          tool={tool}
          eraserSize={eraserSize}
          setEraserSize={setEraserSize}
          color={color}
          setColor={setColor}
          opacity={opacity}
          setOpacity={setOpacity}
          penThickness={penThickness}
          setPenThickness={setPenThickness}
          selectedStickyId={selectedStickyId}
          selectedTextId={selectedTextId}
          stickyFont={selectedStickyId ? safeElements.stickyNotes.find(n => n.id === selectedStickyId)?.font : ''}
          textFont={selectedTextId ? safeElements.textBoxes.find(t => t.id === selectedTextId)?.font : ''}
          onStickyColorChange={(newColor) => {
            if (!selectedStickyId) return;
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              stickyNotes: prev.stickyNotes.map(n => n.id === selectedStickyId ? { ...n, color: newColor } : n)
            }));
            setColor(newColor);
          }}
          onStickyFontChange={(newFont) => {
            if (!selectedStickyId) return;
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              stickyNotes: prev.stickyNotes.map(n => n.id === selectedStickyId ? { ...n, font: newFont } : n)
            }));
            setStickyFont(newFont);
          }}
          onTextColorChange={(newColor) => {
            if (!selectedTextId) return;
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              textBoxes: prev.textBoxes.map(t => t.id === selectedTextId ? { ...t, color: newColor } : t)
            }));
            setColor(newColor);
          }}
          onTextFontChange={(newFont) => {
            if (!selectedTextId) return;
            pushToUndo(elements);
            setElements((prev) => ({
              ...prev,
              textBoxes: prev.textBoxes.map(t => t.id === selectedTextId ? { ...t, font: newFont } : t)
            }));
          }}
          elements={safeElements}
          hidePenControls={tool === 'draw'}
        />
      )}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="block absolute top-0 left-0 w-full h-full"
        style={{
          cursor: tool === 'draw' ? 'crosshair' : tool === 'eraser' ? 'none' : 'default',
          background: 'transparent',
          touchAction: 'none',
        }}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      {/* Sticky Notes */}
      {safeElements.stickyNotes.map((note) => (
        <StickyNote
          key={note.id}
          id={note.id}
          x={note.x}
          y={note.y}
          width={note.width || 120}
          height={note.height || 80}
          rotation={note.rotation || 0}
          color={note.color || "#fff"}
          font={note.font || "Inter, sans-serif"}
          text={note.text}
          isEditing={editingStickyId === note.id}
          isSelected={selectedStickyId === note.id}
          onClick={() => setSelectedStickyId(note.id)}
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
            if (selectedStickyId === note.id) setSelectedStickyId(null);
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
          editingRef={editingStickyId === note.id ? editingStickyRef : undefined}
          onSelectionChange={editingStickyId === note.id ? setEditingStickySelection : undefined}
        />
      ))}
      {/* Images */}
      {safeElements.images.map((img) => (
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
      {safeElements.textBoxes.map((tb) => (
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
          <div
            className={`rounded bg-white/80 dark:bg-zinc-900/80 px-2 py-1 text-base shadow border border-gray-200 dark:border-zinc-700 cursor-pointer ${selectedTextId === tb.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            style={{
              fontFamily: tb.font || 'inherit',
              fontWeight: 500,
              minWidth: 60,
              color: tb.color || '#222',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onClick={() => setSelectedTextId(tb.id)}
          >
            {editingTextId === tb.id ? (
              <div
                ref={editingTextId === tb.id ? editingTextRef : undefined}
                contentEditable
                suppressContentEditableWarning
                className="bg-transparent outline-none w-full"
                style={{ fontFamily: tb.font || 'inherit', color: tb.color || '#222' }}
                onBlur={() => setEditingTextId(null)}
                onInput={e => setElements((prev) => ({
                  ...prev,
                  textBoxes: prev.textBoxes.map(t => t.id === tb.id ? { ...t, text: e.currentTarget.innerHTML } : t)
                }))}
                onSelect={handleTextSelection}
                onKeyUp={handleTextSelection}
                onMouseUp={handleTextSelection}
                dangerouslySetInnerHTML={{ __html: tb.text }}
              />
            ) : (
              tb.text
            )}
          </div>
        </Draggable>
      ))}
      {/* Eraser cursor and preview */}
      {tool === 'eraser' && (
        <div
          ref={eraserCursorRef}
          style={{
            position: 'absolute',
            width: eraserSize,
            height: eraserSize,
            pointerEvents: 'none',
            borderRadius: '50%',
            border: '2px solid #f87171',
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            boxShadow: '0 0 8px 2px rgba(248,113,113,0.2)',
            zIndex: 1000,
            willChange: 'transform',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            WebkitPerspective: 1000,
            WebkitFontSmoothing: 'antialiased',
            WebkitOverflowScrolling: 'touch',
            transform: 'translate3d(0, 0, 0)',
            transition: 'none',
            transformOrigin: 'center center',
            WebkitTransformOrigin: 'center center',
            WebkitTransform: 'translate3d(0, 0, 0)',
            WebkitTransition: 'none',
          }}
        >
          {/* Small crosshair in the center */}
          <div
            style={{
              width: '2px',
              height: '2px',
              background: '#f87171',
              borderRadius: '50%',
              boxShadow: '0 0 2px 1px rgba(248,113,113,0.5)',
              transform: 'translate3d(0, 0, 0)',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          />
        </div>
      )}
      <BottomToolbar tool={tool} setTool={handleToolbarToolSelect} />
      <AddImageModal open={showAddImageModal} onClose={() => setShowAddImageModal(false)} onAdd={handleAddImage} position={pendingImagePos} isDark={isDark} />
    </div>
  );
}
  