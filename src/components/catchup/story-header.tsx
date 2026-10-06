import type { CatchUpItem } from "@/types"

const priorityLabels = {
  critical: "Critical",
  high: "High priority",
  medium: "Medium priority",
  normal: "Normal priority",
} as const

export function StoryHeader({ item }: { item: CatchUpItem }) {
  return (
    <header>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {item.kindLabel}
        <span aria-hidden="true"> · </span>
        <span>{priorityLabels[item.priority]}</span>
      </p>
      <h1 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">{item.title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
    </header>
  )
}