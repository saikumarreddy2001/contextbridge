import {
  FileText,
  GitPullRequest,
  MessagesSquare,
  SquareKanban,
  Users,
} from "lucide-react"
import type { SourceKind } from "@/types"
import { sourceLabels } from "@/utils/labels"
import { cn } from "@/utils/cn"

const icons = {
  meeting: Users,
  github: GitPullRequest,
  jira: SquareKanban,
  document: FileText,
  discussion: MessagesSquare,
} as const

export function SourceIcon({
  source,
  className,
}: {
  source: SourceKind
  className?: string
}) {
  const Icon = icons[source]
  return <Icon className={cn("size-3.5", className)} aria-hidden="true" />
}

export function SourceLabel({ source }: { source: SourceKind }) {
  return <span>{sourceLabels[source]}</span>
}
