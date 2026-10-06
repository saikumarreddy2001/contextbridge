import type { SourceKind, Status } from "@/types"

export const sourceLabels: Record<SourceKind, string> = {
  meeting: "Meeting",
  github: "GitHub",
  jira: "Jira",
  document: "Document",
  discussion: "Discussion",
}

export const statusLabels: Record<Status, string> = {
  open: "Open",
  resolved: "Resolved",
  "in-progress": "In progress",
  blocked: "Blocked",
  completed: "Completed",
}
