import { Button } from "@/components/ui/button"
import { catchUpWindow } from "@/data/catch-up-stories"

export function CatchUpIntro({
  activityCount,
  changeCount,
  onStart,
  onViewAll,
}: {
  activityCount: number
  changeCount: number
  onStart: () => void
  onViewAll: () => void
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-xl flex-col justify-center px-4 py-16">
      <h1 className="text-3xl font-medium tracking-tight">What you missed</h1>
      <p className="mt-3 text-sm text-muted-foreground">{catchUpWindow.rangeLabel}</p>
      <p className="mt-6 text-sm leading-relaxed">
        You were away for {catchUpWindow.workingDays} working days.
      </p>
      <div className="mt-8 space-y-4 border-y py-4">
        <p className="text-sm text-muted-foreground">
          During that time:{" "}
          <span className="font-medium text-foreground">{activityCount} activities</span> occurred
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">ContextBridge identified: </span>
          <span className="font-medium">{changeCount} meaningful changes</span>
        </p>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Activities are the background record. The meaningful changes are the ones that altered
        Project Atlas.
      </p>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={onStart}>
          Start My Catch-Up
        </Button>
        <Button type="button" variant="outline" onClick={onViewAll}>
          View Everything
        </Button>
      </div>
    </div>
  )
}
