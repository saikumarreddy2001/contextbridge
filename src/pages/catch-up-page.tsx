import { CatchUpSummary } from "@/components/dashboard/catch-up-summary"
import { ImportantChanges } from "@/components/dashboard/important-changes"
import { EmptyWorkspace } from "@/components/common/empty-workspace"
import { PageContainer } from "@/components/common/page-container"
import { useProject, useWorkspace } from "@/hooks/use-selection"

export function CatchUpPage() {
  const { workspace } = useWorkspace()
  const { project } = useProject()

  if (!project) return <EmptyWorkspace workspaceName={workspace.name} />

  return (
    <PageContainer>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-medium tracking-tight">What You Missed</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The decisions, requirement changes, and blocker from your eight days away on{" "}
          {project.name}. Walking a change from the meeting that introduced it through the
          revision is not part of this view.
        </p>
      </div>
      <CatchUpSummary projectId={project.id} projectName={project.name} />
      <ImportantChanges projectId={project.id} projectName={project.name} />
    </PageContainer>
  )
}
