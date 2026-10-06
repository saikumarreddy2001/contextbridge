import { Link } from "react-router-dom"
import { catchUpWindow } from "@/data/catch-up-stories"
import { Button } from "@/components/ui/button"
import type { CatchUpKind } from "@/types"

export function CatchUpComplete({
  reviewedCount,
  summary,
}: {
  reviewedCount: number
  summary: { id: CatchUpKind; line: string }[]
}) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col px-4 py-16">
      <p className="text-xs text-muted-foreground">
        {catchUpWindow.projectName} · {catchUpWindow.rangeLabel}
      </p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight">You&apos;re caught up</h1>
      <p className="mt-4 text-sm leading-relaxed">
        You reviewed the {reviewedCount} changes that matter most from the {catchUpWindow.workingDays} working days
        you were away.
      </p>
      <ul className="mt-6 space-y-1 text-sm">
        {summary.map((item) => (
          <li key={item.id}>{item.line}</li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="min-h-11">
          <Link to="/timeline">Explore Full Timeline</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link to="/overview">Return to Overview</Link>
        </Button>
      </div>
    </div>
  )
}
