import { useEffect, useState } from "react"
import { explainChange, type ChangeExplanation } from "@/services/api/ai"

const unavailable = "AI explanation is temporarily unavailable. Showing the reconstructed project evidence instead."

export function useChangeExplanation(changeId: string, open: boolean) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "fallback">("idle")
  const [explanation, setExplanation] = useState<ChangeExplanation | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setStatus("loading")
    explainChange(changeId)
      .then((payload) => {
        if (cancelled) return
        setExplanation(payload)
        setStatus(payload.available ? "ready" : "fallback")
      })
      .catch(() => {
        if (cancelled) return
        setExplanation({ available: false, message: unavailable })
        setStatus("fallback")
      })
    return () => {
      cancelled = true
    }
  }, [changeId, open])

  return { status, explanation }
}
