export type SourceKind =
  | "meeting"
  | "github"
  | "jira"
  | "document"
  | "discussion"

export type Priority = "critical" | "high" | "medium" | "normal"

export type Status = "open" | "resolved" | "in-progress" | "blocked" | "completed"

export interface User {
  id: string
  name: string
  email: string
  title: string
  initials: string
}

export interface Workspace {
  id: string
  name: string
  detail: string
}

export interface Project {
  id: string
  workspaceId: string
  name: string
  status: Status
  statusLabel: string
  currentFocus: string
  importantLabel: string
  blockerLabel: string
}

export interface Decision {
  id: string
  projectId: string
  title: string
  summary: string
  priority: Priority
  status: Status
  decidedOn: string
  superseded: boolean
  revised: boolean
  sources: SourceKind[]
}

export interface RequirementChange {
  id: string
  projectId: string
  title: string
  summary: string
  priority: Priority
  status: Status
  changedOn: string
  sources: SourceKind[]
}

export interface Blocker {
  id: string
  projectId: string
  title: string
  summary: string
  priority: Priority
  status: Status
  updatedOn: string
  sources: SourceKind[]
}

export interface Task {
  id: string
  projectId: string
  title: string
  summary: string
  assigneeId: string
  source: SourceKind
  priority: Priority
  status: Status
  actionLabel: string
}

export interface Activity {
  id: string
  projectId: string
  source: SourceKind
  title: string
  description: string
  timeLabel: string
  actor: string
  status?: Status
  /** Ordinary absence noise. Omitted from the Overview feed. */
  background?: boolean
}

export interface Source {
  id: string
  projectId: string
  kind: SourceKind
  name: string
  detail: string
  recordedOn: string
}

export interface Notification {
  id: string
  projectId: string
  title: string
  body: string
  timeLabel: string
  unread: boolean
}

export interface AuthStoryStep {
  id: string
  dateLabel: string
  title: string
  detail: string
  source: SourceKind
}

export type CatchUpKind = "decision" | "requirement" | "blocker" | "action" | "discussion" | "task"

export type CatchUpFilter = "all" | CatchUpKind

export interface StoryStep {
  id: string
  dateLabel: string
  title: string
}

export interface EvidenceMeta {
  label: string
  value: string
}

export interface Evidence {
  id: string
  kind: SourceKind
  kindLabel: string
  dateLabel: string
  title: string
  author: string
  projectName: string
  excerpt: string
  relationship: string
  meta: EvidenceMeta[]
}

export interface CatchUpChange {
  beforeLabel: string
  beforeValue: string
  afterLabel: string
  afterValue: string
}

export interface CatchUpDetail {
  id: string
  label: string
  value: string
}

export interface CatchUpReasonPoint {
  id: string
  label: string
  detail: string
}

export interface CatchUpReason {
  prompt: string
  summary: string
  points: CatchUpReasonPoint[]
}

export interface CatchUpAction {
  ask: string
  dueLabel: string
  statusLabel: string
}

export interface CatchUpItem {
  id: string
  slug: string
  projectId: string
  kind: CatchUpKind
  kindLabel: string
  completionLabel: string
  title: string
  summary: string
  navigatorLabel: string
  guided: boolean
  priority: Priority
  dateLabel: string
  steps: StoryStep[]
  change: CatchUpChange | null
  details: CatchUpDetail[]
  reason: CatchUpReason | null
  action: CatchUpAction | null
  evidence: Evidence[]
  /** When set, catch-up offers a link to this context-graph node. */
  contextFocusId?: string
}

export type ContextNodeType =
  | "requirement"
  | "decision"
  | "discussion"
  | "meeting"
  | "jira"
  | "github"
  | "problem"
  | "blocker"
  | "document"
  | "person"

export type RelationshipType =
  | "triggered"
  | "resulted_in"
  | "implemented_by"
  | "discussed_in"
  | "blocked_by"
  | "superseded_by"
  | "evidence_for"
  | "assigned_to"

export type GraphKindFilter =
  | "all"
  | "decisions"
  | "requirements"
  | "code"
  | "tasks"
  | "meetings"
  | "problems"
  | "blockers"

export interface ContextSourceRef {
  id: string
  label: string
}

export interface ContextNode {
  id: string
  type: ContextNodeType
  title: string
  date: string
  status: string
  description: string
  projectId: string
  people: string[]
  sourceRefs: ContextSourceRef[]
}

export interface ContextEdge {
  id: string
  source: string
  target: string
  relationshipType: RelationshipType
  label: string
  description: string
}

export interface GraphFilters {
  kind: GraphKindFilter
  projectId: string
  from: string
  to: string
}

export type TimelineLaneId = "authentication" | "payment" | "api-contract"

export interface TimelineLane {
  id: TimelineLaneId
  title: string
  summary: string
  from: string
  to: string
}

/** Graph node types, plus the catch-up task kind for work that is not a Jira node. */
export type TimelineEventType = Exclude<ContextNodeType, "person"> | Extract<CatchUpKind, "task">

export type TimelineKindFilter =
  | "all"
  | "decisions"
  | "requirements"
  | "tasks"
  | "code"
  | "meetings"
  | "problems"
  | "blockers"
  | "discussions"

export interface TimelineEventRef {
  id: string
  storyLaneId: TimelineLaneId
  graphNodeId?: string
  catchUpItemId?: string
  /** ISO date when the catch-up item date is a due date, not the day the event happened. */
  date?: string
  type?: TimelineEventType
  sourceIds: string[]
  relatedEventIds: string[]
}

export interface TimelineDateRange {
  from: string
  to: string
}

export interface TimelineFilters {
  kind: TimelineKindFilter
  projectId: string
  person: string
}

export interface SearchFilters {
  query: string
  type: string
  projectId: string
  person: string
  status: string
  from: string
  to: string
}
