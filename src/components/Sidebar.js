import { useState } from "react"
import { motion } from "framer-motion"

export default function Sidebar({ setPage }) {
  const [isOpen, setIsOpen] = useState(true)
  const width = isOpen ? 240 : 80 // px values for open/collapsed

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
        <div className="border-t border-gray-100">
          <div className="px-2">
            <div className="py-4">
              <button
                onClick={() => setPage('canvas')}
                className={`t group relative flex items-center rounded-sm bg-blue-50 px-2 py-1.5 text-blue-700 w-full ${!isOpen ? 'justify-center' : ''}`}
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {isOpen && (
                  <span className="ml-3">General</span>
                )}
              </button>
            </div>
            <ul className="space-y-1 border-t border-gray-100 pt-4">
              <li>
                <button
                  onClick={() => setPage('teams')}
                  className={`group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 w-full ${!isOpen ? 'justify-center' : ''}`}
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {isOpen && (
                    <span className="ml-3">Teams</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage('billing')}
                  className={`group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 w-full ${!isOpen ? 'justify-center' : ''}`}
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
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  {isOpen && (
                    <span className="ml-3">Billing</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage('invoices')}
                  className={`group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 w-full ${!isOpen ? 'justify-center' : ''}`}
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
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  {isOpen && (
                    <span className="ml-3">Invoices</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage('account')}
                  className={`group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 w-full ${!isOpen ? 'justify-center' : ''}`}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {isOpen && (
                    <span className="ml-3">Account</span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
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
