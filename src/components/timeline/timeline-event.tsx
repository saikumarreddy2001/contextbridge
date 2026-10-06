import type { ResolvedTimelineEvent } from "@/utils/history"
import { eventTypeLabel } from "@/utils/history"
import { formatGraphDate } from "@/utils/context-graph"
import { cn } from "@/utils/cn"

export function TimelineEvent({
  event,
  selected,
  onSelect,
}: {
  event: ResolvedTimelineEvent
  selected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      id={`timeline-event-${event.id}`}
      type="button"
      data-event-id={event.id}
      data-evolution={event.evolution ?? undefined}
      aria-pressed={selected}
      onClick={() => onSelect(event.id)}
      className={cn(
        "flex min-h-11 w-full flex-col rounded-md border bg-card px-2.5 py-2 text-left text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "ring-2 ring-foreground",
        event.evolution === "superseded" && "border-dashed",
        event.evolution === "current" && "border-foreground",
      )}
    >
      <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {eventTypeLabel(event.type)}
      </span>
      <span className="mt-0.5 text-sm leading-snug font-medium">{event.title}</span>
      <span className="mt-1 text-xs text-muted-foreground">
        {formatGraphDate(event.date)}
        <span aria-hidden="true"> · </span>
        {event.status}
      </span>
    </button>
  )
}
