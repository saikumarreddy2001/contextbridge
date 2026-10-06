import { FileDiff, ListChecks, MessagesSquare, OctagonAlert, Scale } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { getCatchUpStats } from "@/data/selectors"

const icons: Record<string, LucideIcon> = {
  decisions: Scale,
  requirements: FileDiff,
  blockers: OctagonAlert,
  tasks: ListChecks,
  discussions: MessagesSquare,
}

export function CatchUpSummary({ projectId, projectName }: { projectId: string; projectName: string }) {
  const stats = getCatchUpStats(projectId)

  return (
    <section aria-labelledby="catch-up-summary-heading" className="border-y py-3">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2
          id="catch-up-summary-heading"
          className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
        >
          Catch-up
        </h2>
        <p className="text-xs text-muted-foreground">{projectName} · 8 working days</p>
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {stats.map((stat) => {
          const Icon = icons[stat.id] ?? Scale
          return (
            <li key={stat.id} className="inline-flex items-center gap-1.5 text-sm">
              <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="font-medium text-foreground tabular-nums">{stat.count}</span>
              <span className="text-muted-foreground">{stat.label}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
