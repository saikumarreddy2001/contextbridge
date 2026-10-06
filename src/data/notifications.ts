import type { Notification } from "@/types"

export const notifications: Notification[] = [
  {
    id: "note-auth-revised",
    projectId: "atlas",
    title: "Authentication decision revised",
    body: "The September 22 session moved Project Atlas off Auth0.",
    timeLabel: "2 hours ago",
    unread: true,
  },
  {
    id: "note-mention",
    projectId: "atlas",
    title: "You were mentioned in API contract discussion",
    body: "Jordan Lee asked you to confirm the session-token claims.",
    timeLabel: "Yesterday",
    unread: true,
  },
  {
    id: "note-payments",
    projectId: "atlas",
    title: "Payment sandbox blocker updated",
    body: "Vendor environment access is still pending.",
    timeLabel: "Yesterday",
    unread: true,
  },
]
