import { StoryStep } from "@/components/catchup/story-step"
import type { StoryStep as StoryStepModel } from "@/types"

export function StorySequence({ steps }: { steps: StoryStepModel[] }) {
  return (
    <ol className="mt-8 flex flex-col lg:flex-row lg:items-start" aria-label="How this change unfolded">
      {steps.map((step, index) => (
        <StoryStep key={step.id} step={step} index={index} isLast={index === steps.length - 1} />
      ))}
    </ol>
  )
}
