import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Sidebar from "./components/Sidebar"
import CanvasPage from "./pages/CanvasPage"
import ChatBot from "./components/ChatBot"
import DarkModeToggle from "./components/DarkModeToggle"

function App() {
  const [page, setPage] = useState("canvas")

  const renderPage = () => {
    switch (page) {
      case "canvas":
        return <CanvasPage />
      case "teams":
        return <div className="text-2xl text-center mt-10">👥 Teams Page (placeholder)</div>
      case "billing":
        return <div className="text-2xl text-center mt-10">💳 Billing Page (placeholder)</div>
      case "invoices":
        return <div className="text-2xl text-center mt-10">🧾 Invoices Page (placeholder)</div>
      case "account":
        return <div className="text-2xl text-center mt-10">👤 Account Page (placeholder)</div>
      case "logout":
        return <div className="text-2xl text-center mt-10">🚪 Logged out (placeholder)</div>
      default:
        return <CanvasPage />
    }
  }

  return (
    <>
      <div className="h-screen w-screen flex overflow-hidden bg-gray-50 dark:bg-dark text-black dark:text-white transition-colors duration-300">
        {/* Sidebar */}
        <Sidebar setPage={setPage} />
        {/* Main Content */}
        <main className="transition-all duration-300 p-10 relative w-full">
          {/* Dark Mode Button in top-right */}
          <DarkModeToggle />
          {renderPage()}
        </main>
      </div>
      {/* Floating Chatbot (bottom-right) */}
      <ChatBot />
    </>
  )
}

export default App
