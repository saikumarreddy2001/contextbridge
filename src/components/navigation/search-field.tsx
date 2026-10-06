import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { modKeyLabel } from "@/utils/mod-key"

export function SearchField() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const query = params.get("q") ?? ""
  const [seenQuery, setSeenQuery] = useState(query)
  const [draft, setDraft] = useState(query)
  const hint = modKeyLabel()

  if (query !== seenQuery) {
    setSeenQuery(query)
    setDraft(query)
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k"
      const field = document.getElementById("global-search")
      if (shortcut) {
        if (document.activeElement === field) return
        event.preventDefault()
        field?.focus()
        return
      }
      if (event.key === "Escape" && document.activeElement === field) {
        field?.blur()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <form
      className="relative min-w-0 flex-1"
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        const next = draft.trim()
        navigate(next ? `/search?q=${encodeURIComponent(next)}` : "/search")
      }}
    >
      <label htmlFor="global-search" className="sr-only">
        Search
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id="global-search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Search decisions, tasks, discussions..."
        aria-keyshortcuts="Meta+K Control+K"
        className="h-8 w-full rounded-md border border-input bg-background pr-16 pl-8 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground sm:inline">
        {hint}
      </kbd>
    </form>
  )
}
