import { FileText, GitPullRequest, MessagesSquare, SquareKanban, Users } from "lucide-react"
import type { Evidence } from "@/types"
import { cn } from "@/utils/cn"

const icons = {
  meeting: Users,
  github: GitPullRequest,
  jira: SquareKanban,
  document: FileText,
  discussion: MessagesSquare,
} as const

export function EvidenceItem({
  evidence,
  selected,
  onSelect,
}: {
  evidence: Evidence
  selected: boolean
  onSelect: (id: string) => void
}) {
  const Icon = icons[evidence.kind]
  return (
    <button
      type="button"
      onClick={() => onSelect(evidence.id)}
      aria-pressed={selected}
      className={cn(
        "flex min-h-11 w-full items-start gap-2 rounded-md px-2 py-2.5 text-left outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
        selected && "bg-accent",
      )}
    >
      <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {evidence.kindLabel}
          <span aria-hidden="true"> · </span>
          {evidence.dateLabel}
        </span>
        <span className="mt-0.5 block text-sm font-medium">{evidence.title}</span>
      </span>
    </button>
  )
}
