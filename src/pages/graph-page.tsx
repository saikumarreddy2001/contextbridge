import { ReactFlowProvider, useReactFlow } from "@xyflow/react"
import { ContextGraph } from "@/components/graph/context-graph"
import { EdgeDetailPanel } from "@/components/graph/edge-detail-panel"
import { GraphToolbar } from "@/components/graph/graph-toolbar"
import { NodeDetailPanel } from "@/components/graph/node-detail-panel"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { DataNotice } from "@/components/common/data-notice"
import { useContextGraph } from "@/hooks/use-context-graph"
import { useMinWidth } from "@/hooks/use-media"
import { useProjectBundle } from "@/services/api/bundle"
export function GraphPage() {
  return (
    <ReactFlowProvider>
      <GraphWorkspace />
    </ReactFlowProvider>
  )
}

function GraphWorkspace() {
  const bundle = useProjectBundle()
  const graph = useContextGraph()
  const desktop = useMinWidth(1024)
  const { fitView } = useReactFlow()
  if (bundle.status === "loading") return <DataNotice status="loading" />
  if (bundle.status === "error") return <DataNotice status="error" message={bundle.message} />
  const projectName = graph.projects.find((item) => item.id === graph.activeFilters.projectId)?.name

  return (
    <div className="flex h-[calc(100svh-4rem)] min-h-[28rem] flex-col">
      {bundle.status === "demo" ? <DataNotice status="demo" /> : null}
      <GraphToolbar graph={graph} onFit={() => void fitView({ padding: 0.12, duration: 180 })} />
      <div className="relative min-h-0 flex-1">
        <ContextGraph graph={graph} />
        {graph.visibleNodes.length === 0 ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <p className="max-w-sm text-center text-sm text-muted-foreground">
              {projectName ?? "This project"} has no context graph for these filters. Project Atlas holds the
              authentication story.
            </p>
          </div>
        ) : null}
        {desktop && graph.panelOpen ? (
          <aside
            aria-label="Graph detail"
            className="absolute inset-y-0 right-0 z-20 w-[22rem] overflow-hidden border-l bg-background"
          >
            <Detail graph={graph} />
          </aside>
        ) : null}
      </div>
      {desktop ? null : (
        <Sheet open={graph.panelOpen} onOpenChange={(open) => !open && graph.closePanel()}>
          <SheetContent
            side="bottom"
            className="inset-0 h-auto max-h-none w-full gap-0 overflow-y-auto rounded-none p-0 data-[side=bottom]:inset-0 data-[side=bottom]:h-auto data-[side=bottom]:max-h-none"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Graph detail</SheetTitle>
              <SheetDescription>Details for the selected node or relationship</SheetDescription>
            </SheetHeader>
            <Detail graph={graph} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

function Detail({ graph }: { graph: ReturnType<typeof useContextGraph> }) {
  if (graph.selectedNode) {
    return (
      <NodeDetailPanel
        node={graph.selectedNode}
        nodes={graph.nodes}
        edges={graph.edges}
        traceMode={graph.traceMode}
        canTraceWhy={graph.canTraceWhy}
        canTraceImpact={graph.canTraceImpact}
        onTrace={graph.startTrace}
        onExitTrace={graph.exitTrace}
      />
    )
  }
  if (graph.selectedEdge) {
    return <EdgeDetailPanel edge={graph.selectedEdge} nodes={graph.nodes} onSelectNode={(id) => graph.selectNode(id, true)} />
  }
  return null
}
