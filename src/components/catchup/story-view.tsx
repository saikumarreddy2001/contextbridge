import { ChangeComparison } from "@/components/catchup/change-comparison"
import { StoryHeader } from "@/components/catchup/story-header"
import { StorySequence } from "@/components/catchup/story-sequence"
import { WhyChanged } from "@/components/catchup/why-changed"
import { Button } from "@/components/ui/button"
import type { CatchUpStory } from "@/types"

export function StoryView({
  story,
  whyOpen,
  onToggleWhy,
  onOpenEvidence,
  showGuidedNav,
  canGoPrevious,
  onPrevious,
  onNext,
  onBackToAll,
}: {
  story: CatchUpStory
  whyOpen: boolean
  onToggleWhy: () => void
  onOpenEvidence: () => void
  showGuidedNav: boolean
  canGoPrevious: boolean
  onPrevious: () => void
  onNext: () => void
  onBackToAll: () => void
}) {
  const evidenceLabel = story.type === "blocker" ? "View related work" : "View Evidence"

  return (
    <article>
      <StoryHeader story={story} />
      <StorySequence steps={story.steps} />
      <StoryBody story={story} whyOpen={whyOpen} onToggleWhy={onToggleWhy} />
      <div className="mt-6">
        <Button type="button" id="view-evidence" variant="outline" onClick={onOpenEvidence}>
          {evidenceLabel}
        </Button>
      </div>
      {showGuidedNav ? (
        <div className="mt-8 flex items-center justify-between gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onPrevious} disabled={!canGoPrevious}>
            Previous
          </Button>
          <Button type="button" onClick={onNext}>
            Next
          </Button>
        </div>
      ) : (
        <div className="mt-8 border-t pt-4">
          <Button type="button" variant="outline" onClick={onBackToAll}>
            All changes
          </Button>
        </div>
      )}
    </article>
  )
}

function StoryBody({
  story,
  whyOpen,
  onToggleWhy,
}: {
  story: CatchUpStory
  whyOpen: boolean
  onToggleWhy: () => void
}) {
  if (story.type === "decision" || story.type === "requirement") {
    return (
      <>
        <ChangeComparison
          comparison={story.comparison}
          reasonLabel={story.type === "requirement" ? "Why it matters" : "Reason"}
        />
        {story.type === "decision" && story.variant === "revised" ? (
          <WhyChanged points={story.whyChanged} open={whyOpen} onToggle={onToggleWhy} />
        ) : null}
      </>
    )
  }

  if (story.type === "blocker") {
    return (
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Fact label="Blocked work" value={story.blockedWork} />
        <Fact label="Blocked by" value={story.blockedBy} />
        <Fact label="Status" value={story.statusLabel} />
        <Fact label="Owner" value={story.owner} />
      </div>
    )
  }

  if (story.type === "discussion") {
    return (
      <div className="mt-8 space-y-3">
        <Fact label="Open question" value={story.openQuestion} />
        <Fact label="Participants" value={story.participants.join(", ")} />
        <Fact label="Status" value={story.statusLabel} />
        <Fact label="Why Alex should care" value={story.whyAlexShouldCare} />
      </div>
    )
  }

  return (
    <div className="mt-8">
      <p className="text-sm leading-relaxed">{story.whyItMatters}</p>
      <ul className="mt-4 divide-y rounded-lg border">
        {story.taskChanges.map((task) => (
          <li key={task.id} className="flex items-start justify-between gap-3 px-3 py-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{task.key}</p>
              <p className="text-sm font-medium">{task.title}</p>
            </div>
            <p className="shrink-0 text-xs font-medium tracking-wide uppercase">{task.outcome}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border px-3 py-3">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-sm leading-relaxed">{value}</p>
    </div>
  )
}
