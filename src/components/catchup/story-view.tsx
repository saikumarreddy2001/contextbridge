import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ChangeComparison } from "@/components/catchup/change-comparison"
import { StoryHeader } from "@/components/catchup/story-header"
import { StorySequence } from "@/components/catchup/story-sequence"
import { WhyChanged } from "@/components/catchup/why-changed"
import { Button } from "@/components/ui/button"
import type { CatchUpItem } from "@/types"

export function StoryView({
  item,
  expandedReason,
  onToggleReason,
  onOpenEvidence,
  showGuidedNav,
  canGoPrevious,
  onPrevious,
  onNext,
  onBackToAll,
  evidence,
}: {
  item: CatchUpItem
  expandedReason: boolean
  onToggleReason: () => void
  onOpenEvidence: () => void
  showGuidedNav: boolean
  canGoPrevious: boolean
  onPrevious: () => void
  onNext: () => void
  onBackToAll: () => void
  evidence?: ReactNode
}) {
  const split = evidence != null

  return (
    <article
      className={
        split
          ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(24rem,34rem)] lg:items-start lg:gap-x-8"
          : undefined
      }
    >
      <div className={split ? "lg:col-span-2" : undefined}>
        <StoryHeader item={item} />
        {item.steps.length > 0 ? <StorySequence steps={item.steps} /> : null}
      </div>
      <div className="min-w-0">
        <ItemBody item={item} expandedReason={expandedReason} onToggleReason={onToggleReason} />
        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" id="view-evidence" variant="outline" className="min-h-11" onClick={onOpenEvidence}>
            View Evidence
          </Button>
          {item.contextFocusId ? (
            <Button asChild variant="outline" className="min-h-11">
              <Link to={`/graph?focus=${item.contextFocusId}`}>Explore Context</Link>
            </Button>
          ) : null}
        </div>
        {showGuidedNav ? (
          <div className="mt-8 flex items-center justify-between gap-3 border-t pt-4">
            <Button type="button" variant="outline" className="min-h-11" onClick={onPrevious} disabled={!canGoPrevious}>
              Previous
            </Button>
            <Button type="button" className="min-h-11" onClick={onNext}>
              Next
            </Button>
          </div>
        ) : (
          <div className="mt-8 border-t pt-4">
            <Button type="button" variant="outline" className="min-h-11" onClick={onBackToAll}>
              All changes
            </Button>
          </div>
        )}
      </div>
      {evidence}
    </article>
  )
}

function ItemBody({
  item,
  expandedReason,
  onToggleReason,
}: {
  item: CatchUpItem
  expandedReason: boolean
  onToggleReason: () => void
}) {
  return (
    <div className={item.action ? "mt-8 rounded-lg border border-foreground/30 p-4 sm:p-5" : undefined}>
      {item.action ? (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm font-medium">Your review</p>
          <p className="text-sm">
            {item.action.statusLabel}
            <span aria-hidden="true"> · </span>
            Due {item.action.dueLabel}
          </p>
        </div>
      ) : null}
      {item.action ? <p className="mt-3 text-sm leading-relaxed">{item.action.ask}</p> : null}
      {item.change ? <ChangeComparison comparison={item.change} /> : null}
      {item.details.length > 0 ? (
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {item.details.map((detail) => (
            <div key={detail.id} className="rounded-lg border px-3 py-3">
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{detail.label}</dt>
              <dd className="mt-1 text-sm leading-relaxed">{detail.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {item.reason ? (
        <p className="mt-4 text-sm leading-relaxed">
          <span className="font-medium">Reason: </span>
          {item.reason.summary}
        </p>
      ) : null}
      {item.reason ? (
        <WhyChanged reason={item.reason} open={expandedReason} onToggle={onToggleReason} />
      ) : null}
    </div>
  )
}
