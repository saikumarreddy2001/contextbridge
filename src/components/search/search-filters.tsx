import type { Project } from "@/types"
import { searchTypeOptions } from "@/utils/history"

const fieldClass =
  "h-11 min-w-0 rounded-md border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function SearchFilters({
  type,
  projectId,
  person,
  status,
  from,
  to,
  projects,
  people,
  statuses,
  onType,
  onProject,
  onPerson,
  onStatus,
  onDate,
}: {
  type: string
  projectId: string
  person: string
  status: string
  from: string
  to: string
  projects: Project[]
  people: string[]
  statuses: string[]
  onType: (type: string) => void
  onProject: (projectId: string) => void
  onPerson: (person: string) => void
  onStatus: (status: string) => void
  onDate: (from: string, to: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Search filters">
      <label className="flex min-h-11 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
        Type
        <select aria-label="Source type" value={type} onChange={(event) => onType(event.target.value)} className={fieldClass}>
          {searchTypeOptions().map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-h-11 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
        Project
        <select aria-label="Project" value={projectId} onChange={(event) => onProject(event.target.value)} className={fieldClass}>
          <option value="all">All projects</option>
          {projects.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-h-11 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
        Person
        <select aria-label="Person" value={person} onChange={(event) => onPerson(event.target.value)} className={fieldClass}>
          <option value="all">Everyone</option>
          {people.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-h-11 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
        Status
        <select aria-label="Status" value={status} onChange={(event) => onStatus(event.target.value)} className={fieldClass}>
          <option value="all">Any status</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-h-11 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
        From
        <input
          type="date"
          aria-label="From date"
          value={from}
          onChange={(event) => onDate(event.target.value, to)}
          className={fieldClass}
        />
      </label>
      <label className="flex min-h-11 items-center gap-2 text-xs whitespace-nowrap text-muted-foreground">
        To
        <input
          type="date"
          aria-label="To date"
          value={to}
          onChange={(event) => onDate(from, event.target.value)}
          className={fieldClass}
        />
      </label>
    </div>
  )
}
