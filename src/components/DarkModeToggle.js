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
      className="absolute top-4 right-6 text-sm px-4 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white shadow hover:scale-105 transition-all z-40"

    >
      {dark ? "☀ Light" : "🌙 Dark"}
    </button>
  )
}
