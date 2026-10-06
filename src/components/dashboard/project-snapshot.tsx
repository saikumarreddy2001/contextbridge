import type { Project } from "@/types"

export function ProjectSnapshot({ project }: { project: Project }) {
  const rows = [
    { label: "Project", value: project.name },
    { label: "Status", value: project.statusLabel },
    { label: "Current focus", value: project.currentFocus },
    { label: "Important", value: project.importantLabel },
    { label: "Blocker", value: project.blockerLabel },
  ]

  return (
    <section aria-labelledby="snapshot-heading" className="lg:max-w-xs">
      <h2 id="snapshot-heading" className="text-sm font-medium">
        Project snapshot
      </h2>
      <dl className="mt-3 rounded-lg border bg-card">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[7rem_1fr] gap-2 border-b px-3 py-2 last:border-b-0">
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="text-sm">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
