import { PlaceholderPage } from "@/components/common/placeholder-page"
import { getDecisionCount } from "@/data/selectors"
import { useProject } from "@/hooks/use-selection"

export function DecisionsPage() {
  const { project } = useProject()
  const count = project ? getDecisionCount(project.id) : 0
  const detail = project
    ? count > 0
      ? `${project.name} has ${count} important decisions on record, including the September 18 Auth0 choice and the September 22 revision. Open Overview and use “See why this changed” to read that reversal. A decision log is not built in this phase.`
      : `${project.name} has no decisions on record from your time away. A decision log is not built in this phase.`
    : "Select a project in Northstar Technologies to see which decisions are on record. A decision log is not built in this phase."

  return (
    <PlaceholderPage
      title="Decisions"
      summary="Understand what was decided, why it was decided, and when that decision changed."
      detail={detail}
    />
  )
}
