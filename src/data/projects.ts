import type { Project } from "@/types"

export const projects: Project[] = [
  {
    id: "atlas",
    workspaceId: "northstar",
    name: "Project Atlas",
    status: "in-progress",
    statusLabel: "In Progress",
    currentFocus: "Authentication & Enterprise SSO",
    importantLabel: "Architecture revised",
    blockerLabel: "Payment sandbox access",
  },
  {
    id: "portal",
    workspaceId: "northstar",
    name: "Customer Portal",
    status: "in-progress",
    statusLabel: "In Progress",
    currentFocus: "Billing preferences",
    importantLabel: "No architecture change",
    blockerLabel: "None",
  },
  {
    id: "analytics",
    workspaceId: "northstar",
    name: "Analytics Modernization",
    status: "in-progress",
    statusLabel: "In Progress",
    currentFocus: "Warehouse cutover",
    importantLabel: "No open decision",
    blockerLabel: "None",
  },
]
