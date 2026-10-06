import type { TimelineEventRef, TimelineLane } from "@/types"

export const projectPeriod = { from: "2026-09-16", to: "2026-09-23" }

export const storyLanes: TimelineLane[] = [
  {
    id: "authentication",
    title: "Authentication",
    summary: "Sep 16 – Sep 22, through the revision",
    from: "2026-09-16",
    to: "2026-09-22",
  },
  {
    id: "payment",
    title: "Payment integration",
    summary: "Sandbox access requested Sep 19, still blocked Sep 23",
    from: "2026-09-19",
    to: "2026-09-23",
  },
  {
    id: "api-contract",
    title: "API contract",
    summary: "Identity claims still unresolved",
    from: "2026-09-23",
    to: "2026-09-23",
  },
]

export const timelineEventRefs: TimelineEventRef[] = [
  {
    id: "enterprise-customer-feedback",
    storyLaneId: "authentication",
    graphNodeId: "enterprise-customer-feedback",
    sourceIds: ["ev-auth-meeting"],
    relatedEventIds: ["enterprise-sso-requirement"],
  },
  {
    id: "enterprise-sso-requirement",
    storyLaneId: "authentication",
    graphNodeId: "enterprise-sso-requirement",
    sourceIds: ["ev-sso-doc"],
    relatedEventIds: ["enterprise-customer-feedback", "authentication-architecture-discussion"],
  },
  {
    id: "authentication-architecture-discussion",
    storyLaneId: "authentication",
    graphNodeId: "authentication-architecture-discussion",
    sourceIds: ["ev-sso-discussion"],
    relatedEventIds: ["enterprise-sso-requirement", "auth0-selected"],
  },
  {
    id: "auth0-selected",
    storyLaneId: "authentication",
    graphNodeId: "auth0-selected",
    sourceIds: [],
    relatedEventIds: ["authentication-architecture-discussion", "auth-142", "custom-authentication-architecture"],
  },
  {
    id: "auth-142",
    storyLaneId: "authentication",
    graphNodeId: "auth-142",
    sourceIds: ["ev-auth-jira"],
    relatedEventIds: ["auth0-selected", "pr-184"],
  },
  {
    id: "pr-184",
    storyLaneId: "authentication",
    graphNodeId: "pr-184",
    sourceIds: ["ev-auth-github"],
    relatedEventIds: ["auth-142", "token-refresh-limitation"],
  },
  {
    id: "token-refresh-limitation",
    storyLaneId: "authentication",
    graphNodeId: "token-refresh-limitation",
    sourceIds: ["ev-auth-github", "ev-auth-discussion"],
    relatedEventIds: ["pr-184", "project-atlas-discussion", "authentication-decision-revised"],
  },
  {
    id: "project-atlas-discussion",
    storyLaneId: "authentication",
    graphNodeId: "project-atlas-discussion",
    sourceIds: ["ev-auth-discussion"],
    relatedEventIds: ["token-refresh-limitation"],
  },
  {
    id: "authentication-decision-revised",
    storyLaneId: "authentication",
    graphNodeId: "authentication-decision-revised",
    sourceIds: ["ev-act-doc"],
    relatedEventIds: ["token-refresh-limitation", "custom-authentication-architecture", "alex-review"],
  },
  {
    id: "custom-authentication-architecture",
    storyLaneId: "authentication",
    graphNodeId: "custom-authentication-architecture",
    sourceIds: ["story-auth-architecture"],
    relatedEventIds: ["auth0-selected", "authentication-decision-revised", "implementation-updated"],
  },
  {
    id: "implementation-updated",
    storyLaneId: "authentication",
    graphNodeId: "implementation-updated",
    sourceIds: ["ev-tasks-142"],
    relatedEventIds: ["custom-authentication-architecture"],
  },
  {
    id: "alex-review",
    storyLaneId: "authentication",
    graphNodeId: "alex-morgan",
    catchUpItemId: "item-review",
    date: "2026-09-23",
    type: "task",
    sourceIds: ["ev-act-doc", "ev-act-discussion"],
    relatedEventIds: ["authentication-decision-revised", "api-contract-discussion"],
  },
  {
    id: "pay-88",
    storyLaneId: "payment",
    graphNodeId: "pay-88",
    sourceIds: ["ev-pay-jira"],
    relatedEventIds: ["payment-sandbox-blocker"],
  },
  {
    id: "payment-sandbox-blocker",
    storyLaneId: "payment",
    graphNodeId: "payment-sandbox-blocker",
    sourceIds: ["ev-pay-discussion"],
    relatedEventIds: ["pay-88"],
  },
  {
    id: "api-contract-discussion",
    storyLaneId: "api-contract",
    graphNodeId: "api-contract-discussion",
    sourceIds: ["ev-api-elena"],
    relatedEventIds: ["session-contract-draft", "custom-authentication-architecture", "alex-review"],
  },
  {
    id: "session-contract-draft",
    storyLaneId: "api-contract",
    graphNodeId: "session-contract-draft",
    sourceIds: ["ev-api-elena"],
    relatedEventIds: ["api-contract-discussion"],
  },
]

export function timelineEventIdForNode(nodeId: string): string | undefined {
  const exact = timelineEventRefs.find((event) => event.id === nodeId)
  if (exact) return exact.id
  return timelineEventRefs.find((event) => event.graphNodeId === nodeId)?.id
}
