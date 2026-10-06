import type { CatchUpItem } from "@/types"
import { cn } from "@/utils/cn"

export function CatchUpProgress({
  items,
  activeId,
  onSelect,
}: {
  items: CatchUpItem[]
  activeId: string
  onSelect: (slug: string) => void
}) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Catch-up progress">
      {items.map((item, index) => {
        const current = item.id === activeId
        const label = String(index + 1).padStart(2, "0")
        return (
          <li key={item.id}>
            <button
              type="button"
              aria-current={current ? "step" : undefined}
              aria-label={`${label}. ${item.title}`}
              onClick={() => onSelect(item.slug)}
              className={cn(
                "flex min-h-11 min-w-11 items-center justify-center rounded-md border px-2 text-xs font-medium tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring",
                current ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:bg-accent",
              )}
            >
              {label}
            </button>
          </li>
        )
      })}
    </ol>
  )
}
