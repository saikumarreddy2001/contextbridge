import { catchUpWindow, storyMatchesFilter } from "@/data/catch-up-stories"
import { Button } from "@/components/ui/button"
import type { CatchUpFilter, CatchUpStory } from "@/types"
import { cn } from "@/utils/cn"

const filters: { id: CatchUpFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "decision", label: "Decision" },
  { id: "requirement", label: "Requirement" },
  { id: "blocker", label: "Blocker" },
  { id: "discussion", label: "Discussion" },
  { id: "task", label: "Task" },
]

const typeLabels: Record<CatchUpStory["type"], string> = {
  decision: "Decision",
  requirement: "Requirement",
  blocker: "Blocker",
  discussion: "Discussion",
  task: "Task",
}

export function AllChanges({
  stories,
  filter,
  viewedIds,
  onFilter,
  onOpen,
}: {
  stories: CatchUpStory[]
  filter: CatchUpFilter
  viewedIds: string[]
  onFilter: (filter: CatchUpFilter) => void
  onOpen: (slug: string) => void
}) {
  const visible = stories.filter((story) => storyMatchesFilter(story, filter))

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-xs text-muted-foreground">
        {catchUpWindow.projectName} · {catchUpWindow.startLabel} – {catchUpWindow.endLabel} ·{" "}
        {catchUpWindow.workingDays} working days · 5 important stories
      </p>
      <h1 className="mt-3 text-2xl font-medium tracking-tight">All changes</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {stories.length} meaningful changes from the absence. This is not the activity log.
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5" role="group" aria-label="Filter changes">
        {filters.map((item) => {
          const selected = filter === item.id
          return (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={selected ? "default" : "outline"}
              aria-pressed={selected}
              onClick={() => onFilter(item.id)}
            >
              {item.label}
            </Button>
          )
        })}
      </div>
      <ul className="mt-4 divide-y rounded-lg border">
        {visible.map((story) => {
          const viewed = viewedIds.includes(story.id)
          return (
            <li key={story.id}>
              <button
                type="button"
                onClick={() => onOpen(story.slug)}
                className={cn(
                  "flex w-full items-start justify-between gap-3 px-3 py-3 text-left outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <span className="min-w-0">
                  <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {typeLabels[story.type]}
                    <span aria-hidden="true"> · </span>
                    {story.dateLabel}
                    {story.guided ? null : (
                      <>
                        <span aria-hidden="true"> · </span>
                        Related
                      </>
                    )}
                  </span>
                  <span className="mt-1 block text-sm font-medium">{story.title}</span>
                </span>
                {viewed ? (
                  <span className="shrink-0 text-xs text-muted-foreground">Viewed</span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No changes in this group.</p>
      ) : null}
    </div>
  )
}
