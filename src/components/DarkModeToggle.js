import { useEffect, useState } from "react"

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  )

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed bottom-24 right-4 z-50 bg-gray-900 text-white dark:bg-white dark:text-black px-4 py-2 rounded shadow-md text-sm hover:scale-105 transition-all"
    >
      {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  )
}
