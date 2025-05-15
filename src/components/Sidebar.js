import { motion } from "framer-motion"

export default function Sidebar({ isOpen, setIsOpen, setPage }) {
  const width = isOpen ? 240 : 80 // Tailwind px values: 60 => 240, 20 => 80

  return (
    <motion.div
      initial={{ width }}
      animate={{ width }}
      transition={{ duration: 0.3 }}
      className="h-full bg-white shadow-lg z-50 p-4 flex flex-col gap-4"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-200 rounded"
      >
        {isOpen ? "⬅" : "➡"}
      </button>

      <nav className="flex flex-col gap-2">
        <button
          onClick={() => setPage("canvas")}
          className="flex items-center gap-2 hover:text-blue-600"
        >
          🧠 {isOpen && "Canvas"}
        </button>
        <button
          onClick={() => setPage("chat")}
          className="flex items-center gap-2 hover:text-blue-600"
        >
          🤖 {isOpen && "Chat"}
        </button>
      </nav>
    </motion.div>
  )
}
