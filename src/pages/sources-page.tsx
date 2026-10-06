import { PlaceholderPage } from "@/components/common/placeholder-page"
import { getSources } from "@/data/selectors"
import { useProject } from "@/hooks/use-selection"

export function SourcesPage() {
  const { project } = useProject()
  const records = project ? getSources(project.id) : []
  const detail =
    records.length > 0
      ? `${records.length} source records sit behind Project Atlas, including the September 16 customer review, the authentication pull request, and ADR-014. A source catalog is not built in this phase.`
      : "No source catalog is loaded for this project. Meetings, tickets, code changes, documents, and discussions will be browsable here later."

  return (
    <PlaceholderPage
      title="Sources"
      summary="Explore the meetings, tickets, code changes, documents, and discussions behind your project history."
      detail={detail}
    />
  )
}
