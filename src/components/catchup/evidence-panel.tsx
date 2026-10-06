import { useEffect, useRef } from "react"
import { EvidenceItem } from "@/components/catchup/evidence-item"
import { SourceDetail } from "@/components/catchup/source-detail"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Evidence } from "@/types"

export function EvidencePanel({
  open,
  evidence,
  selectedId,
  onSelect,
  onClose,
  inline,
}: {
  open: boolean
  evidence: Evidence[]
  selectedId: string | null
  onSelect: (id: string) => void
  onClose: () => void
  inline: boolean
}) {
  const selected = evidence.find((item) => item.id === selectedId)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!open) return
    headingRef.current?.focus()
  }, [open, inline])

  if (!open) return null

  const body = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-3 px-3 py-3">
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="text-sm font-medium outline-none">
            Evidence
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Select a source. The relationship says how it connects to this change.
          </p>
        </div>
        {inline ? (
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        ) : null}
      </div>
      <ul className="space-y-0.5 overflow-y-auto px-1" aria-label="Sources">
        {evidence.map((item) => (
          <li key={item.id}>
            <EvidenceItem evidence={item} selected={item.id === selectedId} onSelect={onSelect} />
          </li>
        ))}
      </ul>
      {selected ? <SourceDetail evidence={selected} /> : null}
    </div>
  )

  if (inline) {
    return (
      <aside
        className="sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto rounded-lg border bg-card"
        aria-label="Evidence"
      >
        {body}
      </aside>
    )
  }

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side="bottom"
        className="inset-0 h-auto max-h-none w-full gap-0 overflow-y-auto rounded-none p-0 data-[side=bottom]:inset-0 data-[side=bottom]:h-auto data-[side=bottom]:max-h-none"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Evidence</SheetTitle>
          <SheetDescription>Sources connected to this change</SheetDescription>
        </SheetHeader>
        {body}
      </SheetContent>
    </Sheet>
  )
}
