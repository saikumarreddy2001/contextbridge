import { TimelineFilterMenu, TimelineFilters } from "@/components/timeline/timeline-filters"
import type { useTimeline } from "@/hooks/use-timeline"
import { useMinWidth } from "@/hooks/use-media"

type TimelineState = ReturnType<typeof useTimeline>

export function TimelineToolbar({ timeline }: { timeline: TimelineState }) {
  const desktop = useMinWidth(1024)
  const filters = {
    kind: timeline.filters.kind,
    person: timeline.filters.person,
    people: timeline.people,
    projectId: timeline.filters.projectId,
    projects: timeline.projects,
    range: timeline.dateRange,
    onKind: timeline.setKind,
    onPerson: timeline.setPerson,
    onProject: timeline.setProject,
    onRange: timeline.setDateRange,
    onPrevious: timeline.previousPeriod,
    onNext: timeline.nextPeriod,
    onProjectPeriod: timeline.returnToProjectPeriod,
  }

  return (
    <div className="flex flex-col gap-2 border-b px-3 py-2 sm:px-4">
      <div className="flex items-center gap-2">
        <h1 className="shrink-0 text-base font-medium tracking-tight">Timeline</h1>
        <div className="relative min-w-0 flex-1">
          <label htmlFor="timeline-search" className="sr-only">
            Search the timeline
          </label>
          <input
            id="timeline-search"
            value={timeline.searchQuery}
            onChange={(event) => timeline.setSearchQuery(event.target.value)}
            placeholder="Search events"
            role="combobox"
            aria-expanded={timeline.searchResults.length > 0}
            aria-controls="timeline-search-results"
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {timeline.searchQuery.trim() ? (
            <ul
              id="timeline-search-results"
              role="listbox"
              aria-label="Timeline search results"
              className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-sm"
            >
              {timeline.searchResults.length === 0 ? (
                <li className="px-2 py-2 text-sm text-muted-foreground">No matching events.</li>
              ) : (
                timeline.searchResults.map((event) => (
                  <li key={event.id}>
                    <button
                      type="button"
                      role="option"
                      className="min-h-11 w-full rounded-md px-2 text-left text-sm hover:bg-muted"
                      onClick={() => timeline.selectEvent(event.id)}
                    >
                      {event.title}
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </div>
        {desktop ? null : <TimelineFilterMenu {...filters} />}
      </div>
      {desktop ? <TimelineFilters {...filters} /> : null}
    </div>
  )
}
