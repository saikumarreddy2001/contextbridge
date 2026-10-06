import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { projects } from "@/data/projects"
import { searchReconstruction, useProjectBundle } from "@/services/api/bundle"
import type { SearchFilters } from "@/types"
import { buildSearchRecords, recordMatches, resolveTimelineEvents, type SearchRecord } from "@/utils/history"

function readFilters(params: URLSearchParams): SearchFilters {
  return {
    query: params.get("q") ?? "",
    type: params.get("type") ?? "all",
    projectId: params.get("project") ?? "all",
    person: params.get("person") ?? "all",
    status: params.get("status") ?? "all",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    mode: params.get("mode") === "hybrid" ? "hybrid" : "keyword",
  }
}

export function useContextSearch() {
  const bundle = useProjectBundle()
  const [params, setParams] = useSearchParams()
  const filters = readFilters(params)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [remote, setRemote] = useState<SearchRecord[] | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const filterKey = params.toString()
  const events = useMemo(() => resolveTimelineEvents(), [])
  const records = useMemo(() => buildSearchRecords(events), [events])
  const localResults = useMemo(
    () => records.filter((record) => recordMatches(record, filters)),
    [records, filters],
  )

  useEffect(() => {
    if (bundle.status !== "ready") return
    const query = new URLSearchParams(filterKey).get("q") ?? ""
    if (!query.trim()) {
      setRemote([])
      return
    }
    let cancelled = false
    setRemote(null)
    setSearchError(null)
    const request = new URLSearchParams()
    const current = readFilters(new URLSearchParams(filterKey))
    request.set("q", current.query)
    if (current.type !== "all") request.set("type", current.type)
    if (current.person !== "all") request.set("person", current.person)
    if (current.status !== "all") request.set("status", current.status)
    if (current.from) request.set("start_date", current.from)
    if (current.to) request.set("end_date", current.to)
    if (current.mode === "hybrid") request.set("mode", "hybrid")
    searchReconstruction(request)
      .then((results) => {
        if (!cancelled) setRemote(results)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setSearchError(error instanceof Error ? error.message : "The reconstruction service could not be reached.")
      })
    return () => {
      cancelled = true
    }
  }, [bundle.status, filterKey])

  const results = bundle.status === "ready" ? (remote ?? []) : localResults
  const people = useMemo(() => {
    const names = new Set(records.flatMap((record) => record.people))
    return [...names].sort((a, b) => a.localeCompare(b))
  }, [records])
  const statuses = useMemo(() => {
    const values = new Set(records.map((record) => record.status).filter(Boolean))
    return [...values].sort((a, b) => a.localeCompare(b))
  }, [records])
  const selected = results.find((record) => record.id === selectedId) ?? null

  function update(partial: Partial<SearchFilters>) {
    const next = new URLSearchParams(params)
    const merged = { ...filters, ...partial }
    writeParam(next, "q", merged.query)
    writeParam(next, "type", merged.type, "all")
    writeParam(next, "project", merged.projectId, "all")
    writeParam(next, "person", merged.person, "all")
    writeParam(next, "status", merged.status, "all")
    writeParam(next, "from", merged.from)
    writeParam(next, "to", merged.to)
    writeParam(next, "mode", merged.mode, "keyword")
    setParams(next, { replace: true })
  }

  return {
    filters,
    results,
    searching: bundle.status === "ready" && filters.query.trim().length > 0 && remote === null && !searchError,
    searchError,
    selected,
    people,
    statuses,
    projects,
    setQuery(query: string) {
      update({ query })
    },
    setType(type: string) {
      update({ type })
    },
    setProject(projectId: string) {
      update({ projectId })
    },
    setPerson(person: string) {
      update({ person })
    },
    setStatus(status: string) {
      update({ status })
    },
    setDateRange(from: string, to: string) {
      update({ from, to })
    },
    setMode(mode: "keyword" | "hybrid") {
      update({ mode })
    },
    selectResult(id: string) {
      setSelectedId((current) => (current === id ? null : id))
    },
  }
}

function writeParam(params: URLSearchParams, key: string, value: string, empty = "") {
  if (!value || value === empty) params.delete(key)
  else params.set(key, value)
}
