import { ChevronRight } from "lucide-react"
import type { StoryStep as StoryStepModel } from "@/types"

export function StoryStep({
  step,
  index,
  isLast,
}: {
  step: StoryStepModel
  index: number
  isLast: boolean
}) {
  return (
    <li className="relative flex gap-3 pb-6 lg:flex-1 lg:flex-col lg:items-start lg:pb-0 lg:pr-3">
      <span className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border bg-background text-[10px] font-medium tabular-nums">
        {index + 1}
      </span>
      {isLast ? null : (
        <>
          <span
            className="absolute top-6 bottom-0 left-3 w-px bg-border lg:hidden"
            aria-hidden="true"
          />
          <span
            className="absolute top-3 left-6 hidden h-px w-[calc(100%-1.25rem)] bg-border lg:block"
            aria-hidden="true"
          />
          <ChevronRight
            className="absolute top-1.5 right-0 hidden size-3 text-muted-foreground lg:block"
            aria-hidden="true"
          />
        </>
      )}
      <div className="min-w-0 pt-0.5 lg:pt-3">
        <p className="text-xs font-medium text-muted-foreground">{step.dateLabel}</p>
        <p className="mt-0.5 text-sm font-medium leading-snug">{step.title}</p>
      </div>
    </li>
  )
}
