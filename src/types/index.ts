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
