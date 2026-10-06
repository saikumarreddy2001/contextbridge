import type { ContextNode } from "@/types"
import { nodeTypeLabel } from "@/utils/context-graph"

export function GraphSearch({
  query,
  results,
  onQuery,
  onSelect,
}: {
  query: string
  results: ContextNode[]
  onQuery: (query: string) => void
  onSelect: (id: string) => void
}) {
  const listId = "graph-search-results"
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor="graph-search" className="sr-only">
        Search the graph
      </label>
      <input
        id="graph-search"
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder="Search nodes"
        role="combobox"
        aria-expanded={query.trim().length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {query.trim() ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-sm"
        >
          {results.length === 0 ? (
            <li className="px-2 py-2 text-sm text-muted-foreground">No matching nodes.</li>
          ) : (
            results.map((node) => (
              <li key={node.id} role="option">
                <button
                  type="button"
                  onClick={() => onSelect(node.id)}
                  className="flex min-h-11 w-full flex-col items-start rounded-md px-2 py-1.5 text-left outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    {nodeTypeLabel[node.type]}
                  </span>
                  <span className="text-sm">{node.title}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
}
