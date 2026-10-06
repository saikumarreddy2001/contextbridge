import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { projects } from "@/data/projects"
import type { ResolvedTimelineEvent } from "@/utils/history"
import { eventTypeLabel, nodeExists } from "@/utils/history"
import { formatGraphDate } from "@/utils/context-graph"

export function TimelineDetailPanel({
  event,
  events,
  onSelect,
  onClose,
}: {
  event: ResolvedTimelineEvent
  events: ResolvedTimelineEvent[]
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const project = projects.find((item) => item.id === event.projectId)
  const related = event.relatedEventIds
    .map((id) => events.find((item) => item.id === id))
    .filter((item): item is ResolvedTimelineEvent => Boolean(item))

  useEffect(() => {
    headingRef.current?.focus()
  }, [event.id])

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {eventTypeLabel(event.type)}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 shrink-0 rounded-md border px-3 text-sm"
          >
            Close
          </button>
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-lg font-medium outline-none">
          {event.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatGraphDate(event.date)}
          <span aria-hidden="true"> · </span>
          {event.status}
        </p>
        <p className="mt-3 text-sm leading-relaxed">{event.description}</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Project</dt>
            <dd className="mt-1">{project?.name ?? event.projectId}</dd>
          </div>
          {event.people.length > 0 ? (
            <div>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">People</dt>
              <dd className="mt-1">{event.people.join(", ")}</dd>
            </div>
          ) : null}
          {event.sources.length > 0 ? (
            <div>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Sources</dt>
              <dd className="mt-1">
                <ul className="space-y-1">
                  {event.sources.map((source) => (
                    <li key={source.id}>{source.label}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>
        {related.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Related events</h3>
            <ul className="mt-2 space-y-1">
              {related.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className="min-h-11 w-full rounded-md px-2 text-left text-sm hover:bg-muted"
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {nodeExists(event.graphNodeId) ? (
          <div className="mt-4">
            <Button variant="outline" className="min-h-11" asChild>
              <Link to={`/graph?focus=${event.graphNodeId}`}>Explore Context</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
