import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Sidebar from "./components/Sidebar"
import CanvasPage from "./pages/CanvasPage"
import ChatPage from "./pages/ChatPage"
import ChatBot from "./components/ChatBot"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [page, setPage] = useState("canvas")

  const renderPage = () => {
    switch (page) {
      case "chat":
        return <ChatPage />
      case "canvas":
      default:
        return <CanvasPage />
    }
  }

  const sidebarWidth = sidebarOpen ? 240 : 80

  return (
    <>
      <div className="h-screen w-screen flex overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          setPage={setPage}
        />

        {/* Main content  */}
        <main
          className="transition-all duration-300 p-10"
          style={{ marginLeft: sidebarWidth }}
        >
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

      {/* Floating chatbot */}
      <ChatBot />
    </>
  )
}

export default App
