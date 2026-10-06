import type { Task } from "@/types"

export const tasks: Task[] = [
  {
    id: "task-review-auth",
    projectId: "atlas",
    title: "Review revised authentication approach",
    summary:
      "The September 22 revision replaced Auth0. Read why the approach changed before implementation continues.",
    assigneeId: "alex-morgan",
    source: "document",
    priority: "high",
    status: "open",
    actionLabel: "Review",
  },
  {
    id: "task-api-contract",
    projectId: "atlas",
    title: "Respond to unresolved API contract discussion",
    summary:
      "Jordan Lee asked you to confirm the session-token claims before the contract is frozen.",
    assigneeId: "alex-morgan",
    source: "discussion",
    priority: "high",
    status: "open",
    actionLabel: "Respond",
  },
  {
    id: "task-payment",
    projectId: "atlas",
    title: "Review payment integration blocker",
    summary:
      "Sandbox testing is stopped until the vendor grants environment access.",
    assigneeId: "alex-morgan",
    source: "jira",
    priority: "high",
    status: "blocked",
    actionLabel: "Review",
  },
  {
    id: "task-confirm-sso",
    projectId: "atlas",
    title: "Confirm updated SSO requirement",
    summary:
      "Enterprise SSO is now in the launch scope from the September 16 customer review.",
    assigneeId: "alex-morgan",
    source: "meeting",
    priority: "medium",
    status: "open",
    actionLabel: "Confirm",
  },
]
