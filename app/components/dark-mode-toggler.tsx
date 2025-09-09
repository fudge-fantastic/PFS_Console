/* eslint-disable import/no-unresolved */
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center p-2 text-sm outline-none bg-transparent shadow-none hover:shadow-none focus:ring-0"
      style={{ background: 'none' }}
    >
      <Sun className="size-4 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 transition-transform duration-300 scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}