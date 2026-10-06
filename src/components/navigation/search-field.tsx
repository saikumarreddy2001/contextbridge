import { Search } from "lucide-react"
import { modKeyLabel } from "@/utils/mod-key"

export function SearchField() {
  const hint = modKeyLabel()

  return (
    <div className="relative min-w-0 flex-1" role="search">
      <label htmlFor="global-search" className="sr-only">
        Search
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id="global-search"
        readOnly
        placeholder="Search decisions, tasks, discussions..."
        aria-keyshortcuts="Meta+K Control+K"
        aria-describedby="search-preview-note"
        className="h-8 w-full rounded-md border border-input bg-background pr-16 pl-8 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground sm:inline">
        {hint}
      </kbd>
      <p id="search-preview-note" className="sr-only">
        Search preview. Queries are not run in this version.
      </p>
    </div>
  )
}
