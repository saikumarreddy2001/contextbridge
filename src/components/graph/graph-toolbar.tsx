import { GraphFilterMenu, GraphFilters } from "@/components/graph/graph-filters"
import { GraphSearch } from "@/components/graph/graph-search"
import type { useContextGraph } from "@/hooks/use-context-graph"
import { useMinWidth } from "@/hooks/use-media"

type GraphState = ReturnType<typeof useContextGraph>

export function GraphToolbar({
  graph,
  onFit,
}: {
  graph: GraphState
  onFit: () => void
}) {
  const desktop = useMinWidth(1024)
  const filters = {
    kind: graph.activeFilters.kind,
    projectId: graph.activeFilters.projectId,
    projects: graph.projects,
    from: graph.activeFilters.from,
    to: graph.activeFilters.to,
    onKind: graph.setKind,
    onProject: graph.setProjectFilter,
    onDateRange: graph.setDateRange,
  }

  return (
    <div className="flex flex-col gap-2 border-b px-3 py-2 sm:px-4">
      <div className="flex items-center gap-2">
        <h1 className="hidden text-base font-medium tracking-tight lg:block">Context Graph</h1>
        <GraphSearch
          query={graph.searchQuery}
          results={graph.searchResults}
          onQuery={graph.setSearchQuery}
          onSelect={(id) => graph.selectNode(id, true)}
        />
        <button
          type="button"
          onClick={onFit}
          className="min-h-11 shrink-0 rounded-md border px-3 text-sm whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Fit view
        </button>
        {desktop ? null : <GraphFilterMenu {...filters} />}
      </div>
      {desktop ? <GraphFilters {...filters} /> : null}
    </div>
  )
}
