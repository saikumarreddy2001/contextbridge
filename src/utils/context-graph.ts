import type { Edge, Node } from "@xyflow/react"
import type {
  ContextEdge,
  ContextNode,
  ContextNodeType,
  GraphFilters,
  GraphKindFilter,
  RelationshipType,
} from "@/types"

export interface ContextNodeData extends Record<string, unknown> {
  domain: ContextNode
  emphasis: "normal" | "selected" | "related" | "dimmed"
}

export type FlowNode = Node<ContextNodeData, "context">
export type FlowEdge = Edge<{ relationshipType: RelationshipType; description: string; label: string }>

const causalTypes = new Set<RelationshipType>(["triggered", "resulted_in", "implemented_by"])
const impactTypes = new Set<RelationshipType>([
  "triggered",
  "resulted_in",
  "implemented_by",
  "superseded_by",
])

const kindTypes: Record<GraphKindFilter, ContextNodeType[] | null> = {
  all: null,
  decisions: ["decision"],
  requirements: ["requirement"],
  code: ["github"],
  tasks: ["jira"],
  meetings: ["meeting"],
  problems: ["problem"],
  blockers: ["blocker"],
}

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function formatGraphDate(iso: string): string {
  const [, month, day] = iso.split("-")
  const monthIndex = Number(month) - 1
  const label = monthLabels[monthIndex] ?? month
  return `${label} ${Number(day)}`
}

export function nodeMatchesFilters(node: ContextNode, filters: GraphFilters): boolean {
  if (node.projectId !== filters.projectId) return false
  const allowed = kindTypes[filters.kind]
  if (allowed && !allowed.includes(node.type)) return false
  if (filters.from && node.date < filters.from) return false
  if (filters.to && node.date > filters.to) return false
  return true
}

export function nodeMatchesQuery(node: ContextNode, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const haystack = [node.title, node.description, node.status, node.type, ...node.people].join(" ").toLowerCase()
  return haystack.includes(needle)
}

export function traceWhy(originId: string, edges: ContextEdge[]): string[] {
  const path: string[] = []
  const seen = new Set<string>()

  function walk(id: string) {
    if (seen.has(id)) return
    const parents = edges.filter((edge) => edge.target === id && causalTypes.has(edge.relationshipType))
    for (const edge of parents) walk(edge.source)
    if (seen.has(id)) return
    seen.add(id)
    path.push(id)
  }

  walk(originId)
  return path
}

export function traceImpact(originId: string, edges: ContextEdge[]): string[] {
  const order: string[] = []
  const seen = new Set<string>()

  function walk(id: string) {
    if (seen.has(id)) return
    seen.add(id)
    order.push(id)
    for (const edge of edges) {
      if (edge.source === id && impactTypes.has(edge.relationshipType)) walk(edge.target)
    }
  }

  walk(originId)
  return order
}

export function layoutNodes(nodes: ContextNode[], edges: ContextEdge[]): Map<string, { x: number; y: number }> {
  const column = new Map<string, number>()

  function depth(id: string, stack: Set<string>): number {
    const known = column.get(id)
    if (known !== undefined) return known
    if (stack.has(id)) return 0
    stack.add(id)
    const parents = edges.filter((edge) => edge.target === id && causalTypes.has(edge.relationshipType))
    const value = parents.length === 0 ? 0 : Math.max(...parents.map((edge) => depth(edge.source, stack))) + 1
    column.set(id, value)
    return value
  }

  for (const node of nodes) depth(node.id, new Set())

  const causalIds = new Set<string>()
  for (const edge of edges) {
    if (!causalTypes.has(edge.relationshipType)) continue
    causalIds.add(edge.source)
    causalIds.add(edge.target)
  }

  function anchorColumn(id: string, seen: Set<string>): number {
    const causal = column.get(id)
    if (causalIds.has(id) && causal !== undefined) return causal
    if (seen.has(id)) return causal ?? 0
    seen.add(id)
    const edge = edges.find((item) => item.source === id || item.target === id)
    if (!edge) return causal ?? 0
    const other = edge.source === id ? edge.target : edge.source
    return anchorColumn(other, seen)
  }

  const rows = new Map<number, number>()
  const positions = new Map<string, { x: number; y: number }>()

  for (const node of nodes) {
    const col = causalIds.has(node.id) ? (column.get(node.id) ?? 0) : anchorColumn(node.id, new Set())
    let row = 0
    if (!causalIds.has(node.id)) {
      const used = rows.get(col) ?? 0
      const next = used + 1
      rows.set(col, next)
      row = next % 2 === 1 ? Math.ceil(next / 2) : -Math.ceil(next / 2)
    }
    positions.set(node.id, { x: col * 280, y: row * 170 })
  }

  return positions
}

export function toFlowNodes(
  nodes: ContextNode[],
  positions: Map<string, { x: number; y: number }>,
  emphasisFor: (id: string) => ContextNodeData["emphasis"],
): FlowNode[] {
  return nodes.map((domain) => ({
    id: domain.id,
    type: "context",
    position: positions.get(domain.id) ?? { x: 0, y: 0 },
    data: { domain, emphasis: emphasisFor(domain.id) },
    draggable: false,
    selectable: true,
  }))
}

export function toFlowEdges(
  edges: ContextEdge[],
  visible: Set<string>,
  emphasisFor: (edge: ContextEdge) => "active" | "dimmed" | "normal",
): FlowEdge[] {
  return edges
    .filter((edge) => visible.has(edge.source) && visible.has(edge.target))
    .map((edge) => {
      const emphasis = emphasisFor(edge)
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
        label: emphasis === "active" ? edge.label : undefined,
        data: { relationshipType: edge.relationshipType, description: edge.description, label: edge.label },
        style: {
          strokeWidth: emphasis === "active" ? 2 : 1,
          opacity: emphasis === "dimmed" ? 0.2 : 1,
        },
      }
    })
}

export const relationshipIncoming: Record<RelationshipType, string> = {
  triggered: "Triggered by",
  resulted_in: "Result of",
  implemented_by: "Implemented by",
  discussed_in: "Discussed in",
  blocked_by: "Blocked by",
  superseded_by: "Superseded by",
  evidence_for: "Evidence from",
  assigned_to: "Assigned to",
}

export const relationshipOutgoing: Record<RelationshipType, string> = {
  triggered: "Triggered",
  resulted_in: "Led to",
  implemented_by: "Implemented by",
  discussed_in: "Discussed in",
  blocked_by: "Blocked",
  superseded_by: "Superseded by",
  evidence_for: "Evidence for",
  assigned_to: "Assigned to",
}

export const nodeTypeLabel: Record<ContextNodeType, string> = {
  requirement: "Requirement",
  decision: "Decision",
  discussion: "Discussion",
  meeting: "Meeting",
  jira: "Jira Task",
  github: "GitHub Change",
  problem: "Problem",
  blocker: "Blocker",
  document: "Document",
  person: "Person",
}
