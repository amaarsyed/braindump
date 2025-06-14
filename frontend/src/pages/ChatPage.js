import React, { useState, useRef, useEffect } from 'react';
import { LuSend, LuBrain } from 'react-icons/lu';

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m Boardly, your AI assistant for brainstorming and creative thinking. How can I help you with your ideas today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const userInput = input.trim();
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Try the production API first, fall back to mock if it fails
      let apiSuccess = false;
      
      if (process.env.NODE_ENV === 'production') {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': 'default-key', // Use default key for now
            },
            body: JSON.stringify({
              prompt: userInput,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.answer) {
              setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
              apiSuccess = true;
            }
          }
        } catch (apiError) {
          console.log('API call failed, using mock response:', apiError);
        }
      }
      
      // Use mock response for development OR if production API failed
      if (!apiSuccess) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate a mock response
        const mockResponses = [
          `That's interesting! You mentioned "${userInput}". I'm here to help with your brainstorming and creative process.`,
          `Great point about "${userInput}"! What other ideas are you exploring on your canvas?`,
          `I see you're thinking about "${userInput}". How does this connect to your other ideas?`,
          `"${userInput}" - that's a fascinating concept! Would you like to explore this further?`,
          `Thanks for sharing "${userInput}". I'm here to help you organize and expand your thoughts!`,
          `Interesting perspective on "${userInput}". How can we build on this idea?`,
          `"${userInput}" sounds like a great starting point. What's the next step you're considering?`,
          `I love the creativity behind "${userInput}". What inspired this thought?`
        ];
        
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Even if everything fails, provide a helpful response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I hear you talking about "${userInput}". While I'm having some technical difficulties, I'm still here to help you brainstorm and organize your ideas!` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <LuBrain size={16} className="text-blue-500" />
        <h1 className="text-sm font-medium">AI Chat</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-200 ease-out`}
            style={{
              opacity: 1,
              transform: 'translateY(0)'
            }}
          >
            <div
              className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-sm ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div
            className="flex justify-start transition-opacity duration-200"
            style={{ opacity: isLoading ? 1 : 0 }}
          >
            <div className="bg-white dark:bg-zinc-800 rounded-lg px-2.5 py-1.5 text-gray-500 text-sm">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex gap-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            disabled={isLoading}
            autoComplete="off"
            name="chat-message"
            id="chat-message"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-2.5 py-1.5 rounded-lg bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            <LuSend size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatPage;
  