import { useEffect } from "react"
import { TimelineBoard, TimelineChronology } from "@/components/timeline/timeline-lane"
import { TimelineDetailPanel } from "@/components/timeline/timeline-detail-panel"
import { TimelineToolbar } from "@/components/timeline/timeline-toolbar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DataNotice } from "@/components/common/data-notice"
import { useTimeline } from "@/hooks/use-timeline"
import { useMinWidth } from "@/hooks/use-media"
import { useProjectBundle } from "@/services/api/bundle"

export function TimelineWorkspace() {
  const bundle = useProjectBundle()
  const timeline = useTimeline()
  const desktop = useMinWidth(1024)
  const focusId = timeline.focusedEvent?.id

  useEffect(() => {
    if (!focusId || bundle.status === "loading" || bundle.status === "error") return
    document.getElementById(`timeline-event-${focusId}`)?.scrollIntoView({ block: "nearest", inline: "center" })
  }, [focusId, bundle.status])

  if (bundle.status === "loading") return <DataNotice status="loading" />
  if (bundle.status === "error") return <DataNotice status="error" message={bundle.message} />

  return (
    <div className="flex h-[calc(100svh-4rem)] min-h-[28rem] flex-col">
      {bundle.status === "demo" ? <DataNotice status="demo" /> : null}
      <TimelineToolbar timeline={timeline} />
      <div className="relative min-h-0 flex-1">
        {desktop ? (
          <TimelineBoard
            lanes={timeline.lanes}
            range={timeline.dateRange}
            selectedId={focusId ?? null}
            onSelect={timeline.selectEvent}
          />
        ) : (
          <TimelineChronology
            lanes={timeline.lanes}
            range={timeline.dateRange}
            selectedId={focusId ?? null}
            onSelect={timeline.selectEvent}
          />
        )}
        {desktop && timeline.selectedEvent ? (
          <aside
            aria-label="Timeline detail"
            className="absolute inset-y-0 right-0 z-20 w-[22rem] overflow-hidden border-l bg-background"
          >
            <TimelineDetailPanel
              event={timeline.selectedEvent}
              events={timeline.events}
              onSelect={timeline.selectEvent}
              onClose={timeline.closePanel}
            />
          </aside>
        ) : null}
      </div>
      {desktop ? null : (
        <Sheet open={Boolean(timeline.selectedEvent)} onOpenChange={(open) => !open && timeline.closePanel()}>
          <SheetContent
            side="bottom"
            className="inset-0 h-auto max-h-none w-full gap-0 overflow-y-auto rounded-none p-0 data-[side=bottom]:inset-0 data-[side=bottom]:h-auto data-[side=bottom]:max-h-none"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Timeline detail</SheetTitle>
              <SheetDescription>Details for the selected timeline event</SheetDescription>
            </SheetHeader>
            {timeline.selectedEvent ? (
              <TimelineDetailPanel
                event={timeline.selectedEvent}
                events={timeline.events}
                onSelect={timeline.selectEvent}
                onClose={timeline.closePanel}
              />
            ) : null}
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
