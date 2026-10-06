import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { projectPeriod, storyLanes } from "@/data/timeline"
import { projects } from "@/data/projects"
import { useProject } from "@/hooks/use-selection"
import type { TimelineDateRange, TimelineFilters, TimelineKindFilter } from "@/types"
import {
  eventMatchesFilters,
  eventMatchesQuery,
  laneEvents,
  resolveTimelineEvents,
  shiftDateRange,
} from "@/utils/history"

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable
}

export function useTimeline() {
  const { project, projects: workspaceProjects, setProject } = useProject()
  const [params, setParams] = useSearchParams()
  const focusId = params.get("focus")
  const [kind, setKind] = useState<TimelineKindFilter>("all")
  const [person, setPerson] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<TimelineDateRange>(projectPeriod)

  const filters: TimelineFilters = {
    kind,
    projectId: project?.id ?? "atlas",
    person,
  }

  const events = useMemo(() => resolveTimelineEvents(), [])
  const periodEvents = useMemo(
    () => events.filter((event) => eventMatchesFilters(event, filters, dateRange)),
    [events, filters, dateRange],
  )
  const visibleEvents = useMemo(() => {
    if (!searchQuery.trim()) return periodEvents
    return periodEvents.filter((event) => eventMatchesQuery(event, searchQuery))
  }, [periodEvents, searchQuery])
  const searchResults = searchQuery.trim() ? visibleEvents : []
  const selectedEvent = events.find((event) => event.id === focusId) ?? null
  const people = useMemo(() => {
    const names = new Set(events.flatMap((event) => event.people))
    return [...names].sort((a, b) => a.localeCompare(b))
  }, [events])

  const lanes = useMemo(
    () =>
      storyLanes.map((lane) => ({
        ...lane,
        events: laneEvents(visibleEvents, lane.id),
      })),
    [visibleEvents],
  )

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || isEditableTarget(event.target)) return
      if (!focusId) return
      event.preventDefault()
      const next = new URLSearchParams(params)
      next.delete("focus")
      setParams(next, { replace: true })
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [focusId, params, setParams])

  function selectEvent(id: string) {
    const next = new URLSearchParams(params)
    next.set("focus", id)
    setParams(next)
  }

  function closePanel() {
    if (!focusId) return
    const next = new URLSearchParams(params)
    next.delete("focus")
    setParams(next, { replace: true })
  }

  return {
    lanes,
    events,
    visibleEvents,
    searchResults,
    selectedEvent,
    focusedEvent: selectedEvent,
    filters,
    searchQuery,
    dateRange,
    people,
    projects: workspaceProjects.length > 0 ? workspaceProjects : projects,
    projectName: project?.name ?? "This project",
    setSearchQuery,
    setKind,
    setPerson,
    setDateRange,
    setProject,
    selectEvent,
    closePanel,
    previousPeriod() {
      setDateRange((current) => shiftDateRange(current, -1))
    },
    nextPeriod() {
      setDateRange((current) => shiftDateRange(current, 1))
    },
    returnToProjectPeriod() {
      setDateRange(projectPeriod)
    },
  }
}
