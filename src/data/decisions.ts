import type { Decision } from "@/types"

export const decisions: Decision[] = [
  {
    id: "dec-auth0",
    projectId: "atlas",
    title: "Use Auth0 for Atlas authentication",
    summary:
      "On September 18 the team selected Auth0 for interactive sign-in and silent token renewal.",
    priority: "high",
    status: "resolved",
    decidedOn: "Sep 18",
    superseded: true,
    revised: false,
    sources: ["meeting", "discussion"],
  },
  {
    id: "dec-client-credentials",
    projectId: "atlas",
    title: "Partner APIs use client credentials",
    summary:
      "Partner API access will use OAuth client credentials, kept separate from interactive enterprise SSO.",
    priority: "medium",
    status: "resolved",
    decidedOn: "Sep 19",
    superseded: false,
    revised: false,
    sources: ["meeting", "document"],
  },
  {
    id: "dec-auth-revised",
    projectId: "atlas",
    title: "Authentication architecture changed",
    summary:
      "The team originally selected Auth0 but revised the approach after token-refresh limitations were discovered during implementation.",
    priority: "high",
    status: "resolved",
    decidedOn: "Sep 22",
    superseded: false,
    revised: true,
    sources: ["github", "meeting", "jira"],
  },
]
