import type { CatchUpStory } from "@/types"

const priorityLabels = {
  critical: "Critical",
  high: "High priority",
  medium: "Medium priority",
  normal: "Normal priority",
} as const

export function StoryHeader({ story }: { story: CatchUpStory }) {
  return (
    <header>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {story.kicker}
        <span aria-hidden="true"> · </span>
        <span>{priorityLabels[story.priority]}</span>
      </p>
      <h1 className="mt-2 text-2xl font-medium tracking-tight">{story.title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{story.summary}</p>
    </header>
  )
}
