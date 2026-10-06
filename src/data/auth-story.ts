import type { AuthStoryStep } from "@/types"

export const authStory: AuthStoryStep[] = [
  {
    id: "story-0916",
    dateLabel: "Sep 16",
    title: "Customer meeting",
    detail: "Enterprise SSO is introduced as a launch requirement.",
    source: "meeting",
  },
  {
    id: "story-0917",
    dateLabel: "Sep 17",
    title: "Engineering discussion",
    detail: "The team discusses authentication architecture.",
    source: "discussion",
  },
  {
    id: "story-0918",
    dateLabel: "Sep 18",
    title: "Decision",
    detail: "The team decides to use Auth0.",
    source: "meeting",
  },
  {
    id: "story-0919",
    dateLabel: "Sep 19",
    title: "Jira",
    detail: "Tasks are created for the authentication implementation.",
    source: "jira",
  },
  {
    id: "story-0920",
    dateLabel: "Sep 20",
    title: "GitHub",
    detail: "A pull request starts the Auth0 implementation.",
    source: "github",
  },
  {
    id: "story-0921",
    dateLabel: "Sep 21",
    title: "Problem",
    detail: "Token-refresh limitations are discovered during implementation.",
    source: "github",
  },
  {
    id: "story-0922",
    dateLabel: "Sep 22",
    title: "Revised decision",
    detail: "The authentication architecture is revised.",
    source: "meeting",
  },
  {
    id: "story-0923",
    dateLabel: "Sep 23",
    title: "Implementation",
    detail: "Implementation moves to the revised approach.",
    source: "github",
  },
]
