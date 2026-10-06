import { useSyncExternalStore } from "react"
import { createStoredString } from "@/utils/stored-signal"

function isSidebarMode(value: string): boolean {
  return value === "expanded" || value === "collapsed"
}

const sidebarSignal = createStoredString<"expanded" | "collapsed">(
  "contextbridge-sidebar",
  "expanded",
  isSidebarMode,
)

export function useSidebar() {
  const mode = useSyncExternalStore(
    sidebarSignal.subscribe,
    sidebarSignal.getSnapshot,
    sidebarSignal.getSnapshot,
  )

  return {
    collapsed: mode === "collapsed",
    toggle() {
      sidebarSignal.set(sidebarSignal.getSnapshot() === "collapsed" ? "expanded" : "collapsed")
    },
  }
}
