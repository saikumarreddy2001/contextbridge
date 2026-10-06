import { SearchFilters } from "@/components/search/search-filters"
import { SearchResults } from "@/components/search/search-results"
import { useContextSearch } from "@/hooks/use-context-search"

export function ContextSearch() {
  const search = useContextSearch()
  const query = search.filters.query.trim()
  const countLabel = `${search.results.length} ${search.results.length === 1 ? "result" : "results"}`

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-lg font-medium tracking-tight">Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">Project Atlas, September 16–23.</p>
      </div>
      <div>
        <label htmlFor="project-search" className="sr-only">
          Search across Project Atlas
        </label>
        <input
          id="project-search"
          value={search.filters.query}
          onChange={(event) => search.setQuery(event.target.value)}
          placeholder="Search across Project Atlas..."
          className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <SearchFilters
        type={search.filters.type}
        projectId={search.filters.projectId}
        person={search.filters.person}
        status={search.filters.status}
        from={search.filters.from}
        to={search.filters.to}
        projects={search.projects}
        people={search.people}
        statuses={search.statuses}
        onType={search.setType}
        onProject={search.setProject}
        onPerson={search.setPerson}
        onStatus={search.setStatus}
        onDate={search.setDateRange}
      />
      <p className="text-sm text-muted-foreground">{query ? countLabel : "Enter a query to search the Atlas story."}</p>
      {query && search.results.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matches for “{search.filters.query}” with these filters.</p>
      ) : null}
      {query ? (
        <SearchResults
          results={search.results}
          query={search.filters.query}
          selectedId={search.selected?.id ?? null}
          onToggle={search.selectResult}
        />
      ) : null}
    </div>
  )
}
