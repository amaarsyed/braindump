import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Sidebar from "./components/Sidebar"
import CanvasPage from "./pages/CanvasPage"
import ChatBot from "./components/ChatBot"
import DarkModeToggle from "./components/DarkModeToggle"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [page, setPage] = useState("canvas")

  const renderPage = () => {
    switch (page) {
      case "canvas":
      default:
        return <CanvasPage />
    }
  }

  const sidebarWidth = sidebarOpen ? 240 : 80

  return (
    <>
      <div className="h-screen w-screen flex overflow-hidden bg-gray-50 dark:bg-dark text-black dark:text-white transition-colors duration-300">

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          setPage={setPage}
        />

        {/* Main Content */}
        <main
          className="transition-all duration-300 p-10 relative w-full"
          style={{ marginLeft: sidebarWidth }}
        >
          {/* Dark Mode Button in top-right */}
          <DarkModeToggle />

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Chatbot (bottom-right) */}
      <ChatBot />
    </>
  )
}

export default App
