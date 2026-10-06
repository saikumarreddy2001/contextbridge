import { PlaceholderPage } from "@/components/common/placeholder-page"

const topics = [
  ["Overview", "What changed on the active project while you were away."],
  ["What I Missed", "A guided walk through the five stories from your time away."],
  ["Timeline", "How the project evolved, once that view is drawn."],
  ["Context Graph", "How a requirement connects to the decision that replaced it."],
  ["Decisions", "What was chosen, why, and when it changed."],
  ["Sources", "The meetings, tickets, pull requests, documents, and discussions underneath."],
]

export function HelpPage() {
  return (
    <PlaceholderPage
      title="Help"
      summary="How ContextBridge is organized, and where the Atlas story will live."
      detail="The header search field shows a ⌘K / Ctrl K hint. It does not run a query yet. Profile menu items do not sign you out or change an account."
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
