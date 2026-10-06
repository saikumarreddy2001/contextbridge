import type { Status } from "@/types"
import { statusLabels } from "@/utils/labels"
import { cn } from "@/utils/cn"

export function StatusLabel({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full bg-muted-foreground/70",
          status === "blocked" && "bg-destructive",
          status === "in-progress" && "bg-foreground/70",
          (status === "resolved" || status === "completed") && "bg-primary/80",
        )}
        aria-hidden="true"
      />
      {statusLabels[status]}
    </span>
  )
}
