"use client"

import { useState, useEffect } from "react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const initialTheme = savedTheme || (prefersDark ? "dark" : "light")
    setTheme(initialTheme)

    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light"
    setTheme(nextTheme)
    localStorage.setItem("theme", nextTheme)

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  if (!mounted) {
    return (
      <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
        <span>🌙</span>
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition border border-transparent dark:border-gray-700"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span>{theme === "light" ? "🌙" : "☀️"}</span>
    </button>
  )
}
