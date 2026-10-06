import type { TraceMode } from "@/hooks/use-context-graph"

export function TraceControls({
  traceMode,
  canTraceWhy,
  canTraceImpact,
  onTrace,
  onExitTrace,
}: {
  traceMode: TraceMode | null
  canTraceWhy: boolean
  canTraceImpact: boolean
  onTrace: (mode: TraceMode) => void
  onExitTrace: () => void
}) {
  if (!traceMode && !canTraceWhy && !canTraceImpact) return null

  return (
    <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
      {traceMode ? (
        <p className="w-full text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {traceMode === "why" ? "Tracing why" : "Tracing impact"}
        </p>
      ) : null}
      {canTraceWhy ? (
        <button
          type="button"
          aria-pressed={traceMode === "why"}
          onClick={() => onTrace("why")}
          className="min-h-11 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-foreground aria-pressed:text-background"
        >
          Trace Why
        </button>
      ) : null}
      {canTraceImpact ? (
        <button
          type="button"
          aria-pressed={traceMode === "impact"}
          onClick={() => onTrace("impact")}
          className="min-h-11 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-foreground aria-pressed:text-background"
        >
          Trace Impact
        </button>
      ) : null}
      {traceMode ? (
        <button
          type="button"
          onClick={onExitTrace}
          className="min-h-11 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Exit Trace
        </button>
      ) : null}
    </div>
  )
}
