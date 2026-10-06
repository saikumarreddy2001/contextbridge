import { ChevronDown } from "lucide-react"
import type { WhyChangedPoint } from "@/types"
import { cn } from "@/utils/cn"

export function WhyChanged({
  points,
  open,
  onToggle,
}: {
  points: WhyChangedPoint[]
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="mt-6">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
        aria-controls="why-changed"
        onClick={onToggle}
      >
        Why did this change?
        <ChevronDown className={cn("size-4 transition-transform motion-reduce:transition-none", open && "rotate-180")} />
      </button>
      {open ? (
        <ol id="why-changed" className="mt-4 space-y-4 border-l pl-4">
          {points.map((point) => (
            <li key={point.id}>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {point.label}
              </p>
              <p className="mt-1 text-sm leading-relaxed">{point.detail}</p>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}
