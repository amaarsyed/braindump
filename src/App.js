import React from 'react';
import './App.css';
import CanvasPage from "./pages/CanvasPage"
import ChatBot from "./components/ChatBot"
import { CursorifyProvider } from '@cursorify/react';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <CursorifyProvider
      cursor={<CustomCursor />}
      delay={0}
      smoothness={0.2}
      hideNativeCursor={true}
    >
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark text-black dark:text-white transition-colors duration-300">
        <CanvasPage />
        <ChatBot />
      </div>
    </CursorifyProvider>
  );
}

export default App;
