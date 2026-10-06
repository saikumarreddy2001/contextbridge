import { useSyncExternalStore } from "react"

export function useMinWidth(pixels: number): boolean {
  const query = `(min-width: ${pixels}px)`
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia(query)
      media.addEventListener("change", onStoreChange)
      return () => media.removeEventListener("change", onStoreChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
