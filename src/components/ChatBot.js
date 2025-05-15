import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

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
        className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-xl hover:scale-105 transition-all flex items-center justify-center text-xl"
      >
        💬
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mt-2 w-80 h-96 bg-white border rounded-xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 font-semibold bg-gray-50 border-b text-sm">
              🤖 Braindump AI Assistant
            </div>

            {/* Chat body */}
            <div
              ref={scrollRef}
              className="flex-1 p-3 space-y-2 overflow-auto text-sm bg-white"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] p-2 rounded-lg ${
                    msg.from === "user"
                      ? "ml-auto bg-blue-100 text-right"
                      : "mr-auto bg-gray-100"
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
              className="flex items-center border-t bg-white px-2"
            >
              <input
                name="message"
                ref={inputRef}
                placeholder="Ask something..."
                className="flex-1 p-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="text-blue-600 font-bold px-2 hover:text-blue-800"
              >
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
