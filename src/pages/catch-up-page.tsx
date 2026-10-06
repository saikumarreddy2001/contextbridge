import { AllChanges } from "@/components/catchup/all-changes"
import { CatchUpComplete } from "@/components/catchup/catch-up-complete"
import { CatchUpIntro } from "@/components/catchup/catch-up-intro"
import { CatchUpProgress } from "@/components/catchup/catch-up-progress"
import { EvidencePanel } from "@/components/catchup/evidence-panel"
import { StoryNavigator } from "@/components/catchup/story-navigator"
import { StoryView } from "@/components/catchup/story-view"
import { EmptyWorkspace } from "@/components/common/empty-workspace"
import { PageContainer } from "@/components/common/page-container"
import { catchUpWindow } from "@/data/catch-up-stories"
import {
  countProjectActivities,
  getBlockerCount,
  getDecisionCount,
  getRequirementCount,
} from "@/data/selectors"
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

  function closeEvidence() {
    catchUp.closeEvidence()
    document.getElementById("view-evidence")?.focus()
  }

  return (
    <div className="pb-16">
      {catchUp.mode === "intro" ? (
        <CatchUpIntro
          activityCount={activityCount}
          changeCount={catchUp.stories.length}
          onStart={catchUp.start}
          onViewAll={catchUp.openAll}
        />
      ) : null}

      {catchUp.mode === "all" ? (
        <AllChanges
          stories={catchUp.stories}
          filter={catchUp.selectedFilter}
          viewedIds={catchUp.viewedStoryIds}
          onFilter={catchUp.setSelectedFilter}
          onOpen={catchUp.openStory}
        />
      ) : null}

      {catchUp.mode === "complete" ? (
        <CatchUpComplete
          storyCount={catchUp.guidedStories.length}
          decisionCount={getDecisionCount(projectId)}
          requirementCount={getRequirementCount(projectId)}
          blockerCount={getBlockerCount(projectId)}
          onReviewAll={catchUp.openAll}
          onOpenStory={catchUp.openStory}
        />
      ) : null}

      {catchUp.activeStory && (catchUp.mode === "guided" || catchUp.mode === "story") ? (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
          {catchUp.mode === "guided" ? (
            <div className="mb-6 space-y-4">
              <CatchUpProgress index={catchUp.guidedIndex} total={catchUp.guidedStories.length} />
              <StoryNavigator
                stories={catchUp.guidedStories}
                activeId={catchUp.activeStory.id}
                viewedIds={catchUp.viewedStoryIds}
                onSelect={catchUp.openStory}
                onViewAll={catchUp.openAll}
              />
            </div>
          ) : (
            <p className="mb-6 text-xs text-muted-foreground">
              {catchUpWindow.projectName} · {catchUpWindow.startLabel} – {catchUpWindow.endLabel} · related change
            </p>
          )}
          <div className={desktop && catchUp.evidencePanelOpen ? "grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" : ""}>
            <StoryView
              story={catchUp.activeStory}
              whyOpen={catchUp.whyOpen}
              onToggleWhy={() => catchUp.setWhyOpen(!catchUp.whyOpen)}
              onOpenEvidence={() => catchUp.openEvidence()}
              showGuidedNav={catchUp.mode === "guided"}
              canGoPrevious={catchUp.guidedIndex > 0}
              onPrevious={catchUp.goPrevious}
              onNext={catchUp.goNext}
              onBackToAll={catchUp.openAll}
            />
            <EvidencePanel
              open={catchUp.evidencePanelOpen}
              evidence={catchUp.activeStory.evidence}
              selectedId={catchUp.selectedEvidenceId}
              onSelect={catchUp.setSelectedEvidenceId}
              onClose={closeEvidence}
              inline={desktop}
            />
          </div>
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
