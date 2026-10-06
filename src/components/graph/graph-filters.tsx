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
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <div className="flex gap-1 overflow-x-auto pb-1" role="group" aria-label="Filter by type">
        {kinds.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={kind === item.id}
            onClick={() => onKind(item.id)}
            className={cn(
              "min-h-11 shrink-0 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
              kind === item.id && "border-foreground bg-foreground text-background",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex min-h-11 items-center gap-2 text-xs text-muted-foreground">
          Project
          <select
            aria-label="Project"
            value={projectId}
            onChange={(event) => onProject(event.target.value)}
            className="h-11 rounded-md border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {projects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-2 text-xs text-muted-foreground">
          From
          <input
            type="date"
            aria-label="From date"
            value={from}
            onChange={(event) => onDateRange(event.target.value, to)}
            className="h-11 rounded-md border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <label className="flex min-h-11 items-center gap-2 text-xs text-muted-foreground">
          To
          <input
            type="date"
            aria-label="To date"
            value={to}
            onChange={(event) => onDateRange(from, event.target.value)}
            className="h-11 rounded-md border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </div>
    </div>
  )
}
