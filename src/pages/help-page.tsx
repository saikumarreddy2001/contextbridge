import { PlaceholderPage } from "@/components/common/placeholder-page"

const topics = [
  ["Overview", "What changed on the active project while you were away."],
  ["What I Missed", "A guided walk through the five stories from your time away."],
  ["Timeline", "The September 16–23 Atlas story, arranged by narrative."],
  ["Context Graph", "How a requirement connects to the decision that replaced it."],
  ["Decisions", "What was chosen, why, and when it changed."],
  ["Sources", "The meetings, tickets, pull requests, documents, and discussions underneath."],
  ["Ask Context", "A question about Project Atlas, answered from the records with the evidence beside it."],
]

export function HelpPage() {
  return (
    <PlaceholderPage
      title="Help"
      summary="How this demo is organized. Project Atlas is synthetic data, not a connected workspace."
      detail="Header search submits to Search. ⌘K or Ctrl K focuses that field. Slack, Jira, and GitHub are not connected. The profile menu does not sign you in or out."
    >
      <ul className="divide-y rounded-lg border">
        {topics.map(([title, body]) => (
          <li key={title} className="px-3 py-2.5">
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>
    </PlaceholderPage>
  )
}
