import { ArrowDown, ArrowRight } from "lucide-react"
import type { CatchUpChange } from "@/types"

export function ChangeComparison({ comparison }: { comparison: CatchUpChange }) {
  return (
    <div className="mt-6">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch">
        <div className="rounded-lg border px-4 py-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {comparison.beforeLabel}
          </p>
          <p className="mt-1 text-base font-medium">{comparison.beforeValue}</p>
        </div>
        <div className="flex items-center justify-center text-muted-foreground" aria-hidden="true">
          <ArrowDown className="size-4 sm:hidden" />
          <ArrowRight className="hidden size-4 sm:block" />
        </div>
        <div className="rounded-lg border border-foreground/25 px-4 py-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {comparison.afterLabel}
          </p>
          <p className="mt-1 text-base font-medium">{comparison.afterValue}</p>
        </div>
      </div>
    </div>
  )
}
