import { catchUpItems } from "@/data/catch-up-stories"
import { contextNodes } from "@/data/context-graph"
import { storyLanes, timelineEventRefs } from "@/data/timeline"
import type {
  ContextNode,
  SearchFilters,
  TimelineDateRange,
  TimelineEventRef,
  TimelineEventType,
  TimelineFilters,
  TimelineKindFilter,
  TimelineLaneId,
} from "@/types"
import { nodeTypeLabel } from "@/utils/context-graph"

export interface ResolvedTimelineEvent {
  id: string
  storyLaneId: TimelineLaneId
  graphNodeId?: string
  sourceIds: string[]
  relatedEventIds: string[]
  type: TimelineEventType
  title: string
  date: string
  description: string
  status: string
  people: string[]
  projectId: string
  sources: { id: string; label: string }[]
  evolution: "superseded" | "current" | null
}

export interface SearchRecord {
  id: string
  type: TimelineEventType | "person"
  title: string
  snippet: string
  date: string
  projectId: string
  people: string[]
  status: string
  sourceLabel: string
  graphNodeId?: string
  timelineEventId?: string
  score?: number
  scoreBreakdown?: {
    keyword: number
    semantic: number
    importance: number
    recency: number
  }
}

const kindTypes: Record<TimelineKindFilter, TimelineEventType[] | null> = {
  all: null,
  decisions: ["decision"],
  requirements: ["requirement"],
  tasks: ["jira", "task"],
  code: ["github"],
  meetings: ["meeting"],
  problems: ["problem"],
  blockers: ["blocker"],
  discussions: ["discussion"],
}

export function eventTypeLabel(type: TimelineEventType | "person"): string {
  if (type === "task") return "Task"
  if (type === "jira") return "Jira"
  if (type === "github") return "GitHub"
  return nodeTypeLabel[type]
}

export function addIsoDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number)
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function eachIsoDay(from: string, to: string): string[] {
  if (!from || !to || from > to) return []
  const days: string[] = []
  let cursor = from
  while (cursor <= to && days.length < 31) {
    days.push(cursor)
    cursor = addIsoDays(cursor, 1)
  }
  return days
}

export function inclusiveDayCount(from: string, to: string): number {
  const start = Date.parse(`${from}T00:00:00Z`)
  const end = Date.parse(`${to}T00:00:00Z`)
  if (Number.isNaN(start) || Number.isNaN(end)) return 1
  return Math.max(1, Math.round((end - start) / 86_400_000) + 1)
}

export function shiftDateRange(range: TimelineDateRange, direction: -1 | 1): TimelineDateRange {
  const span = inclusiveDayCount(range.from, range.to)
  const from = addIsoDays(range.from, direction * span)
  return { from, to: addIsoDays(from, span - 1) }
}

function sourcesFor(ref: TimelineEventRef, node: ContextNode | undefined) {
  if (node && ref.id === node.id) return node.sourceRefs
  const item = ref.catchUpItemId ? catchUpItems.find((entry) => entry.id === ref.catchUpItemId) : undefined
  if (!item) return node?.sourceRefs ?? []
  return item.evidence
    .filter((evidence) => ref.sourceIds.includes(evidence.id))
    .map((evidence) => ({ id: evidence.id, label: `${evidence.kindLabel} · ${evidence.title}` }))
}

export function resolveTimelineEvents(): ResolvedTimelineEvent[] {
  return timelineEventRefs.map((ref) => {
    const node = ref.graphNodeId ? contextNodes.find((item) => item.id === ref.graphNodeId) : undefined
    const item = ref.catchUpItemId ? catchUpItems.find((entry) => entry.id === ref.catchUpItemId) : undefined
    const type: TimelineEventType =
      ref.type ?? (node && node.type !== "person" ? node.type : "task")
    return {
      id: ref.id,
      storyLaneId: ref.storyLaneId,
      graphNodeId: node ? ref.graphNodeId : undefined,
      sourceIds: ref.sourceIds,
      relatedEventIds: ref.relatedEventIds,
      type,
      title: item?.title ?? node?.title ?? ref.id,
      date: ref.date ?? node?.date ?? projectDate(item?.dateLabel),
      description: item?.summary ?? node?.description ?? "",
      status: item?.action?.statusLabel ?? node?.status ?? item?.kindLabel ?? "",
      people: node?.people ?? [],
      projectId: node?.projectId ?? item?.projectId ?? "atlas",
      sources: sourcesFor(ref, node),
      evolution: node?.status === "Superseded" ? "superseded" : node?.status === "Current" ? "current" : null,
    }
  })
}

function projectDate(label: string | undefined): string {
  if (!label) return "2026-09-23"
  const match = /([A-Za-z]+)\s+(\d+)/.exec(label)
  if (!match) return "2026-09-23"
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = months.findIndex((item) => item.toLowerCase() === match[1]?.toLowerCase())
  if (month < 0) return "2026-09-23"
  return `2026-${String(month + 1).padStart(2, "0")}-${String(Number(match[2])).padStart(2, "0")}`
}

export function eventMatchesFilters(
  event: ResolvedTimelineEvent,
  filters: TimelineFilters,
  range: TimelineDateRange,
): boolean {
  if (event.projectId !== filters.projectId) return false
  if (filters.person !== "all" && !event.people.includes(filters.person)) return false
  const allowed = kindTypes[filters.kind]
  if (allowed && !allowed.includes(event.type)) return false
  if (range.from && event.date < range.from) return false
  if (range.to && event.date > range.to) return false
  return true
}

export function eventMatchesQuery(event: ResolvedTimelineEvent, query: string): boolean {
  const terms = queryTerms(query)
  if (terms.length === 0) return true
  const haystack = [event.title, event.description, event.status, eventTypeLabel(event.type), ...event.people]
    .join(" ")
    .toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

export function laneEvents(events: ResolvedTimelineEvent[], laneId: TimelineLaneId): ResolvedTimelineEvent[] {
  return events
    .filter((event) => event.storyLaneId === laneId)
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title))
}

export function storyLaneById(id: TimelineLaneId) {
  return storyLanes.find((lane) => lane.id === id)
}

export function buildSearchRecords(events: ResolvedTimelineEvent[]): SearchRecord[] {
  const records: SearchRecord[] = events.map((event) => ({
    id: event.id,
    type: event.type,
    title: event.title,
    snippet: event.description,
    date: event.date,
    projectId: event.projectId,
    people: event.people,
    status: event.status,
    sourceLabel: event.sources[0]?.label ?? eventTypeLabel(event.type),
    graphNodeId: event.graphNodeId,
    timelineEventId: event.id,
  }))
  const covered = new Set(records.flatMap((record) => [record.id, record.graphNodeId].filter(Boolean)))
  for (const node of contextNodes) {
    if (covered.has(node.id)) continue
    records.push(recordFromNode(node))
  }
  return records
}

function recordFromNode(node: ContextNode): SearchRecord {
  const type: SearchRecord["type"] = node.type === "person" ? "person" : node.type
  return {
    id: node.id,
    type,
    title: node.title,
    snippet: node.description,
    date: node.date,
    projectId: node.projectId,
    people: node.people,
    status: node.status,
    sourceLabel: node.sourceRefs[0]?.label ?? eventTypeLabel(type),
    graphNodeId: node.id,
    timelineEventId: undefined,
  }
}

export function recordMatches(record: SearchRecord, filters: SearchFilters): boolean {
  if (filters.projectId && filters.projectId !== "all" && record.projectId !== filters.projectId) return false
  if (filters.person && filters.person !== "all" && !record.people.includes(filters.person)) return false
  if (filters.status && filters.status !== "all" && record.status !== filters.status) return false
  if (filters.from && record.date < filters.from) return false
  if (filters.to && record.date > filters.to) return false
  if (!typeMatches(record.type, filters.type)) return false
  return textMatches(record, filters.query)
}

function typeMatches(type: SearchRecord["type"], filter: string): boolean {
  if (!filter || filter === "all") return true
  if (filter === "code" || filter === "github") return type === "github"
  if (filter === "task" || filter === "tasks") return type === "jira" || type === "task"
  if (filter === "decision" || filter === "decisions") return type === "decision"
  return type === filter
}

function textMatches(record: SearchRecord, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const haystack = [record.title, record.snippet, record.status, eventTypeLabel(record.type), record.sourceLabel, ...record.people]
    .join(" ")
    .toLowerCase()
  return queryTerms(needle).every((term) => haystack.includes(term))
}

export function queryTerms(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
}

export function snippetAround(text: string, query: string): string {
  const terms = queryTerms(query)
  if (!text) return ""
  if (terms.length === 0) return clip(text, 0, 160)
  const lower = text.toLowerCase()
  let index = -1
  for (const term of terms) {
    const found = lower.indexOf(term)
    if (found >= 0 && (index < 0 || found < index)) index = found
  }
  if (index < 0) return clip(text, 0, 160)
  return clip(text, Math.max(0, index - 48), index + 112)
}

function clip(text: string, start: number, end: number): string {
  const slice = text.slice(start, end).trim()
  const prefix = start > 0 ? "…" : ""
  const suffix = end < text.length ? "…" : ""
  return `${prefix}${slice}${suffix}`
}

export function searchTypeOptions(): { id: string; label: string }[] {
  return [
    { id: "all", label: "All types" },
    { id: "decision", label: "Decisions" },
    { id: "requirement", label: "Requirements" },
    { id: "task", label: "Tasks" },
    { id: "github", label: "Code" },
    { id: "meeting", label: "Meetings" },
    { id: "problem", label: "Problems" },
    { id: "blocker", label: "Blockers" },
    { id: "discussion", label: "Discussions" },
    { id: "document", label: "Documents" },
  ]
}

export function nodeExists(id: string | undefined): id is string {
  return Boolean(id && contextNodes.some((node) => node.id === id))
}

export const timelineKindOptions: { id: TimelineKindFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "decisions", label: "Decisions" },
  { id: "requirements", label: "Requirements" },
  { id: "tasks", label: "Tasks" },
  { id: "code", label: "Code" },
  { id: "meetings", label: "Meetings" },
  { id: "problems", label: "Problems" },
  { id: "blockers", label: "Blockers" },
  { id: "discussions", label: "Discussions" },
]
