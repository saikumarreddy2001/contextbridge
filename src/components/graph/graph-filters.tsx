import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { GraphKindFilter, Project } from "@/types"
import { cn } from "@/utils/cn"

const kinds: { id: GraphKindFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "decisions", label: "Decisions" },
  { id: "requirements", label: "Requirements" },
  { id: "code", label: "Code" },
  { id: "tasks", label: "Tasks" },
  { id: "meetings", label: "Meetings" },
  { id: "problems", label: "Problems" },
  { id: "blockers", label: "Blockers" },
]

const fieldClass =
  "h-11 min-w-0 rounded-md border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"

function TypeChips({
  kind,
  onKind,
}: {
  kind: GraphKindFilter
  onKind: (kind: GraphKindFilter) => void
}) {
  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by type">
      {kinds.map((item) => (
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
  )
}

function ScopeFields({
  projectId,
  projects,
  from,
  to,
  onProject,
  onDateRange,
  stacked,
}: {
  projectId: string
  projects: Project[]
  from: string
  to: string
  onProject: (projectId: string) => void
  onDateRange: (from: string, to: string) => void
  stacked?: boolean
}) {
  return (
    <div className={cn("flex gap-2", stacked ? "flex-col" : "flex-wrap items-center")}>
      <label className="flex min-h-11 shrink-0 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
        Project
        <select
          aria-label="Project"
          value={projectId}
          onChange={(event) => onProject(event.target.value)}
          className={cn(fieldClass, stacked && "w-full flex-1")}
        >
          {projects.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-h-11 shrink-0 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
        From
        <input
          type="date"
          aria-label="From date"
          value={from}
          onChange={(event) => onDateRange(event.target.value, to)}
          className={fieldClass}
        />
      </label>
      <label className="flex min-h-11 shrink-0 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
        To
        <input
          type="date"
          aria-label="To date"
          value={to}
          onChange={(event) => onDateRange(from, event.target.value)}
          className={fieldClass}
        />
      </label>
    </div>
  )
}

export function GraphFilters({
  kind,
  projectId,
  projects,
  from,
  to,
  onKind,
  onProject,
  onDateRange,
}: {
  kind: GraphKindFilter
  projectId: string
  projects: Project[]
  from: string
  to: string
  onKind: (kind: GraphKindFilter) => void
  onProject: (projectId: string) => void
  onDateRange: (from: string, to: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <TypeChips kind={kind} onKind={onKind} />
      <ScopeFields
        projectId={projectId}
        projects={projects}
        from={from}
        to={to}
        onProject={onProject}
        onDateRange={onDateRange}
      />
    </div>
  )
}

export function GraphFilterMenu({
  kind,
  projectId,
  projects,
  from,
  to,
  onKind,
  onProject,
  onDateRange,
}: {
  kind: GraphKindFilter
  projectId: string
  projects: Project[]
  from: string
  to: string
  onKind: (kind: GraphKindFilter) => void
  onProject: (projectId: string) => void
  onDateRange: (from: string, to: string) => void
}) {
  return (
    <Popover>
      <PopoverTrigger className="inline-flex min-h-11 shrink-0 items-center rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
        Filters
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(22rem,calc(100vw-1.5rem))] gap-3 p-3"
      >
        <TypeChips kind={kind} onKind={onKind} />
        <ScopeFields
          stacked
          projectId={projectId}
          projects={projects}
          from={from}
          to={to}
          onProject={onProject}
          onDateRange={onDateRange}
        />
      </PopoverContent>
    </Popover>
  )
}
