import CanvasPage from "./pages/CanvasPage"
import ChatBot from "./components/ChatBot"

function App() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark text-black dark:text-white transition-colors duration-300">
      <CanvasPage />
      <ChatBot />
    </div>
  )
}

export default App
