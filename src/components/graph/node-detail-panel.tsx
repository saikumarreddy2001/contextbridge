import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { TraceControls } from "@/components/graph/trace-controls"
import { Button } from "@/components/ui/button"
import { timelineEventIdForNode } from "@/data/timeline"
import { projects } from "@/data/projects"
import type { TraceMode } from "@/hooks/use-context-graph"
import type { ContextEdge, ContextNode } from "@/types"
import { formatGraphDate, nodeTypeLabel, relationshipIncoming, relationshipOutgoing } from "@/utils/context-graph"

export function NodeDetailPanel({
  node,
  nodes,
  edges,
  traceMode,
  canTraceWhy,
  canTraceImpact,
  onTrace,
  onExitTrace,
}: {
  node: ContextNode
  nodes: ContextNode[]
  edges: ContextEdge[]
  traceMode: TraceMode | null
  canTraceWhy: boolean
  canTraceImpact: boolean
  onTrace: (mode: TraceMode) => void
  onExitTrace: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const project = projects.find((item) => item.id === node.projectId)
  const incoming = edges.filter((edge) => edge.target === node.id)
  const outgoing = edges.filter((edge) => edge.source === node.id)

  useEffect(() => {
    headingRef.current?.focus()
  }, [node.id])

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="px-4 py-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{nodeTypeLabel[node.type]}</p>
        <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-lg font-medium outline-none">
          {node.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatGraphDate(node.date)}
          <span aria-hidden="true"> · </span>
          {node.status}
        </p>
        <p className="mt-3 text-sm leading-relaxed">{node.description}</p>
        {timelineEventIdForNode(node.id) ? (
          <div className="mt-4">
            <Button variant="outline" className="min-h-11" asChild>
              <Link to={`/timeline?focus=${timelineEventIdForNode(node.id)}`}>View in Timeline</Link>
            </Button>
          </div>
        ) : null}
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Project</dt>
            <dd className="mt-1">{project?.name ?? node.projectId}</dd>
          </div>
          {node.people.length > 0 ? (
            <div>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">People</dt>
              <dd className="mt-1">{node.people.join(", ")}</dd>
            </div>
          ) : null}
          {node.sourceRefs.length > 0 ? (
            <div>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Related sources</dt>
              <dd className="mt-1">
                <ul className="space-y-1">
                  {node.sourceRefs.map((source) => (
                    <li key={source.id}>{source.label}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>
        <RelationshipList title="Incoming relationships" edges={incoming} nodes={nodes} direction="incoming" />
        <RelationshipList title="Outgoing relationships" edges={outgoing} nodes={nodes} direction="outgoing" />
        <TraceControls
          traceMode={traceMode}
          canTraceWhy={canTraceWhy}
          canTraceImpact={canTraceImpact}
          onTrace={onTrace}
          onExitTrace={onExitTrace}
        />
      </div>
    </div>
  )
}

function RelationshipList({
  title,
  edges,
  nodes,
  direction,
}: {
  title: string
  edges: ContextEdge[]
  nodes: ContextNode[]
  direction: "incoming" | "outgoing"
}) {
  if (edges.length === 0) return null
  return (
    <div className="mt-4">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</h3>
      <ul className="mt-2 space-y-3">
        {edges.map((edge) => {
          const other = direction === "incoming" ? edge.source : edge.target
          const otherTitle = nodes.find((item) => item.id === other)?.title ?? other
          const prefix = direction === "incoming" ? relationshipIncoming[edge.relationshipType] : relationshipOutgoing[edge.relationshipType]
          return (
            <li key={edge.id} className="text-sm leading-relaxed">
              <p>
                <span className="font-medium">
                  {prefix}: {otherTitle}
                </span>
              </p>
              <p className="text-muted-foreground">{edge.description}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
