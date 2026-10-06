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

export type StoryType = "decision" | "requirement" | "blocker" | "discussion" | "task"

export type EvidenceKind = SourceKind | "decision"

export type CatchUpFilter = "all" | StoryType

export interface StoryStep {
  id: string
  dateLabel: string
  title: string
}

export interface Evidence {
  id: string
  kind: EvidenceKind
  kindLabel: string
  dateLabel: string
  title: string
  author: string
  projectName: string
  excerpt: string
  relationship: string
}

export interface ChangeComparison {
  beforeLabel: string
  beforeValue: string
  afterLabel: string
  afterValue: string
  reason: string
}

export interface WhyChangedPoint {
  id: string
  label: string
  detail: string
}

export interface TaskChange {
  id: string
  key: string
  title: string
  outcome: string
}

interface StoryBase {
  id: string
  slug: string
  priority: Priority
  title: string
  summary: string
  dateLabel: string
  projectId: string
  kicker: string
  navigatorLabel: string
  guided: boolean
  steps: StoryStep[]
  evidence: Evidence[]
  whyItMatters: string
  statusLabel: string
}

export interface RevisedDecisionStory extends StoryBase {
  type: "decision"
  variant: "revised"
  comparison: ChangeComparison
  whyChanged: WhyChangedPoint[]
}

export interface StandingDecisionStory extends StoryBase {
  type: "decision"
  variant: "standing"
  comparison: ChangeComparison
}

export interface RequirementStory extends StoryBase {
  type: "requirement"
  comparison: ChangeComparison
}

export interface BlockerStory extends StoryBase {
  type: "blocker"
  blockedWork: string
  blockedBy: string
  owner: string
}

export interface DiscussionStory extends StoryBase {
  type: "discussion"
  openQuestion: string
  participants: string[]
  whyAlexShouldCare: string
}

export interface TaskImpactStory extends StoryBase {
  type: "task"
  taskChanges: TaskChange[]
}

export type CatchUpStory =
  | RevisedDecisionStory
  | StandingDecisionStory
  | RequirementStory
  | BlockerStory
  | DiscussionStory
  | TaskImpactStory
