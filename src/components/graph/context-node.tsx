import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import {
  AlertTriangle,
  FileText,
  GitPullRequest,
  MessagesSquare,
  OctagonAlert,
  SquareKanban,
  UserRound,
  Users,
  Waypoints,
} from "lucide-react"
import type { ContextNodeType } from "@/types"
import { formatGraphDate, nodeTypeLabel, type FlowNode } from "@/utils/context-graph"
import { cn } from "@/utils/cn"

const icons: Record<ContextNodeType, typeof Users> = {
  requirement: Waypoints,
  decision: Waypoints,
  discussion: MessagesSquare,
  meeting: Users,
  jira: SquareKanban,
  github: GitPullRequest,
  problem: AlertTriangle,
  blocker: OctagonAlert,
  document: FileText,
  person: UserRound,
}

export const ContextNodeView = memo(function ContextNodeView({ data }: NodeProps<FlowNode>) {
  const node = data.domain
  const Icon = icons[node.type]
  return (
    <div
      data-emphasis={data.emphasis}
      data-node-id={node.id}
      className={cn(
        "w-[220px] rounded-lg border bg-card px-3 py-2 text-card-foreground shadow-sm",
        node.type === "decision" && "border-foreground/50",
        node.type === "requirement" && "border-l-4 border-l-violet-700 dark:border-l-violet-400",
        node.type === "problem" && "border-l-4 border-l-amber-700 dark:border-l-amber-400",
        node.type === "blocker" && "border-l-4 border-l-destructive",
        data.emphasis === "dimmed" && "opacity-35",
        data.emphasis === "selected" && "ring-2 ring-foreground",
        data.emphasis === "related" && "ring-1 ring-foreground/40",
      )}
    >
      <Handle type="target" position={Position.Left} className="size-1 border-0 bg-transparent opacity-0" />
      <div className="flex items-center gap-1.5">
        <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          {nodeTypeLabel[node.type]}
        </span>
        <span className="ml-auto shrink-0 rounded border px-1 py-0.5 text-[10px] font-medium">{node.status}</span>
      </div>
      <p className="mt-1 text-sm leading-snug font-medium">{node.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{formatGraphDate(node.date)}</p>
      <Handle type="source" position={Position.Right} className="size-1 border-0 bg-transparent opacity-0" />
    </div>
  )
})

export const contextNodeTypes = { context: ContextNodeView }
