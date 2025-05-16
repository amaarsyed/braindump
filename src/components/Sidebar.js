import { useState } from "react"
import { motion } from "framer-motion"

export default function Sidebar({ setPage }) {
  const [isOpen, setIsOpen] = useState(true)
  const width = isOpen ? 240 : 80 // px values for open/collapsed

  // Pages state
  const [pages, setPages] = useState([
    { id: 1, name: "Page 1" },
    { id: 2, name: "Page 2" },
  ])
  const [currentPage, setCurrentPage] = useState(1)

  // Add new page
  const addPage = () => {
    const newId = pages.length ? Math.max(...pages.map(p => p.id)) + 1 : 1
    const newPage = { id: newId, name: `Page ${newId}` }
    setPages([...pages, newPage])
    setCurrentPage(newId)
    setPage(`page-${newId}`)
  }

  // Select page
  const selectPage = (id) => {
    setCurrentPage(id)
    setPage(`page-${id}`)
  }

  return (
    <motion.div
      initial={{ width }}
      animate={{ width }}
      transition={{ duration: 0.3 }}
      className="h-full bg-white shadow-lg z-50 flex flex-col justify-between border-e border-gray-100"
      style={{ width }}
    >
      <div>
        {/* Toggle Button with Hamburger Icon */}
        <div className="flex items-center justify-center py-4">
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="p-2 hover:bg-gray-200 rounded transition-transform"
            aria-label="Toggle sidebar"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </motion.svg>
          </button>
        </div>
        {/* Pages Section */}
        <div className="border-t border-gray-100 px-2">
          <div className="flex items-center justify-between py-4">
            <span className="font-medium text-gray-700 flex items-center">
              {isOpen && "Pages"}
            </span>
            <button
              onClick={addPage}
              className="p-1 rounded hover:bg-gray-200"
              aria-label="Add page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <ul className="space-y-1">
            {pages.map(page => (
              <li key={page.id}>
                <button
                  onClick={() => selectPage(page.id)}
                  className={`group flex items-center rounded-sm px-2 py-1.5 w-full text-left ${currentPage === page.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'} ${!isOpen ? 'justify-center' : ''}`}
                >
                  {currentPage === page.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isOpen && <span>{page.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Optionally keep logout at the bottom */}
      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
        <button
          onClick={() => setPage('logout')}
          className={`group relative flex items-center justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 w-full ${!isOpen ? 'justify-center' : ''}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 opacity-75"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {isOpen && (
            <span className="ml-3">Logout</span>
          )}
        </button>
      </div>
    </motion.div>
  )
}
