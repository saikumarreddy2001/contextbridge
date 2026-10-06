import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { contextEdges, contextNodes } from "@/data/context-graph"
import { useProject } from "@/hooks/use-selection"
import { useProjectBundle } from "@/services/api/bundle"
import type { ContextEdge, ContextNode, GraphFilters, GraphKindFilter } from "@/types"
import {
  layoutNodes,
  nodeMatchesFilters,
  nodeMatchesQuery,
  toFlowEdges,
  toFlowNodes,
  traceImpact,
  traceWhy,
  type ContextNodeData,
} from "@/utils/context-graph"

export type TraceMode = "why" | "impact"

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable
}

const defaultFilters = (projectId: string): GraphFilters => ({
  kind: "all",
  projectId,
  from: "",
  to: "",
})

export function useContextGraph() {
  const bundle = useProjectBundle()
  const sourceNodes = bundle.status === "ready" && bundle.data ? bundle.data.nodes : bundle.status === "demo" ? contextNodes : []
  const sourceEdges = bundle.status === "ready" && bundle.data ? bundle.data.edges : bundle.status === "demo" ? contextEdges : []
  const { project, projects, setProject } = useProject()
  const [params] = useSearchParams()
  const focus = params.get("focus")
  const [appliedFocus, setAppliedFocus] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<GraphFilters>(() => defaultFilters(project?.id ?? "atlas"))
  const [searchQuery, setSearchQuery] = useState("")
  const [traceMode, setTraceMode] = useState<TraceMode | null>(null)
  const [traceOriginId, setTraceOriginId] = useState<string | null>(null)
  const [fitNodeId, setFitNodeId] = useState<string | null>(null)
  const [shellProjectId, setShellProjectId] = useState(project?.id ?? "atlas")

  if (project && project.id !== shellProjectId) {
    setShellProjectId(project.id)
    setActiveFilters((current) => ({ ...current, projectId: project.id }))
  }

  if (focus && focus !== appliedFocus && sourceNodes.length > 0) {
    setAppliedFocus(focus)
    if (sourceNodes.some((node) => node.id === focus)) {
      setSelectedNodeId(focus)
      setSelectedEdgeId(null)
      setFitNodeId(focus)
    }
  }

  const visibleNodes = useMemo(
    () => sourceNodes.filter((node) => nodeMatchesFilters(node, activeFilters)),
    [sourceNodes, activeFilters],
  )

  const tracePath = useMemo(() => {
    if (!traceMode || !traceOriginId) return []
    return traceMode === "why" ? traceWhy(traceOriginId, sourceEdges) : traceImpact(traceOriginId, sourceEdges)
  }, [traceMode, traceOriginId, sourceEdges])

  const selectedNode = visibleNodes.find((node) => node.id === selectedNodeId) ?? null
  const selectedEdge =
    sourceEdges.find(
      (edge) =>
        edge.id === selectedEdgeId &&
        visibleNodes.some((node) => node.id === edge.source) &&
        visibleNodes.some((node) => node.id === edge.target),
    ) ?? null

  const neighborIds = useMemo(() => {
    const ids = new Set<string>()
    if (!selectedNode) return ids
    for (const edge of sourceEdges) {
      if (edge.source === selectedNode.id) ids.add(edge.target)
      if (edge.target === selectedNode.id) ids.add(edge.source)
    }
    return ids
  }, [selectedNode, sourceEdges])

  function emphasisFor(node: ContextNode): ContextNodeData["emphasis"] {
    if (tracePath.length > 0) {
      if (node.id === selectedNode?.id) return "selected"
      return tracePath.includes(node.id) ? "related" : "dimmed"
    }
    const searching = searchQuery.trim().length > 0
    if (searching && !nodeMatchesQuery(node, searchQuery)) return "dimmed"
    if (!selectedNode && !selectedEdge) return "normal"
    if (node.id === selectedNode?.id) return "selected"
    if (selectedEdge && (selectedEdge.source === node.id || selectedEdge.target === node.id)) return "related"
    if (neighborIds.has(node.id)) return "related"
    return "dimmed"
  }

  function clearSelectionIfHidden(filters: GraphFilters) {
    setSelectedNodeId((current) => {
      if (!current) return current
      const node = sourceNodes.find((item) => item.id === current)
      return node && nodeMatchesFilters(node, filters) ? current : null
    })
    setSelectedEdgeId((current) => {
      if (!current) return current
      const edge = sourceEdges.find((item) => item.id === current)
      if (!edge) return null
      const source = sourceNodes.find((item) => item.id === edge.source)
      const target = sourceNodes.find((item) => item.id === edge.target)
      if (!source || !target || !nodeMatchesFilters(source, filters) || !nodeMatchesFilters(target, filters)) {
        return null
      }
      return current
    })
  }

  function updateFilters(next: GraphFilters) {
    setActiveFilters(next)
    clearSelectionIfHidden(next)
  }

  function selectNode(id: string, fit = false) {
    setSelectedNodeId(id)
    setSelectedEdgeId(null)
    if (fit) setFitNodeId(id)
  }

  function selectEdge(id: string) {
    setSelectedEdgeId(id)
    setSelectedNodeId(null)
  }

  function closePanel() {
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
  }

  function exitTrace() {
    setTraceMode(null)
    setTraceOriginId(null)
  }

  function startTrace(mode: TraceMode) {
    if (!selectedNode) return
    setTraceMode(mode)
    setTraceOriginId(selectedNode.id)
  }

  const panelOpen = Boolean(selectedNode || selectedEdge)

  const flow = useMemo(() => {
    const positions = layoutNodes(sourceNodes, sourceEdges)
    const visibleIds = new Set(visibleNodes.map((node) => node.id))
    const searching = searchQuery.trim().length > 0
    const nodes = toFlowNodes(visibleNodes, positions, (id) => {
      const node = visibleNodes.find((item) => item.id === id)
      return node ? emphasisFor(node) : "normal"
    })
    const edges = toFlowEdges(sourceEdges, visibleIds, (edge) =>
      edgeIsActive(edge, traceMode, tracePath, selectedNode, selectedEdge, searching),
    )
    return { nodes, edges }
  }, [visibleNodes, sourceNodes, sourceEdges, searchQuery, traceMode, tracePath, selectedNode, selectedEdge, neighborIds])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return
      if (event.key !== "Escape") return
      if (panelOpen) {
        event.preventDefault()
        setSelectedNodeId(null)
        setSelectedEdgeId(null)
        return
      }
      if (traceMode) {
        event.preventDefault()
        setTraceMode(null)
        setTraceOriginId(null)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [panelOpen, traceMode])
  const searchResults = searchQuery.trim()
    ? visibleNodes.filter((node) => nodeMatchesQuery(node, searchQuery))
    : []

  return {
    nodes: sourceNodes,
    edges: sourceEdges,
    flowNodes: flow.nodes,
    flowEdges: flow.edges,
    visibleNodes,
    activeFilters,
    searchQuery,
    searchResults,
    selectedNode,
    selectedEdge,
    traceMode,
    tracePath,
    fitNodeId,
    panelOpen,
    projects,
    setSearchQuery,
    setKind(kind: GraphKindFilter) {
      updateFilters({ ...activeFilters, kind })
    },
    setDateRange(from: string, to: string) {
      updateFilters({ ...activeFilters, from, to })
    },
    setProjectFilter(projectId: string) {
      setProject(projectId)
      updateFilters({ ...activeFilters, projectId })
    },
    selectNode,
    selectEdge,
    closePanel,
    startTrace,
    exitTrace,
    canTraceWhy: selectedNode ? traceWhy(selectedNode.id, sourceEdges).length > 1 : false,
    canTraceImpact: selectedNode ? traceImpact(selectedNode.id, sourceEdges).length > 1 : false,
  }
}

export function edgeIsActive(
  edge: ContextEdge,
  traceMode: TraceMode | null,
  tracePath: string[],
  selectedNode: ContextNode | null,
  selectedEdge: ContextEdge | null,
  searching: boolean,
): "active" | "dimmed" | "normal" {
  if (tracePath.length > 0 && traceMode) {
    const types =
      traceMode === "why"
        ? new Set(["triggered", "resulted_in", "implemented_by"])
        : new Set(["triggered", "resulted_in", "implemented_by", "superseded_by"])
    const onPath =
      types.has(edge.relationshipType) && tracePath.includes(edge.source) && tracePath.includes(edge.target)
    return onPath ? "active" : "dimmed"
  }
  if (selectedEdge?.id === edge.id) return "active"
  if (selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id)) return "active"
  if (selectedNode || selectedEdge || searching) return "dimmed"
  return "normal"
}
