import { AllChanges } from "@/components/catchup/all-changes"
import { CatchUpComplete } from "@/components/catchup/catch-up-complete"
import { CatchUpIntro } from "@/components/catchup/catch-up-intro"
import { CatchUpProgress } from "@/components/catchup/catch-up-progress"
import { EvidencePanel } from "@/components/catchup/evidence-panel"
import { StoryNavigator } from "@/components/catchup/story-navigator"
import { StoryView } from "@/components/catchup/story-view"
import { EmptyWorkspace } from "@/components/common/empty-workspace"
import { PageContainer } from "@/components/common/page-container"
import { catchUpWindow, completionSummary } from "@/data/catch-up-stories"
import { countProjectActivities } from "@/data/selectors"
import { useCatchUp } from "@/hooks/use-catch-up"
import { useMinWidth } from "@/hooks/use-media"
import { useProject, useWorkspace } from "@/hooks/use-selection"

export function CatchUpPage() {
  const { workspace } = useWorkspace()
  const { project } = useProject()

  if (!project) return <EmptyWorkspace workspaceName={workspace.name} />
  if (project.id !== catchUpWindow.projectId) return <QuietCatchUp name={project.name} />

  return <AtlasCatchUp projectId={project.id} />
}

function AtlasCatchUp({ projectId }: { projectId: string }) {
  const catchUp = useCatchUp(projectId)
  const desktop = useMinWidth(1024)
  const activityCount = countProjectActivities(projectId)
  const item = catchUp.selectedCatchUpItem

  function closeEvidence() {
    catchUp.closeEvidence()
    document.getElementById("view-evidence")?.focus()
  }

  return (
    <div className="pb-16">
      {catchUp.mode === "intro" ? (
        <CatchUpIntro
          activityCount={activityCount}
          changeCount={catchUp.items.length}
          onStart={catchUp.start}
          onViewAll={catchUp.openAll}
        />
      ) : null}

      {catchUp.mode === "all" ? (
        <AllChanges
          stories={catchUp.items}
          filter={catchUp.selectedFilter}
          viewedIds={catchUp.viewedIds}
          onFilter={catchUp.setSelectedFilter}
          onOpen={catchUp.openItem}
        />
      ) : null}

      {catchUp.mode === "complete" ? (
        <CatchUpComplete
          reviewedCount={catchUp.guidedItems.length}
          summary={completionSummary(catchUp.items)}
        />
      ) : null}

      {item && (catchUp.mode === "guided" || catchUp.mode === "story") ? (
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          {catchUp.mode === "guided" ? (
            <div className="mb-6 space-y-4">
              <CatchUpProgress
                items={catchUp.guidedItems}
                activeId={item.id}
                onSelect={catchUp.openItem}
              />
              <StoryNavigator
                stories={catchUp.guidedItems}
                activeId={item.id}
                viewedIds={catchUp.viewedIds}
                onSelect={catchUp.openItem}
                onViewAll={catchUp.openAll}
              />
            </div>
          ) : (
            <p className="mb-6 text-xs text-muted-foreground">
              {catchUpWindow.projectName} · {catchUpWindow.startLabel} – {catchUpWindow.endLabel} · related change
            </p>
          )}
          <StoryView
            item={item}
            expandedReason={catchUp.expandedReason}
            onToggleReason={() => catchUp.setExpandedReason(!catchUp.expandedReason)}
            onOpenEvidence={() => catchUp.openEvidence()}
            showGuidedNav={catchUp.mode === "guided"}
            canGoPrevious={catchUp.guidedIndex > 0}
            onPrevious={catchUp.goPrevious}
            onNext={catchUp.goNext}
            onBackToAll={catchUp.openAll}
            evidence={
              desktop && catchUp.evidencePanelOpen ? (
                <EvidencePanel
                  open
                  evidence={item.evidence}
                  selectedId={catchUp.selectedEvidence?.id ?? null}
                  onSelect={catchUp.selectEvidence}
                  onClose={closeEvidence}
                  inline
                />
              ) : null
            }
          />
          {desktop ? null : (
            <EvidencePanel
              open={catchUp.evidencePanelOpen}
              evidence={item.evidence}
              selectedId={catchUp.selectedEvidence?.id ?? null}
              onSelect={catchUp.selectEvidence}
              onClose={closeEvidence}
              inline={false}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}

function QuietCatchUp({ name }: { name: string }) {
  return (
    <PageContainer>
      <div className="max-w-xl py-8">
        <h1 className="text-2xl font-medium tracking-tight">What you missed</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {name} did not record a catch-up story while you were away. Project Atlas holds the
          September 16–23 reconstruction.
        </p>
      </div>
    </PageContainer>
  )
}
