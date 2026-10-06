import { useState } from "react"
import { Link } from "react-router-dom"
import { SourceDetail } from "@/components/catchup/source-detail"
import { Button } from "@/components/ui/button"
import { useAsk } from "@/hooks/use-ask"
import { nodeExists } from "@/utils/history"

const suggestions = [
  "Why did authentication change?",
  "What is currently blocked?",
  "What needs my attention?",
  "Which decisions changed?",
]

export function AskContext() {
  const ask = useAsk()
  const [draft, setDraft] = useState("")
  const [evidenceId, setEvidenceId] = useState<string | null>(null)
  const response = ask.response
  const selected = response?.evidence.find((item) => item.id === evidenceId) ?? null
  const graphNodeId = response?.graphNodeId

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Ask Project Atlas</h1>
        <p className="mt-2 text-sm text-muted-foreground">September 16–23. Answers stay tied to the project record.</p>
      </div>
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          setEvidenceId(null)
          void ask.submit(draft)
        }}
      >
        <label htmlFor="ask-context" className="text-sm font-medium">
          What do you want to understand?
        </label>
        <input
          id="ask-context"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="What do you want to understand?"
          className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" className="min-h-11 w-full sm:w-auto">
          Ask
        </Button>
      </form>
      <div className="flex flex-col gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            type="button"
            variant="outline"
            className="min-h-11 justify-start whitespace-normal text-left"
            onClick={() => {
              setDraft(suggestion)
              setEvidenceId(null)
              void ask.submit(suggestion)
            }}
          >
            {suggestion}
          </Button>
        ))}
      </div>
      {ask.status === "loading" ? <p className="text-sm text-muted-foreground">Analyzing project context...</p> : null}
      {ask.status === "error" ? <p className="text-sm leading-relaxed">{ask.error}</p> : null}
      {response?.insufficientEvidence ? (
        <p className="text-sm leading-relaxed">ContextBridge doesn't have enough project evidence to answer this confidently.</p>
      ) : null}
      {response && !response.available && response.message ? <p className="text-sm leading-relaxed">{response.message}</p> : null}
      {response?.answer ? (
        <section className="space-y-4">
          <h2 className="text-lg font-medium">Answer</h2>
          <p className="text-sm leading-relaxed">{response.answer}</p>
          {typeof response.confidence === "number" && response.confidence > 0 ? (
            <p className="text-xs text-muted-foreground">Confidence {response.confidence.toFixed(2)}</p>
          ) : null}
          {response.evidence.length > 0 ? (
            <div>
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Evidence</h3>
              <div className="mt-2 flex flex-col gap-2">
                {response.evidence.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="min-h-11 rounded-md border px-3 py-2 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-expanded={evidenceId === item.id}
                    onClick={() => setEvidenceId((current) => (current === item.id ? null : item.id))}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              {selected ? <SourceDetail evidence={selected} /> : null}
            </div>
          ) : null}
          {response.related.length > 0 ? (
            <div>
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Related context</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {response.related.map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {graphNodeId && nodeExists(graphNodeId) ? (
            <Button variant="outline" className="min-h-11" asChild>
              <Link to={`/graph?focus=${graphNodeId}`}>Explore Context</Link>
            </Button>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
