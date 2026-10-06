import { useEffect } from "react"
import { Background, Controls, MiniMap, ReactFlow, useReactFlow } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { contextNodeTypes } from "@/components/graph/context-node"
import { GraphLegend } from "@/components/graph/graph-legend"
import { useTheme } from "@/hooks/use-theme"
import type { useContextGraph } from "@/hooks/use-context-graph"
import { useMinWidth } from "@/hooks/use-media"

type GraphState = ReturnType<typeof useContextGraph>

export function ContextGraph({ graph }: { graph: GraphState }) {
  const { fitView } = useReactFlow()
  const { theme } = useTheme()
  const desktop = useMinWidth(1024)

  useEffect(() => {
    if (!graph.fitNodeId) return
    const frame = requestAnimationFrame(() => {
      void fitView({ nodes: [{ id: graph.fitNodeId ?? "" }], padding: 0.5, duration: 180 })
    })
    return () => cancelAnimationFrame(frame)
  }, [graph.fitNodeId, fitView])

  useEffect(() => {
    if (!graph.traceMode || graph.tracePath.length < 2) return
    const frame = requestAnimationFrame(() => {
      void fitView({
        nodes: graph.tracePath.map((id) => ({ id })),
        padding: 0.2,
        duration: 180,
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [graph.traceMode, graph.tracePath, fitView])

  return (
    <ReactFlow
      nodes={graph.flowNodes}
      edges={graph.flowEdges}
      nodeTypes={contextNodeTypes}
      colorMode={theme}
      fitView={!graph.fitNodeId}
      fitViewOptions={{ padding: 0.12 }}
      minZoom={0.3}
      maxZoom={1.6}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
      onNodeClick={(_event, node) => graph.selectNode(node.id)}
      onEdgeClick={(_event, edge) => graph.selectEdge(edge.id)}
      onPaneClick={() => graph.closePanel()}
      className="h-full w-full"
      aria-label="Project Atlas context graph"
    >
      <Background />
      <Controls showInteractive={false} />
      {desktop ? <MiniMap pannable zoomable className="hidden md:block" /> : null}
      {graph.traceMode ? (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-md border bg-background px-2 py-1 shadow-sm">
          <span className="text-xs font-medium">
            {graph.traceMode === "why" ? "Tracing why" : "Tracing impact"}
          </span>
          <button
            type="button"
            onClick={graph.exitTrace}
            className="min-h-11 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Exit Trace
          </button>
        </div>
      ) : null}
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[70%]">
        <GraphLegend />
      </div>
    </ReactFlow>
  )
}
