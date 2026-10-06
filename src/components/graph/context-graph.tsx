import { useEffect } from "react"
import { Background, Controls, MiniMap, ReactFlow, getViewportForBounds, useReactFlow } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { contextNodeTypes } from "@/components/graph/context-node"
import { GraphLegend } from "@/components/graph/graph-legend"
import { useTheme } from "@/hooks/use-theme"
import type { useContextGraph } from "@/hooks/use-context-graph"
import { useMinWidth } from "@/hooks/use-media"

type GraphState = ReturnType<typeof useContextGraph>

export function ContextGraph({ graph }: { graph: GraphState }) {
  const { fitView, getNodesBounds, setViewport } = useReactFlow()
  const { theme } = useTheme()
  const desktop = useMinWidth(1024)

  useEffect(() => {
    if (!graph.fitNodeId || graph.traceMode) return
    const frame = requestAnimationFrame(() => {
      void fitView({ nodes: [{ id: graph.fitNodeId ?? "" }], padding: 0.5, duration: 0 })
    })
    return () => cancelAnimationFrame(frame)
  }, [graph.fitNodeId, graph.traceMode, fitView])

  useEffect(() => {
    if (!graph.traceMode || graph.tracePath.length < 2) return
    let cancelled = false
    let attempts = 0
    const frame = requestAnimationFrame(function fitTrace() {
      if (cancelled) return
      const bounds = getNodesBounds(graph.tracePath)
      if ((bounds.width < 10 || bounds.height < 10) && attempts < 10) {
        attempts += 1
        requestAnimationFrame(fitTrace)
        return
      }
      const flow = document.querySelector<HTMLElement>(".react-flow")
      if (!flow) return
      const panel = window.matchMedia("(min-width: 1024px)").matches ? 352 : 0
      const viewport = getViewportForBounds(bounds, flow.clientWidth, flow.clientHeight, 0.85, 1.2, {
        top: "40px",
        right: `${panel + 24}px`,
        bottom: "64px",
        left: "24px",
      })
      void setViewport(viewport, { duration: 0 })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [graph.traceMode, graph.tracePath, getNodesBounds, setViewport])

  return (
    <ReactFlow
      nodes={graph.flowNodes}
      edges={graph.flowEdges}
      nodeTypes={contextNodeTypes}
      colorMode={theme}
      fitView={!graph.fitNodeId && !graph.traceMode}
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
      {desktop ? (
        <MiniMap
          pannable
          zoomable
          bgColor="var(--background)"
          maskColor="color-mix(in oklch, var(--foreground) 14%, transparent)"
          maskStrokeColor="var(--foreground)"
          maskStrokeWidth={2}
          nodeColor="var(--foreground)"
          nodeStrokeColor="var(--foreground)"
          nodeStrokeWidth={8}
          nodeBorderRadius={6}
          ariaLabel="Graph overview"
          style={{ width: 200, height: 140 }}
        />
      ) : null}
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
