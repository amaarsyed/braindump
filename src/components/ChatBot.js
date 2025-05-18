import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LuMessageSquare } from "react-icons/lu"

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  const sendMessage = (msg) => {
    setMessages([...messages, { from: "user", text: msg }])
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: "Hmm... Let me think 🤔" }])
    }, 800)
  }

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Chat Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-zinc-900 dark:bg-zinc-800 text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        <LuMessageSquare size={24} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mt-2 w-80 h-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 font-medium bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-sm flex items-center gap-2">
              <LuMessageSquare size={18} />
              <span>Chat Assistant</span>
            </div>

            {/* Chat body */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 space-y-3 overflow-auto text-sm bg-white dark:bg-zinc-900"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[85%] p-2.5 rounded-lg ${
                    msg.from === "user"
                      ? "ml-auto bg-zinc-900 dark:bg-zinc-800 text-white"
                      : "mr-auto bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const text = e.target.message.value.trim()
                if (text) sendMessage(text)
                e.target.reset()
              }}
              className="flex items-center gap-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3"
            >
              <input
                name="message"
                autoComplete="off"
                ref={inputRef}
                placeholder="Type a message..."
                className="flex-1 p-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-md outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
              />
              <button
                type="submit"
                className="p-2 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
