import { Link } from "react-router-dom"
import { HighlightText } from "@/components/common/highlight-text"
import { Button } from "@/components/ui/button"
import { projects } from "@/data/projects"
import type { SearchRecord } from "@/utils/history"
import { eventTypeLabel, nodeExists, snippetAround } from "@/utils/history"
import { formatGraphDate } from "@/utils/context-graph"

export function SearchResultItem({
  record,
  query,
  expanded,
  onToggle,
}: {
  record: SearchRecord
  query: string
  expanded: boolean
  onToggle: (id: string) => void
}) {
  const project = projects.find((item) => item.id === record.projectId)
  const snippet = expanded ? record.snippet : snippetAround(record.snippet, query)
  return (
    <article className="rounded-lg border bg-card px-3 py-3 text-card-foreground">
      <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {eventTypeLabel(record.type)}
      </p>
      <h3 className="mt-1 text-sm font-medium">
        <HighlightText text={record.title} query={query} />
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        <HighlightText text={snippet} query={query} />
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        {formatGraphDate(record.date)}
        <span aria-hidden="true"> · </span>
        {project?.name ?? record.projectId}
        {record.people.length > 0 ? (
          <>
            <span aria-hidden="true"> · </span>
            {record.people.join(", ")}
          </>
        ) : null}
        <span aria-hidden="true"> · </span>
        {record.status}
        <span aria-hidden="true"> · </span>
        {record.sourceLabel}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="min-h-11" aria-expanded={expanded} onClick={() => onToggle(record.id)}>
          View Details
        </Button>
        {record.timelineEventId ? (
          <Button variant="outline" className="min-h-11" asChild>
            <Link to={`/timeline?focus=${record.timelineEventId}`}>View in Timeline</Link>
          </Button>
        ) : null}
        {nodeExists(record.graphNodeId) ? (
          <Button variant="outline" className="min-h-11" asChild>
            <Link to={`/graph?focus=${record.graphNodeId}`}>Explore Context</Link>
          </Button>
        ) : null}
      </div>
    </article>
  )
}
