import { useState } from "react"
import { askProject, type AskResponse, type AskTurn } from "@/services/api/ai"

const unavailable = "AI explanation is temporarily unavailable. Showing the reconstructed project evidence instead."

export function useAsk() {
  const [question, setQuestion] = useState("")
  const [history, setHistory] = useState<AskTurn[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [response, setResponse] = useState<AskResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(text: string) {
    const asked = text.trim()
    if (!asked) return
    setQuestion(asked)
    setStatus("loading")
    setError(null)
    try {
      const payload = await askProject(asked, history.slice(-3))
      setResponse(payload)
      setStatus("ready")
      if (payload.answer) {
        setHistory((current) => [...current, { question: asked, answer: payload.answer }].slice(-3))
      }
    } catch (caught) {
      setResponse(null)
      setError(caught instanceof Error ? caught.message : unavailable)
      setStatus("error")
    }
  }

  return { question, setQuestion, history, status, response, error, submit }
}
