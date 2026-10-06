import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  guidedStoriesForProject,
  storyBySlug,
  storiesForProject,
} from "@/data/catch-up-stories"
import type { CatchUpFilter, CatchUpStory, Evidence } from "@/types"

export type CatchUpMode = "intro" | "guided" | "story" | "all" | "complete"

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable
}

export function useCatchUp(projectId: string) {
  const [params, setParams] = useSearchParams()
  const [viewedStoryIds, setViewedStoryIds] = useState<string[]>([])
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)
  const [evidencePanelOpen, setEvidencePanelOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<CatchUpFilter>("all")
  const [whyOpen, setWhyOpen] = useState(false)

  const view = params.get("view")
  const slug = params.get("story")
  const stories = storiesForProject(projectId)
  const guidedStories = guidedStoriesForProject(projectId)
  const activeStory = slug ? storyBySlug(projectId, slug) : undefined
  const guidedIndex = activeStory ? guidedStories.findIndex((story) => story.id === activeStory.id) : -1

  let mode: CatchUpMode = "intro"
  if (view === "all") mode = "all"
  else if (view === "complete") mode = "complete"
  else if (activeStory && guidedIndex >= 0) mode = "guided"
  else if (activeStory) mode = "story"
  else if (slug) mode = "intro"

  if (activeStory && !viewedStoryIds.includes(activeStory.id)) {
    setViewedStoryIds([...viewedStoryIds, activeStory.id])
  }

  useEffect(() => {
    if (mode !== "guided" || !activeStory) return
    const story = activeStory
    const sequence = guidedStoriesForProject(projectId)

    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return
      if (event.key === "Escape") {
        if (!evidencePanelOpen) return
        event.preventDefault()
        setEvidencePanelOpen(false)
        document.getElementById("view-evidence")?.focus()
        return
      }
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
      event.preventDefault()
      const index = sequence.findIndex((item) => item.id === story.id)
      if (index < 0) return
      const delta = event.key === "ArrowRight" ? 1 : -1
      const nextIndex = index + delta
      if (nextIndex < 0) return
      const next = sequence[nextIndex]
      setEvidencePanelOpen(false)
      setSelectedEvidenceId(null)
      setWhyOpen(false)
      if (!next) {
        setParams({ view: "complete" })
        return
      }
      setParams({ story: next.slug })
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [mode, activeStory, evidencePanelOpen, projectId, setParams])

  function openStory(nextSlug: string) {
    setEvidencePanelOpen(false)
    setSelectedEvidenceId(null)
    setWhyOpen(false)
    setParams({ story: nextSlug })
  }

  function openAll() {
    setEvidencePanelOpen(false)
    setSelectedEvidenceId(null)
    setParams({ view: "all" })
  }

  function openIntro() {
    setEvidencePanelOpen(false)
    setSelectedEvidenceId(null)
    setParams({})
  }

  function openComplete() {
    setEvidencePanelOpen(false)
    setSelectedEvidenceId(null)
    setWhyOpen(false)
    setParams({ view: "complete" })
  }

  function start() {
    const first = guidedStories[0]
    if (!first) return
    openStory(first.slug)
  }

  function goNext() {
    if (!activeStory || guidedIndex < 0) return
    const next = guidedStories[guidedIndex + 1]
    if (!next) {
      openComplete()
      return
    }
    openStory(next.slug)
  }

  function goPrevious() {
    if (guidedIndex <= 0) return
    const previous = guidedStories[guidedIndex - 1]
    if (!previous) return
    openStory(previous.slug)
  }

  function openEvidence(evidenceId?: string) {
    const first = activeStory?.evidence[0]
    setSelectedEvidenceId(evidenceId ?? first?.id ?? null)
    setEvidencePanelOpen(true)
  }

  function closeEvidence() {
    setEvidencePanelOpen(false)
  }

  const selectedEvidence: Evidence | undefined = activeStory?.evidence.find(
    (item) => item.id === selectedEvidenceId,
  )

  return {
    mode,
    stories,
    guidedStories,
    activeStory,
    guidedIndex,
    viewedStoryIds,
    selectedEvidenceId,
    selectedEvidence,
    evidencePanelOpen,
    selectedFilter,
    whyOpen,
    setSelectedFilter,
    setWhyOpen,
    setSelectedEvidenceId,
    start,
    openStory,
    openAll,
    openIntro,
    openComplete,
    goNext,
    goPrevious,
    openEvidence,
    closeEvidence,
  }
}

export function isViewed(ids: string[], story: CatchUpStory): boolean {
  return ids.includes(story.id)
}
