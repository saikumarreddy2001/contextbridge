import { CatchUpSummary } from "@/components/dashboard/catch-up-summary"
import { AttentionList } from "@/components/dashboard/attention-list"
import { ImportantChanges } from "@/components/dashboard/important-changes"
import { ProjectSnapshot } from "@/components/dashboard/project-snapshot"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { WelcomeHeader } from "@/components/dashboard/welcome-header"
import { EmptyWorkspace } from "@/components/common/empty-workspace"
import { PageContainer } from "@/components/common/page-container"
import { useProject, useWorkspace } from "@/hooks/use-selection"

export function OverviewPage() {
  const { workspace } = useWorkspace()
  const { project } = useProject()

  if (!project) return <EmptyWorkspace workspaceName={workspace.name} />

  return (
    <PageContainer>
      <WelcomeHeader />
      <CatchUpSummary projectId={project.id} projectName={project.name} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
        <ImportantChanges projectId={project.id} projectName={project.name} />
        <RecentActivity projectId={project.id} projectName={project.name} />
      </div>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <AttentionList projectId={project.id} projectName={project.name} />
        <ProjectSnapshot project={project} />
      </div>
    </PageContainer>
  )
}
