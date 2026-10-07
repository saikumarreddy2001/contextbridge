import { useEffect, useRef } from "react"
import type { ContextEdge, ContextNode } from "@/types"
import { nodeTypeLabel } from "@/utils/context-graph"

export function EdgeDetailPanel({
  edge,
  nodes,
  onSelectNode,
}: {
  edge: ContextEdge
  nodes: ContextNode[]
  onSelectNode: (id: string) => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const source = nodes.find((node) => node.id === edge.source)
  const target = nodes.find((node) => node.id === edge.target)

  useEffect(() => {
    headingRef.current?.focus()
  }, [edge.id])

  return (
    <div className="overflow-y-auto px-4 py-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Relationship</p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-lg font-medium outline-none">
        {edge.label}
      </h2>
      <p className="mt-3 text-sm leading-relaxed">{edge.description}</p>
      {edge.confidenceSource === "ai_inferred" ? (
        <p className="mt-2 text-sm text-muted-foreground">AI inferred. The dashed line is not a deterministic relationship.</p>
      ) : null}
      {edge.confidenceSource === "ai_inferred" ? (
        <div className="mt-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Evidence</p>
          <ul className="mt-2 space-y-1">
            {(edge.evidence ?? []).map((item) => (
              <li key={item.id} className="text-sm">
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-4 space-y-2">
        {source ? (
          <button
            type="button"
            onClick={() => onSelectNode(source.id)}
            className="flex min-h-11 w-full flex-col items-start rounded-md border px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              From · {nodeTypeLabel[source.type]}
            </span>
            <span className="text-sm font-medium">{source.title}</span>
          </button>
        ) : null}
        {target ? (
          <button
            type="button"
            onClick={() => onSelectNode(target.id)}
            className="flex min-h-11 w-full flex-col items-start rounded-md border px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              To · {nodeTypeLabel[target.type]}
            </span>
            <span className="text-sm font-medium">{target.title}</span>
          </button>
        ) : null}
      </div>
    </div>
  )
}
