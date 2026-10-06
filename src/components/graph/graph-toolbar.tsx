import { GraphFilters } from "@/components/graph/graph-filters"
import { GraphSearch } from "@/components/graph/graph-search"
import type { useContextGraph } from "@/hooks/use-context-graph"

type GraphState = ReturnType<typeof useContextGraph>

export function GraphToolbar({
  graph,
  onFit,
}: {
  graph: GraphState
  onFit: () => void
}) {
  return (
    <div className="flex flex-col gap-3 border-b px-3 py-3 sm:px-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-base font-medium tracking-tight">Context Graph</h1>
        <GraphSearch
          query={graph.searchQuery}
          results={graph.searchResults}
          onQuery={graph.setSearchQuery}
          onSelect={(id) => graph.selectNode(id, true)}
        />
        <button
          type="button"
          onClick={onFit}
          className="min-h-11 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Fit view
        </button>
      </div>
      <GraphFilters
        kind={graph.activeFilters.kind}
        projectId={graph.activeFilters.projectId}
        projects={graph.projects}
        from={graph.activeFilters.from}
        to={graph.activeFilters.to}
        onKind={graph.setKind}
        onProject={graph.setProjectFilter}
        onDateRange={graph.setDateRange}
      />
    </div>
  )
}
