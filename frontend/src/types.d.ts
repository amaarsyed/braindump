// Common types for the whiteboard application
interface Point {
  x: number;
  y: number;
}

interface Line {
  points: Point[];
  color: string;
  opacity?: number;
}

interface StickyNote {
  id: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  color?: string;
  font?: string;
  text: string;
}

interface Image {
  id: number;
  x: number;
  y: number;
  src: string;
  width: number;
  height: number;
}

interface TextBox {
  id: number;
  x: number;
  y: number;
  text: string;
  color?: string;
  font?: string;
}

interface Elements {
  lines: Line[];
  stickyNotes: StickyNote[];
  images: Image[];
  textBoxes: TextBox[];
}

// Tool types
type Tool = 'select' | 'hand' | 'draw' | 'eraser' | 'sticky' | 'image' | 'text';

// Font options
interface FontOption {
  label: string;
  value: string;
}

// Color options
type ColorMode = 'light' | 'dark'; 