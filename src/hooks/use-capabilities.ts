import { useEffect, useState } from "react"
import { fetchCapabilities } from "@/services/api/ai"

export function useCapabilities() {
  const [ai, setAi] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchCapabilities()
      .then((capabilities) => {
        if (!cancelled) setAi(capabilities.ai)
      })
      .catch(() => {
        if (!cancelled) setAi(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return ai
}
