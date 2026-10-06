import { catchUpWindow } from "@/data/catch-up-stories"
import type { CatchUpStory } from "@/types"
import { cn } from "@/utils/cn"

export function StoryNavigator({
  stories,
  activeId,
  viewedIds,
  onSelect,
  onViewAll,
}: {
  stories: CatchUpStory[]
  activeId: string
  viewedIds: string[]
  onSelect: (slug: string) => void
  onViewAll: () => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {catchUpWindow.projectName} · {catchUpWindow.startLabel} – {catchUpWindow.endLabel} ·{" "}
          {catchUpWindow.workingDays} working days · {stories.length} important stories
        </p>
        <button
          type="button"
          onClick={onViewAll}
          className="shrink-0 text-xs text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          View Everything
        </button>
      </div>
      <nav aria-label="Catch-up stories">
        <ol className="flex gap-2 overflow-x-auto pb-1">
          {stories.map((story) => {
            const current = story.id === activeId
            const viewed = viewedIds.includes(story.id)
            return (
              <li key={story.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onSelect(story.slug)}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-left text-xs transition-colors motion-reduce:transition-none outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
                    current && "border-foreground/30 bg-accent text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full border border-foreground/40",
                      (current || viewed) && "border-foreground bg-foreground",
                    )}
                    aria-hidden="true"
                  />
                  <span>{story.navigatorLabel}</span>
                  {viewed && !current ? <span className="text-muted-foreground">Viewed</span> : null}
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
