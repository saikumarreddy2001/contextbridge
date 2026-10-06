import { SourceIcon, SourceLabel } from "@/components/common/source-icon"
import { StatusLabel } from "@/components/common/status-label"
import { getRecentActivity } from "@/data/selectors"

export function RecentActivity({
  projectId,
  projectName,
}: {
  projectId: string
  projectName: string
}) {
  const items = getRecentActivity(projectId)

  return (
    <section aria-labelledby="recent-activity-heading">
      <h2 id="recent-activity-heading" className="text-sm font-medium">
        Recent activity
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No recent activity on {projectName}.</p>
      ) : (
        <ol
          className="mt-3 max-h-[28rem] divide-y overflow-y-auto rounded-lg border bg-card"
          tabIndex={0}
          aria-label="Recent activity list"
        >
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 px-3 py-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
                <SourceIcon source={item.source} />
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                  <SourceLabel source={item.source} />
                  <span aria-hidden="true">·</span>
                  <time>{item.timeLabel}</time>
                  <span aria-hidden="true">·</span>
                  <span>{projectName}</span>
                  {item.status ? <StatusLabel status={item.status} /> : null}
                </p>
                <p className="mt-1 text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
