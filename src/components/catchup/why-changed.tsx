import { ChevronDown } from "lucide-react"
import { useChangeExplanation } from "@/hooks/use-change-explanation"
import type { CatchUpReason } from "@/types"
import { cn } from "@/utils/cn"

export function WhyChanged({
  reason,
  changeId,
  open,
  onToggle,
}: {
  reason: CatchUpReason
  changeId: string
  open: boolean
  onToggle: () => void
}) {
  const explanation = useChangeExplanation(changeId, open)
  const ai = explanation.explanation

  return (
    <div className="mt-6">
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
        aria-controls="why-changed"
        onClick={onToggle}
      >
        {reason.prompt}
        <ChevronDown
          className={cn("size-4 transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      <div
        id="why-changed"
        className={cn(
          "grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className={cn("overflow-hidden", !open && "invisible")} aria-hidden={!open}>
          {explanation.status === "loading" ? (
            <p className="mt-4 text-sm text-muted-foreground">Reconstructing decision history...</p>
          ) : null}
          {ai?.available ? (
            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <p>{ai.summary}</p>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">What changed</dt>
                  <dd className="mt-1">{ai.whatChanged}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Previous</dt>
                  <dd className="mt-1">{ai.previousState}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Current</dt>
                  <dd className="mt-1">{ai.currentState}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Confidence</dt>
                  <dd className="mt-1">{ai.confidence?.toFixed(2)}</dd>
                </div>
              </dl>
              {ai.contributingFactors && ai.contributingFactors.length > 0 ? (
                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Contributing factors</p>
                  <ul className="mt-1 list-disc pl-4">
                    {ai.contributingFactors.map((factor) => (
                      <li key={factor}>{factor}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {ai.evidence && ai.evidence.length > 0 ? (
                <p className="text-xs text-muted-foreground">Evidence: {ai.evidence.map((item) => item.title).join("; ")}</p>
              ) : null}
            </div>
          ) : null}
          {explanation.status === "fallback" && ai?.message ? (
            <p className="mt-4 text-sm leading-relaxed">{ai.message}</p>
          ) : null}
          <ol className="mt-4 space-y-4 border-l pl-4">
            {reason.points.map((point) => (
              <li key={point.id}>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{point.label}</p>
                <p className="mt-1 text-sm leading-relaxed">{point.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
