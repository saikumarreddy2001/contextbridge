import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { projects } from "@/data/projects"
import type { SearchFilters } from "@/types"
import { buildSearchRecords, recordMatches, resolveTimelineEvents } from "@/utils/history"

function readFilters(params: URLSearchParams): SearchFilters {
  return {
    query: params.get("q") ?? "",
    type: params.get("type") ?? "all",
    projectId: params.get("project") ?? "all",
    person: params.get("person") ?? "all",
    status: params.get("status") ?? "all",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
  }
}

export function useContextSearch() {
  const [params, setParams] = useSearchParams()
  const filters = readFilters(params)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const events = useMemo(() => resolveTimelineEvents(), [])
  const records = useMemo(() => buildSearchRecords(events), [events])
  const results = useMemo(
    () => records.filter((record) => recordMatches(record, filters)),
    [records, filters],
  )
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
    setParams(next, { replace: true })
  }

  return {
    filters,
    results,
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
    selectResult(id: string) {
      setSelectedId((current) => (current === id ? null : id))
    },
  }
}

function writeParam(params: URLSearchParams, key: string, value: string, empty = "") {
  if (!value || value === empty) params.delete(key)
  else params.set(key, value)
}
