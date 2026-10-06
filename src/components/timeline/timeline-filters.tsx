import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Project, TimelineDateRange, TimelineKindFilter } from "@/types"
import { timelineKindOptions } from "@/utils/history"
import { cn } from "@/utils/cn"

const fieldClass =
  "h-11 min-w-0 rounded-md border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function TimelineFilters({
  kind,
  person,
  people,
  projectId,
  projects,
  range,
  onKind,
  onPerson,
  onProject,
  onRange,
  onPrevious,
  onNext,
  onProjectPeriod,
  stacked,
}: {
  kind: TimelineKindFilter
  person: string
  people: string[]
  projectId: string
  projects: Project[]
  range: TimelineDateRange
  onKind: (kind: TimelineKindFilter) => void
  onPerson: (person: string) => void
  onProject: (projectId: string) => void
  onRange: (range: TimelineDateRange) => void
  onPrevious: () => void
  onNext: () => void
  onProjectPeriod: () => void
  stacked?: boolean
}) {
  return (
    <div className={cn("flex gap-2", stacked ? "flex-col" : "flex-col")}>
      <div className="flex flex-wrap gap-1" role="group" aria-label="Filter timeline by type">
        {timelineKindOptions.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={kind === item.id}
            onClick={() => onKind(item.id)}
            className={cn(
              "min-h-11 shrink-0 rounded-md border px-3 text-sm whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring",
              kind === item.id && "border-foreground bg-foreground text-background",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={cn("flex gap-2", stacked ? "flex-col" : "flex-wrap items-center")}>
        <label className="flex min-h-11 shrink-0 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
          Project
          <select
            aria-label="Project"
            value={projectId}
            onChange={(event) => onProject(event.target.value)}
            className={fieldClass}
          >
            {projects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-11 shrink-0 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
          People
          <select
            aria-label="People"
            value={person}
            onChange={(event) => onPerson(event.target.value)}
            className={fieldClass}
          >
            <option value="all">Everyone</option>
            {people.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-11 shrink-0 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
          From
          <input
            type="date"
            aria-label="From date"
            value={range.from}
            onChange={(event) => onRange({ from: event.target.value, to: range.to })}
            className={fieldClass}
          />
        </label>
        <label className="flex min-h-11 shrink-0 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
          To
          <input
            type="date"
            aria-label="To date"
            value={range.to}
            onChange={(event) => onRange({ from: range.from, to: event.target.value })}
            className={fieldClass}
          />
        </label>
        <PeriodButtons onPrevious={onPrevious} onNext={onNext} onProjectPeriod={onProjectPeriod} />
      </div>
    </div>
  )
}

export function TimelineFilterMenu(props: {
  kind: TimelineKindFilter
  person: string
  people: string[]
  projectId: string
  projects: Project[]
  range: TimelineDateRange
  onKind: (kind: TimelineKindFilter) => void
  onPerson: (person: string) => void
  onProject: (projectId: string) => void
  onRange: (range: TimelineDateRange) => void
  onPrevious: () => void
  onNext: () => void
  onProjectPeriod: () => void
}) {
  return (
    <Popover>
      <PopoverTrigger className="inline-flex min-h-11 shrink-0 items-center rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
        Filters
      </PopoverTrigger>
      <PopoverContent align="end" className="max-h-[70svh] w-[min(22rem,calc(100vw-1.5rem))] overflow-y-auto p-3">
        <TimelineFilters {...props} stacked />
      </PopoverContent>
    </Popover>
  )
}

function PeriodButtons({
  onPrevious,
  onNext,
  onProjectPeriod,
}: {
  onPrevious: () => void
  onNext: () => void
  onProjectPeriod: () => void
}) {
  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label="Date navigation">
      <button type="button" onClick={onPrevious} className="min-h-11 rounded-md border px-3 text-sm whitespace-nowrap">
        Previous period
      </button>
      <button type="button" onClick={onProjectPeriod} className="min-h-11 rounded-md border px-3 text-sm whitespace-nowrap">
        Sep 16–23
      </button>
      <button type="button" onClick={onNext} className="min-h-11 rounded-md border px-3 text-sm whitespace-nowrap">
        Next period
      </button>
    </div>
  )
}
