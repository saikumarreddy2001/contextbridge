import { useEffect, useState } from "react"
import { fetchStorySummary, type StorySummary } from "@/services/api/ai"

export function useStorySummary(enabled: boolean) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "hidden">("idle")
  const [summary, setSummary] = useState<StorySummary | null>(null)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    setStatus("loading")
    fetchStorySummary("story-authentication")
      .then((payload) => {
        if (cancelled) return
        if (!payload.available || !payload.headline) {
          setSummary(null)
          setStatus("hidden")
          return
        }
        setSummary(payload)
        setStatus("ready")
      })
      .catch(() => {
        if (cancelled) return
        setSummary(null)
        setStatus("hidden")
      })
    return () => {
      cancelled = true
    }
  }, [enabled])

  return { status, summary }
}
