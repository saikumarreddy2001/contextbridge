import { useSyncExternalStore } from "react"
import type { CatchUpItem, ContextEdge, ContextNode, TimelineLane } from "@/types"
import type { ResolvedTimelineEvent, SearchRecord } from "@/utils/history"
import { apiGet, atlasApiProject } from "@/services/api/client"

export interface ProjectBundle {
  catchUpItems: CatchUpItem[]
  nodes: ContextNode[]
  edges: ContextEdge[]
  lanes: TimelineLane[]
  events: ResolvedTimelineEvent[]
}

type BundleState = {
  mode: "api" | "demo"
  status: "loading" | "ready" | "error" | "demo"
  data: ProjectBundle | null
  message: string | null
}

const listeners = new Set<() => void>()
let state: BundleState = { mode: "api", status: "loading", data: null, message: null }
let request: Promise<void> | null = null

function emit(next: BundleState) {
  state = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  ensureBundle()
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

function getServerSnapshot(): BundleState {
  return { mode: "api", status: "loading", data: null, message: null }
}

export function useProjectBundle() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function chooseDemoData() {
  emit({ mode: "demo", status: "demo", data: null, message: null })
}

export function ensureBundle() {
  if (state.mode === "demo" || state.status === "ready" || request) return
  request = loadBundle()
    .then((data) => {
      if (state.mode === "demo") return
      emit({ mode: "api", status: "ready", data, message: null })
    })
    .catch((error: unknown) => {
      if (state.mode === "demo") return
      const message = error instanceof Error ? error.message : "The reconstruction service could not be reached."
      emit({ mode: "api", status: "error", data: null, message })
    })
    .finally(() => {
      request = null
    })
}

async function loadBundle(): Promise<ProjectBundle> {
  const catchUpPath = `/api/projects/${atlasApiProject}/catch-up?user_id=alex-morgan&start_date=2026-09-16&end_date=2026-09-23`
  const [catchUp, graph, timeline] = await Promise.all([
    apiGet<{ catchUpItems: CatchUpItem[] }>(catchUpPath),
    apiGet<{ nodes: ContextNode[]; edges: ContextEdge[] }>(`/api/projects/${atlasApiProject}/graph`),
    apiGet<{ lanes: TimelineLane[]; events: ResolvedTimelineEvent[] }>(
      `/api/projects/${atlasApiProject}/timeline?start_date=2026-09-16&end_date=2026-09-23`,
    ),
  ])
  if (!Array.isArray(catchUp.catchUpItems) || !Array.isArray(graph.nodes) || !Array.isArray(timeline.events)) {
    throw new Error("The reconstruction service returned an unexpected payload.")
  }
  return {
    catchUpItems: catchUp.catchUpItems,
    nodes: graph.nodes,
    edges: graph.edges,
    lanes: timeline.lanes,
    events: timeline.events,
  }
}

export async function searchReconstruction(params: URLSearchParams): Promise<SearchRecord[]> {
  const payload = await apiGet<{ results: SearchRecord[] }>(`/api/projects/${atlasApiProject}/search?${params.toString()}`)
  return payload.results
}
