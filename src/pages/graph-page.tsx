import { PlaceholderPage } from "@/components/common/placeholder-page"

export function GraphPage() {
  return (
    <PlaceholderPage
      title="Context Graph"
      summary="Explore relationships between requirements, discussions, decisions, tasks, code changes, and blockers."
      detail="A later view will trace Requirement → Meeting → Decision → Jira → PR → Problem → Revised Decision for the authentication change. The graph is not drawn in this phase."
    />
  )
}
