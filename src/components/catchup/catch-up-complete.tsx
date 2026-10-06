import { Link } from "react-router-dom"
import { catchUpAttention, catchUpWindow } from "@/data/catch-up-stories"
import { Button } from "@/components/ui/button"

export function CatchUpComplete({
  storyCount,
  decisionCount,
  requirementCount,
  blockerCount,
  onReviewAll,
  onOpenStory,
}: {
  storyCount: number
  decisionCount: number
  requirementCount: number
  blockerCount: number
  onReviewAll: () => void
  onOpenStory: (slug: string) => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col px-4 py-16">
      <p className="text-xs text-muted-foreground">
        {catchUpWindow.projectName} · {catchUpWindow.rangeLabel}
      </p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight">You&apos;re caught up</h1>
      <p className="mt-4 text-sm">During your absence:</p>
      <ul className="mt-3 space-y-1 text-sm">
        <li>{storyCount} important stories reviewed</li>
        <li>{decisionCount} decisions understood</li>
        <li>{requirementCount} requirements changed</li>
        <li>{blockerCount} blocker needs attention</li>
      </ul>
      <h2 className="mt-10 text-sm font-medium">What needs your attention now</h2>
      <ol className="mt-3 space-y-2">
        {catchUpAttention.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onOpenStory(item.slug)}
              className="text-left text-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              {index + 1}. {item.title}
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Button asChild>
          <Link to="/overview">Return to Overview</Link>
        </Button>
        <Button type="button" variant="outline" onClick={onReviewAll}>
          Review All Changes
        </Button>
      </div>
    </div>
  )
}
