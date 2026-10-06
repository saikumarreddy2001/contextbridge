import { useSyncExternalStore } from "react"
import { createStoredString } from "@/utils/stored-signal"

export type Theme = "light" | "dark"

function isTheme(value: string): boolean {
  return value === "light" || value === "dark"
}

const themeSignal = createStoredString<Theme>("contextbridge-theme", "light", isTheme)

export function applyStoredTheme() {
  const theme = themeSignal.getSnapshot()
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
}

function writeTheme(theme: Theme) {
  themeSignal.set(theme)
  applyStoredTheme()
}

export function useTheme() {
  const theme = useSyncExternalStore(
    themeSignal.subscribe,
    themeSignal.getSnapshot,
    themeSignal.getSnapshot,
  )

  return {
    theme,
    setTheme: writeTheme,
    toggleTheme() {
      writeTheme(themeSignal.getSnapshot() === "dark" ? "light" : "dark")
    },
  }
}
