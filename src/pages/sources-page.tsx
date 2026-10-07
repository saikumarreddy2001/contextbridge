import { PlaceholderPage } from "@/components/common/placeholder-page"
import { getSources } from "@/data/selectors"
import { useProject } from "@/hooks/use-selection"

export function SourcesPage() {
  const { project } = useProject()
  const records = project ? getSources(project.id) : []
  const detail =
    records.length > 0
      ? `${records.length} synthetic source records sit behind Project Atlas, including the September 16 customer review, the authentication pull request, and ADR-014. Slack, Jira, and GitHub are not connected.`
      : "No source catalog is loaded for this project. The sample records are synthetic. Slack, Jira, and GitHub are not connected."

  return (
    <PlaceholderPage
      title="Sources"
      summary="Explore the meetings, tickets, code changes, documents, and discussions behind your project history."
      detail={detail}
    />
  )
}
