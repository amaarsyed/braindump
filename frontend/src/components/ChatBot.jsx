import React, { useState } from 'react';
import { LuMessageSquare, LuX } from 'react-icons/lu';
import ChatPage from '../pages/ChatPage';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors z-50"
      >
        {isOpen ? <LuX size={20} /> : <LuMessageSquare size={20} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[320px] h-[480px] bg-white dark:bg-zinc-900 rounded-lg shadow-xl z-40 overflow-hidden border border-gray-200 dark:border-zinc-800">
          <div className="h-full flex flex-col">
            <ChatPage />
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;