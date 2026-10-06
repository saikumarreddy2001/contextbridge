import type { Blocker } from "@/types"

export const blockers: Blocker[] = [
  {
    id: "blk-payments",
    projectId: "atlas",
    title: "Payment sandbox integration delayed",
    summary:
      "Vendor environment access is still pending, preventing the team from completing sandbox integration testing.",
    priority: "high",
    status: "blocked",
    updatedOn: "Sep 23",
    sources: ["jira"],
  },
]
