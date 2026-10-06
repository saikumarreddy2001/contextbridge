import type { CatchUpFilter, CatchUpItem, CatchUpKind } from "@/types"

export const catchUpWindow = {
  projectName: "Project Atlas",
  projectId: "atlas",
  startLabel: "Sep 16",
  endLabel: "Sep 23",
  rangeLabel: "Sep 16 — Sep 23",
  workingDays: 8,
}

const projectName = "Project Atlas"

const completionOrder: CatchUpKind[] = [
  "decision",
  "requirement",
  "blocker",
  "action",
  "discussion",
]

export const catchUpItems: CatchUpItem[] = [
  {
    id: "item-auth-architecture",
    slug: "authentication-architecture",
    projectId: "atlas",
    kind: "decision",
    kindLabel: "Decision changed",
    completionLabel: "Decision Changed",
    title: "Authentication architecture changed",
    contextFocusId: "authentication-decision-revised",
    summary:
      "The team originally selected Auth0 but revised the approach after token-refresh limitations were discovered during implementation.",
    navigatorLabel: "Authentication architecture",
    guided: true,
    priority: "high",
    dateLabel: "Sep 22",
    change: {
      beforeLabel: "Original decision",
      beforeValue: "Auth0",
      afterLabel: "Revised decision",
      afterValue: "Custom authentication architecture",
    },
    details: [],
    reason: {
      prompt: "Why did this change?",
      summary:
        "Token-refresh limitations conflicted with the newly introduced enterprise SSO workflow.",
      points: [
        {
          id: "why-trigger",
          label: "Trigger",
          detail: "Enterprise SSO became a launch requirement.",
        },
        {
          id: "why-discovery",
          label: "Discovery",
          detail: "Token-refresh behavior did not satisfy the required workflow.",
        },
        {
          id: "why-impact",
          label: "Impact",
          detail: "The original authentication architecture could no longer satisfy the updated requirement.",
        },
        {
          id: "why-result",
          label: "Result",
          detail: "The team revised the authentication approach.",
        },
      ],
    },
    action: null,
    steps: [
      { id: "auth-s1", dateLabel: "Sep 16", title: "Enterprise SSO requirement added" },
      { id: "auth-s2", dateLabel: "Sep 17", title: "Authentication architecture discussed" },
      { id: "auth-s3", dateLabel: "Sep 18", title: "Auth0 selected" },
      { id: "auth-s4", dateLabel: "Sep 19", title: "Implementation tasks created" },
      { id: "auth-s5", dateLabel: "Sep 20", title: "Implementation started" },
      { id: "auth-s6", dateLabel: "Sep 21", title: "Token-refresh limitation discovered" },
      { id: "auth-s7", dateLabel: "Sep 22", title: "Authentication decision revised" },
    ],
    evidence: [
      {
        id: "ev-auth-meeting",
        kind: "meeting",
        kindLabel: "Meeting",
        dateLabel: "Sep 16",
        title: "Enterprise Customer Review",
        author: "Jordan Lee",
        projectName,
        excerpt: "Enterprise SSO is required for launch.",
        relationship: "This review introduced the requirement the original Auth0 plan could not satisfy.",
        meta: [],
      },
      {
        id: "ev-auth-jira",
        kind: "jira",
        kindLabel: "Jira",
        dateLabel: "Sep 19",
        title: "AUTH-142 · Implement enterprise authentication workflow",
        author: "Riley Chen",
        projectName,
        excerpt: "Implementation tasks were opened against the Auth0 decision.",
        relationship: "The ticket is the work that later had to follow the revised architecture.",
        meta: [
          { label: "Status", value: "In Progress" },
          { label: "Priority", value: "High" },
        ],
      },
      {
        id: "ev-auth-github",
        kind: "github",
        kindLabel: "GitHub",
        dateLabel: "Sep 20",
        title: "PR #184 · Authentication implementation",
        author: "Maya Chen",
        projectName,
        excerpt:
          "Token-refresh handling required changes after enterprise SSO requirements were introduced.",
        relationship: "This pull request is where the token-refresh limitation became visible.",
        meta: [],
      },
      {
        id: "ev-auth-discussion",
        kind: "discussion",
        kindLabel: "Discussion",
        dateLabel: "Sep 21",
        title: "#project-atlas",
        author: "Marcus Hale",
        projectName,
        excerpt: "Auth0 token refresh needs session state that conflicts with the enterprise SSO flow.",
        relationship: "The thread named the limitation before the architecture was revised.",
        meta: [],
      },
    ],
  },
  {
    id: "item-sso",
    slug: "enterprise-sso",
    projectId: "atlas",
    kind: "requirement",
    kindLabel: "Requirement changed",
    completionLabel: "Requirement Changed",
    title: "Enterprise SSO added to launch requirements",
    summary: "Customer feedback during the September 16 review put enterprise SSO in the launch scope.",
    navigatorLabel: "SSO requirement",
    guided: true,
    priority: "high",
    dateLabel: "Sep 16",
    change: {
      beforeLabel: "Previous requirement",
      beforeValue: "Standard authentication",
      afterLabel: "New requirement",
      afterValue: "Enterprise SSO required at launch",
    },
    details: [
      {
        id: "sso-why",
        label: "Why it changed",
        value: "The design partner would not accept a launch that lacked enterprise single sign-on.",
      },
      {
        id: "sso-feedback",
        label: "Customer feedback",
        value: "Enterprise SSO is required for launch.",
      },
      {
        id: "sso-downstream",
        label: "Downstream work affected",
        value: "Authentication architecture and the implementation plan both had to be revisited.",
      },
    ],
    reason: {
      prompt: "Why did this change?",
      summary: "The customer made enterprise SSO a condition of the initial launch.",
      points: [
        {
          id: "sso-r1",
          label: "Trigger",
          detail: "The September 16 customer review rejected a launch without enterprise SSO.",
        },
        {
          id: "sso-r2",
          label: "Change",
          detail: "Launch requirements moved from standard authentication to enterprise SSO.",
        },
        {
          id: "sso-r3",
          label: "Impact",
          detail: "The authentication architecture and implementation plan had to follow the new requirement.",
        },
      ],
    },
    action: null,
    steps: [
      { id: "sso-s1", dateLabel: "Sep 16", title: "Customer review meeting" },
      { id: "sso-s2", dateLabel: "Sep 16", title: "Customer requests enterprise SSO" },
      { id: "sso-s3", dateLabel: "Sep 16", title: "Launch requirements updated" },
      { id: "sso-s4", dateLabel: "Sep 17", title: "Authentication architecture affected" },
    ],
    evidence: [
      {
        id: "ev-sso-meeting",
        kind: "meeting",
        kindLabel: "Meeting",
        dateLabel: "Sep 16",
        title: "Enterprise Customer Review",
        author: "Jordan Lee",
        projectName,
        excerpt: "Enterprise SSO is required for launch.",
        relationship: "The meeting is the customer feedback that triggered the requirement change.",
        meta: [],
      },
      {
        id: "ev-sso-doc",
        kind: "document",
        kindLabel: "Document",
        dateLabel: "Sep 16",
        title: "Launch requirements",
        author: "Jordan Lee",
        projectName,
        excerpt: "Enterprise SSO is required for the initial launch, not a follow-up release.",
        relationship: "The document records the move from standard authentication.",
        meta: [],
      },
      {
        id: "ev-sso-discussion",
        kind: "discussion",
        kindLabel: "Discussion",
        dateLabel: "Sep 17",
        title: "Authentication architecture thread",
        author: "Priya Shah",
        projectName,
        excerpt: "If SSO is in the launch, the authentication approach has to be chosen against that constraint.",
        relationship: "The discussion connects the requirement to the architecture work that followed.",
        meta: [],
      },
    ],
  },
  {
    id: "item-payment",
    slug: "payment-sandbox",
    projectId: "atlas",
    kind: "blocker",
    kindLabel: "Blocker",
    completionLabel: "Blocker",
    title: "Payment sandbox integration delayed",
    summary: "Vendor environment access is still pending, so sandbox integration testing has not started.",
    navigatorLabel: "Payment blocker",
    guided: true,
    priority: "high",
    dateLabel: "Sep 23",
    change: null,
    details: [
      { id: "pay-status", label: "Blocker status", value: "Still unresolved" },
      { id: "pay-started", label: "When it started", value: "Sep 19, when vendor sandbox access was requested" },
      { id: "pay-reason", label: "Reason", value: "Vendor environment access remained pending." },
      { id: "pay-owner", label: "Owner", value: "Integration Team" },
      { id: "pay-tasks", label: "Affected tasks", value: "Payment sandbox integration testing" },
      {
        id: "pay-stopped",
        label: "What work cannot continue",
        value: "Integration testing against the payment sandbox.",
      },
    ],
    reason: {
      prompt: "Why did this change?",
      summary: "The vendor has not granted the environment the integration tests need.",
      points: [
        {
          id: "pay-r1",
          label: "Trigger",
          detail: "Sandbox access was requested on Sep 19 and never arrived.",
        },
        {
          id: "pay-r2",
          label: "Impact",
          detail: "Integration testing could not begin, and the blocker is still open.",
        },
      ],
    },
    action: null,
    steps: [
      { id: "pay-s1", dateLabel: "Sep 18", title: "Payment integration work was scheduled" },
      { id: "pay-s2", dateLabel: "Sep 19", title: "Vendor sandbox access requested" },
      { id: "pay-s3", dateLabel: "Sep 21", title: "Environment access remained pending" },
      { id: "pay-s4", dateLabel: "Sep 23", title: "Integration testing could not begin" },
    ],
    evidence: [
      {
        id: "ev-pay-jira",
        kind: "jira",
        kindLabel: "Jira",
        dateLabel: "Sep 19",
        title: "PAY-88 · Sandbox access requested",
        author: "Marcus Hale",
        projectName,
        excerpt: "Asked Clearwater Payments for sandbox credentials and an environment URL.",
        relationship: "This is the request the team is still waiting on.",
        meta: [
          { label: "Status", value: "Blocked" },
          { label: "Priority", value: "High" },
        ],
      },
      {
        id: "ev-pay-discussion",
        kind: "discussion",
        kindLabel: "Discussion",
        dateLabel: "Sep 23",
        title: "#payments",
        author: "Marcus Hale",
        projectName,
        excerpt: "No credentials yet. Testing has not started.",
        relationship: "The latest update confirms the blocked work still cannot continue.",
        meta: [],
      },
    ],
  },
  {
    id: "item-review",
    slug: "review-auth-approach",
    projectId: "atlas",
    kind: "action",
    kindLabel: "Action required",
    completionLabel: "Action Required",
    title: "Review revised authentication/API approach",
    summary: "Alex needs to review the revised authentication architecture and the open API claims shape.",
    navigatorLabel: "Your review",
    guided: true,
    priority: "high",
    dateLabel: "Sep 24",
    change: null,
    details: [
      {
        id: "act-what",
        label: "What Alex needs to review",
        value:
          "The custom authentication architecture, and whether enterprise identity claims belong on the session response.",
      },
      {
        id: "act-why",
        label: "Why his review is required",
        value: "Alex owns the frontend authentication handling that has to follow the revised decision.",
      },
      { id: "act-due", label: "Due", value: "Sep 24" },
      { id: "act-status", label: "Status", value: "Waiting on you" },
      {
        id: "act-decision",
        label: "Related decision",
        value: "Authentication architecture revised on Sep 22, from Auth0 to a custom architecture.",
      },
    ],
    reason: {
      prompt: "Why did this change?",
      summary: "The architecture revision landed while Alex was away, and the API shape is still open.",
      points: [
        {
          id: "act-r1",
          label: "Trigger",
          detail: "The Sep 22 decision replaced Auth0 after Alex had left.",
        },
        {
          id: "act-r2",
          label: "Impact",
          detail: "Frontend authentication handling and the API contract both depend on his review.",
        },
        {
          id: "act-r3",
          label: "Result",
          detail: "Implementation is waiting on that review before the approach is treated as settled.",
        },
      ],
    },
    action: {
      ask: "Review the revised authentication architecture and the open API approach before implementation continues.",
      dueLabel: "Sep 24",
      statusLabel: "Waiting on you",
    },
    steps: [
      { id: "act-s1", dateLabel: "Sep 22", title: "Authentication decision revised" },
      { id: "act-s2", dateLabel: "Sep 23", title: "API claims left unresolved" },
      { id: "act-s3", dateLabel: "Sep 23", title: "Review assigned to Alex" },
    ],
    evidence: [
      {
        id: "ev-act-doc",
        kind: "document",
        kindLabel: "Document",
        dateLabel: "Sep 22",
        title: "Authentication architecture revised",
        author: "Priya Shah",
        projectName,
        excerpt: "The Auth0 implementation is no longer the approach the team is building.",
        relationship: "This is the decision Alex is being asked to review.",
        meta: [],
      },
      {
        id: "ev-act-github",
        kind: "github",
        kindLabel: "GitHub",
        dateLabel: "Sep 20",
        title: "PR #184 · Authentication implementation",
        author: "Maya Chen",
        projectName,
        excerpt:
          "Token-refresh handling required changes after enterprise SSO requirements were introduced.",
        relationship: "The pull request shows the limitation that forced the revised approach.",
        meta: [],
      },
      {
        id: "ev-act-discussion",
        kind: "discussion",
        kindLabel: "Discussion",
        dateLabel: "Sep 23",
        title: "#api-contract",
        author: "Priya Shah",
        projectName,
        excerpt: "Alex should confirm the claims shape before the contract is frozen.",
        relationship: "The thread is the API half of the review.",
        meta: [],
      },
    ],
  },
  {
    id: "item-api",
    slug: "api-contract",
    projectId: "atlas",
    kind: "discussion",
    kindLabel: "Unresolved discussion",
    completionLabel: "Unresolved Discussion",
    title: "API contract question needs resolution",
    summary:
      "Frontend and backend have not agreed how enterprise identity claims should appear in the API.",
    navigatorLabel: "API contract",
    guided: true,
    priority: "high",
    dateLabel: "Sep 23",
    change: null,
    details: [
      {
        id: "api-question",
        label: "Question being discussed",
        value: "How should enterprise identity claims be represented in the API response?",
      },
      {
        id: "api-views",
        label: "Competing viewpoints",
        value:
          "Frontend wants the claims on the session payload. Backend wants a separate identity resource so the public API stays decoupled from the provider.",
      },
      {
        id: "api-people",
        label: "People involved",
        value: "Priya Shah (Frontend), Noah Adler (Backend), Elena Voss (Platform)",
      },
      {
        id: "api-open",
        label: "Why it remains unresolved",
        value: "The group has not agreed where the claims live, and the draft is still marked open.",
      },
      {
        id: "api-alex",
        label: "Why Alex's input is needed",
        value: "The decision affects frontend authentication handling, which Alex owns.",
      },
    ],
    reason: {
      prompt: "Why did this change?",
      summary: "The revised architecture raised a claims question the API contract does not answer yet.",
      points: [
        {
          id: "api-r1",
          label: "Trigger",
          detail: "Enterprise SSO required new identity claims in the client.",
        },
        {
          id: "api-r2",
          label: "Discovery",
          detail: "Frontend and backend proposed different places for those claims.",
        },
        {
          id: "api-r3",
          label: "Result",
          detail: "The contract is unresolved until Alex confirms what the frontend needs to read.",
        },
      ],
    },
    action: null,
    steps: [
      { id: "api-s1", dateLabel: "Sep 22", title: "Revised authentication approach agreed" },
      { id: "api-s2", dateLabel: "Sep 23", title: "Claims shape raised in the API thread" },
      { id: "api-s3", dateLabel: "Sep 23", title: "No contract agreed" },
    ],
    evidence: [
      {
        id: "ev-api-priya",
        kind: "discussion",
        kindLabel: "Discussion",
        dateLabel: "Sep 23",
        title: "#api-contract · Frontend",
        author: "Priya Shah",
        projectName,
        excerpt:
          "If enterprise claims stay out of the session response, the client needs a second call before it can render an authenticated view.",
        relationship: "This is the frontend viewpoint. It is not agreed.",
        meta: [],
      },
      {
        id: "ev-api-noah",
        kind: "discussion",
        kindLabel: "Discussion",
        dateLabel: "Sep 23",
        title: "#api-contract · Backend",
        author: "Noah Adler",
        projectName,
        excerpt:
          "Putting every identity claim on the session payload couples the public API to the identity provider.",
        relationship: "This is the competing backend viewpoint.",
        meta: [],
      },
      {
        id: "ev-api-elena",
        kind: "document",
        kindLabel: "Document",
        dateLabel: "Sep 23",
        title: "Session contract draft",
        author: "Elena Voss",
        projectName,
        excerpt: "Platform has not signed the claims list. The draft is marked unresolved.",
        relationship: "The draft shows why the question is still open and why Alex was asked to weigh in.",
        meta: [],
      },
    ],
  },
  {
    id: "item-tasks",
    slug: "auth-tasks",
    projectId: "atlas",
    kind: "task",
    kindLabel: "Task impact",
    completionLabel: "Task impact",
    title: "Authentication implementation tasks changed",
    summary: "Several implementation tasks were revised after the architecture decision changed.",
    navigatorLabel: "Task changes",
    guided: false,
    priority: "high",
    dateLabel: "Sep 23",
    change: null,
    details: [
      { id: "task-142", label: "AUTH-142 · Implement authentication integration", value: "Revised" },
      { id: "task-147", label: "AUTH-147 · Add token refresh handling", value: "Cancelled / replaced" },
      { id: "task-153", label: "AUTH-153 · Implement revised session strategy", value: "New" },
    ],
    reason: {
      prompt: "Why did this change?",
      summary: "The September 22 decision changed the work in flight.",
      points: [
        {
          id: "task-r1",
          label: "Cause",
          detail: "The Auth0 approach was revised.",
        },
        {
          id: "task-r2",
          label: "Consequence",
          detail: "AUTH-147 was cancelled and AUTH-153 was opened for the revised session strategy.",
        },
      ],
    },
    action: null,
    steps: [
      { id: "tasks-s1", dateLabel: "Sep 19", title: "Auth0 implementation tasks created" },
      { id: "tasks-s2", dateLabel: "Sep 22", title: "Authentication decision revised" },
      { id: "tasks-s3", dateLabel: "Sep 23", title: "Downstream tasks rewritten" },
    ],
    evidence: [
      {
        id: "ev-tasks-doc",
        kind: "document",
        kindLabel: "Document",
        dateLabel: "Sep 22",
        title: "Authentication architecture revised",
        author: "Priya Shah",
        projectName,
        excerpt: "The Auth0 implementation is no longer the approach the team is building.",
        relationship: "This decision is the cause. The task changes are the consequence.",
        meta: [],
      },
      {
        id: "ev-tasks-142",
        kind: "jira",
        kindLabel: "Jira",
        dateLabel: "Sep 23",
        title: "AUTH-142 · Implement authentication integration",
        author: "Riley Chen",
        projectName,
        excerpt: "Scope revised to the custom authentication architecture.",
        relationship: "The original implementation ticket now follows the revised decision.",
        meta: [{ label: "Status", value: "In Progress" }],
      },
    ],
  },
  {
    id: "item-protocols",
    slug: "identity-protocols",
    projectId: "atlas",
    kind: "requirement",
    kindLabel: "Requirement changed",
    completionLabel: "Requirement Changed",
    title: "SAML 2.0 and OIDC both required",
    summary: "The September 17 discussion expanded identity-provider support to SAML 2.0 and OIDC.",
    navigatorLabel: "SAML and OIDC",
    guided: false,
    priority: "medium",
    dateLabel: "Sep 17",
    change: {
      beforeLabel: "Previous requirement",
      beforeValue: "OIDC only",
      afterLabel: "New requirement",
      afterValue: "SAML 2.0 and OIDC",
    },
    details: [
      {
        id: "proto-why",
        label: "Why it changed",
        value: "Design partners do not share one identity protocol.",
      },
      {
        id: "proto-down",
        label: "Downstream work affected",
        value: "Protocol support widened the authentication work that followed the SSO requirement.",
      },
    ],
    reason: {
      prompt: "Why did this change?",
      summary: "One protocol would have left some design partners unable to sign in.",
      points: [
        {
          id: "proto-r1",
          label: "Trigger",
          detail: "Engineering found partners who only speak SAML.",
        },
        {
          id: "proto-r2",
          label: "Result",
          detail: "Launch support is SAML 2.0 and OIDC. Other protocols stay out of scope.",
        },
      ],
    },
    action: null,
    steps: [
      { id: "proto-s1", dateLabel: "Sep 17", title: "Engineering discusses identity protocols" },
      { id: "proto-s2", dateLabel: "Sep 17", title: "Requirement expanded" },
    ],
    evidence: [
      {
        id: "ev-proto-discussion",
        kind: "discussion",
        kindLabel: "Discussion",
        dateLabel: "Sep 17",
        title: "Authentication architecture thread",
        author: "Priya Shah",
        projectName,
        excerpt: "OIDC alone will not cover the design partners who only speak SAML.",
        relationship: "The thread is where the second requirement change was named.",
        meta: [],
      },
      {
        id: "ev-proto-doc",
        kind: "document",
        kindLabel: "Document",
        dateLabel: "Sep 17",
        title: "Identity provider note",
        author: "Elena Voss",
        projectName,
        excerpt: "Launch support is SAML 2.0 and OIDC.",
        relationship: "The note records the requirement next to the SSO launch change.",
        meta: [],
      },
    ],
  },
  {
    id: "item-clients",
    slug: "client-credentials",
    projectId: "atlas",
    kind: "decision",
    kindLabel: "Decision changed",
    completionLabel: "Decision Changed",
    title: "Partner APIs use client credentials",
    summary: "Partner API access will use OAuth client credentials, kept separate from interactive enterprise SSO.",
    navigatorLabel: "Partner API access",
    guided: false,
    priority: "medium",
    dateLabel: "Sep 19",
    change: {
      beforeLabel: "Original decision",
      beforeValue: "Shared interactive session",
      afterLabel: "Revised decision",
      afterValue: "OAuth client credentials for partners",
    },
    details: [],
    reason: {
      prompt: "Why did this change?",
      summary: "Partner integrations should not depend on the user session the architecture review was changing.",
      points: [
        {
          id: "client-r1",
          label: "Result",
          detail: "This decision stayed in place when the interactive architecture was revised.",
        },
      ],
    },
    action: null,
    steps: [
      { id: "client-s1", dateLabel: "Sep 19", title: "Partner access discussed" },
      { id: "client-s2", dateLabel: "Sep 19", title: "Client credentials selected" },
    ],
    evidence: [
      {
        id: "ev-client-meeting",
        kind: "meeting",
        kindLabel: "Meeting",
        dateLabel: "Sep 19",
        title: "Platform working session",
        author: "Elena Voss",
        projectName,
        excerpt: "Partner calls authenticate with client credentials. They do not use the interactive SSO session.",
        relationship: "This decision stayed in place when the interactive architecture was revised.",
        meta: [],
      },
    ],
  },
  {
    id: "item-bridge",
    slug: "auth0-bridge",
    projectId: "atlas",
    kind: "discussion",
    kindLabel: "Unresolved discussion",
    completionLabel: "Unresolved Discussion",
    title: "Auth0 bridge still unresolved",
    summary: "The team has not agreed whether Auth0 stays available for the design partner already in sandbox.",
    navigatorLabel: "Auth0 bridge",
    guided: false,
    priority: "medium",
    dateLabel: "Sep 23",
    change: null,
    details: [
      {
        id: "bridge-q",
        label: "Question being discussed",
        value: "Should Auth0 remain available for the design partner already in the sandbox?",
      },
      {
        id: "bridge-people",
        label: "People involved",
        value: "Elena Voss (Security), Priya Shah (Engineering)",
      },
      {
        id: "bridge-open",
        label: "Why it remains unresolved",
        value: "A short bridge would avoid a sandbox reset, but it has no end date.",
      },
    ],
    reason: {
      prompt: "Why did this change?",
      summary: "A leftover bridge would keep two authentication paths in the launch.",
      points: [
        {
          id: "bridge-r1",
          label: "Result",
          detail: "Security is holding the question open after the architecture revision.",
        },
      ],
    },
    action: null,
    steps: [
      { id: "bridge-s1", dateLabel: "Sep 22", title: "Auth0 left the primary approach" },
      { id: "bridge-s2", dateLabel: "Sep 23", title: "Sandbox bridge still debated" },
    ],
    evidence: [
      {
        id: "ev-bridge-elena",
        kind: "discussion",
        kindLabel: "Discussion",
        dateLabel: "Sep 23",
        title: "#project-atlas",
        author: "Elena Voss",
        projectName,
        excerpt: "If the sandbox partner stays on Auth0, we are supporting two session models through launch.",
        relationship: "Security is holding the question open after the architecture revision.",
        meta: [],
      },
    ],
  },
]

export function itemsForProject(projectId: string): CatchUpItem[] {
  return catchUpItems.filter((item) => item.projectId === projectId)
}

export function guidedItemsForProject(projectId: string): CatchUpItem[] {
  return itemsForProject(projectId).filter((item) => item.guided)
}

export function itemBySlug(projectId: string, slug: string): CatchUpItem | undefined {
  return itemsForProject(projectId).find((item) => item.slug === slug)
}

export function itemMatchesFilter(item: CatchUpItem, filter: CatchUpFilter): boolean {
  return filter === "all" || item.kind === filter
}

export function completionSummary(items: CatchUpItem[]): { id: CatchUpKind; line: string }[] {
  const guided = items.filter((item) => item.guided)
  return completionOrder.map((kind) => {
    const matches = guided.filter((item) => item.kind === kind)
    const label = matches[0]?.completionLabel ?? kind
    return { id: kind, line: `${matches.length} ${label}` }
  })
}
