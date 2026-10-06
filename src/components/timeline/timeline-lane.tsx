import type { TimelineDateRange } from "@/types"
import type { ResolvedTimelineEvent } from "@/utils/history"
import { eachIsoDay } from "@/utils/history"
import { formatGraphDate } from "@/utils/context-graph"
import { TimelineEvent } from "@/components/timeline/timeline-event"

export function TimelineBoard({
  lanes,
  range,
  selectedId,
  onSelect,
}: {
  lanes: { id: string; title: string; summary: string; events: ResolvedTimelineEvent[] }[]
  range: TimelineDateRange
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const days = eachIsoDay(range.from, range.to)
  if (days.length === 0) {
    return <EmptyWindow range={range} />
  }

  return (
    <div className="h-full overflow-auto">
      <div
        className="grid min-w-[68rem] gap-x-0 px-3 py-4"
        style={{ gridTemplateColumns: `11rem repeat(${days.length}, minmax(8.25rem, 1fr))` }}
      >
        <div />
        {days.map((day) => (
          <div key={day} className="px-1.5 pb-2 text-xs font-medium text-muted-foreground">
            {formatGraphDate(day)}
          </div>
        ))}
        {lanes.map((lane) => (
          <LaneRow key={lane.id} lane={lane} days={days} selectedId={selectedId} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

function LaneRow({
  lane,
  days,
  selectedId,
  onSelect,
}: {
  lane: { id: string; title: string; summary: string; events: ResolvedTimelineEvent[] }
  days: string[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <>
      <div data-lane={lane.id} className="border-t py-3 pr-3">
        <h2 className="text-sm font-medium">{lane.title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{lane.summary}</p>
        {lane.id === "authentication" ? <DecisionEvolution /> : null}
        {lane.events.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">Nothing in this window.</p>
        ) : null}
      </div>
      {days.map((day) => {
        const events = lane.events.filter((event) => event.date === day)
        return (
          <div key={`${lane.id}-${day}`} className="flex flex-col gap-2 border-t border-l px-1.5 py-3">
            {events.map((event) => (
              <TimelineEvent key={event.id} event={event} selected={selectedId === event.id} onSelect={onSelect} />
            ))}
          </div>
        )
      })}
    </>
  )
}

export function TimelineChronology({
  lanes,
  range,
  selectedId,
  onSelect,
}: {
  lanes: { id: string; title: string; summary: string; events: ResolvedTimelineEvent[] }[]
  range: TimelineDateRange
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const any = lanes.some((lane) => lane.events.length > 0)
  if (!any) return <EmptyWindow range={range} />
  return (
    <div className="h-full overflow-auto">
      {lanes.map((lane) => (
        <section key={lane.id} data-lane={lane.id} className="border-b px-3 py-4">
          <h2 className="text-sm font-medium">{lane.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{lane.summary}</p>
          {lane.id === "authentication" ? <DecisionEvolution /> : null}
          {lane.events.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Nothing in this window.</p>
          ) : (
            <ol className="mt-3 space-y-2">
              {lane.events.map((event) => (
                <li key={event.id}>
                  <TimelineEvent event={event} selected={selectedId === event.id} onSelect={onSelect} />
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}
    </div>
  )
}

function DecisionEvolution() {
  return (
    <p className="mt-2 text-xs leading-relaxed">
      <span className="font-medium">Auth0 Selected</span>
      <span className="text-muted-foreground"> is </span>
      <span className="font-medium tracking-wide uppercase">Superseded</span>
      <span className="text-muted-foreground">. </span>
      <span className="font-medium">Custom Authentication Architecture</span>
      <span className="text-muted-foreground"> is </span>
      <span className="font-medium tracking-wide uppercase">Current</span>
      <span className="text-muted-foreground">.</span>
    </p>
  )
}

function EmptyWindow({ range }: { range: TimelineDateRange }) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        Nothing in this project falls between {range.from} and {range.to}. The Atlas story is Sep 16–Sep 23.
      </p>
    </div>
  )
}
