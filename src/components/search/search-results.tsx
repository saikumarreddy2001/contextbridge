import { SearchResultItem } from "@/components/search/search-result-item"
import type { SearchRecord } from "@/utils/history"
import { eventTypeLabel } from "@/utils/history"

export function SearchResults({
  results,
  query,
  selectedId,
  onToggle,
}: {
  results: SearchRecord[]
  query: string
  selectedId: string | null
  onToggle: (id: string) => void
}) {
  const groups = new Map<string, SearchRecord[]>()
  for (const record of results) {
    const label = eventTypeLabel(record.type)
    const list = groups.get(label) ?? []
    list.push(record)
    groups.set(label, list)
  }

  return (
    <div className="space-y-6">
      {[...groups.entries()].map(([label, records]) => (
        <section key={label} aria-label={label}>
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</h2>
          <ul className="mt-2 space-y-2">
            {records.map((record) => (
              <li key={record.id}>
                <SearchResultItem
                  record={record}
                  query={query}
                  expanded={selectedId === record.id}
                  onToggle={onToggle}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
