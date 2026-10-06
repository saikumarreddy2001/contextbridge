import { ChevronDown } from "lucide-react"
import type { CatchUpReason } from "@/types"
import { cn } from "@/utils/cn"

export function WhyChanged({
  reason,
  open,
  onToggle,
}: {
  reason: CatchUpReason
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="mt-6">
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
        aria-controls="why-changed"
        onClick={onToggle}
      >
        {reason.prompt}
        <ChevronDown
          className={cn("size-4 transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      <div
        id="why-changed"
        className={cn(
          "grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className={cn("overflow-hidden", !open && "invisible")} aria-hidden={!open}>
          <ol className="mt-4 space-y-4 border-l pl-4">
            {reason.points.map((point) => (
              <li key={point.id}>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{point.label}</p>
                <p className="mt-1 text-sm leading-relaxed">{point.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
