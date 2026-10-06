import type { RequirementChange } from "@/types"

export const requirementChanges: RequirementChange[] = [
  {
    id: "req-sso",
    projectId: "atlas",
    title: "Enterprise SSO added to launch requirements",
    summary:
      "Customer feedback during the September 16 review introduced enterprise SSO as a launch requirement.",
    priority: "high",
    status: "open",
    changedOn: "Sep 16",
    sources: ["meeting"],
  },
  {
    id: "req-protocols",
    projectId: "atlas",
    title: "SAML 2.0 and OIDC both required",
    summary:
      "The September 17 engineering discussion expanded identity-provider support to SAML 2.0 and OIDC.",
    priority: "medium",
    status: "open",
    changedOn: "Sep 17",
    sources: ["discussion", "document"],
  },
]
