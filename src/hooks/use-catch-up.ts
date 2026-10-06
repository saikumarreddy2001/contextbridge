import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { itemsForProject } from "@/data/catch-up-stories"
import { useProjectBundle } from "@/services/api/bundle"
import type { CatchUpFilter, CatchUpItem, Evidence } from "@/types"

export type CatchUpMode = "intro" | "guided" | "story" | "all" | "complete"

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable
}

export function useCatchUp(projectId: string) {
  const bundle = useProjectBundle()
  const [params, setParams] = useSearchParams()
  const [viewedIds, setViewedIds] = useState<string[]>([])
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null)
  const [evidencePanelOpen, setEvidencePanelOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<CatchUpFilter>("all")
  const [expandedReason, setExpandedReason] = useState(false)

  const view = params.get("view")
  const slug = params.get("story")
  const items =
    bundle.status === "ready" && bundle.data
      ? bundle.data.catchUpItems.filter((item) => item.projectId === projectId)
      : itemsForProject(projectId)
  const guidedItems = items.filter((item) => item.guided)
  const selectedCatchUpItem = slug ? items.find((item) => item.slug === slug) : undefined
  const guidedIndex = selectedCatchUpItem
    ? guidedItems.findIndex((item) => item.id === selectedCatchUpItem.id)
    : -1

  let mode: CatchUpMode = "intro"
  if (view === "all") mode = "all"
  else if (view === "complete") mode = "complete"
  else if (selectedCatchUpItem && guidedIndex >= 0) mode = "guided"
  else if (selectedCatchUpItem) mode = "story"
  else if (slug) mode = "intro"

  if (selectedCatchUpItem && !viewedIds.includes(selectedCatchUpItem.id)) {
    setViewedIds([...viewedIds, selectedCatchUpItem.id])
  }

  const selectedEvidence: Evidence | null =
    selectedCatchUpItem?.evidence.find((item) => item.id === selectedEvidenceId) ?? null

  useEffect(() => {
    if (mode !== "guided" || !selectedCatchUpItem) return
    const current = selectedCatchUpItem
    const sequence = guidedItems

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
      const index = sequence.findIndex((item) => item.id === current.id)
      if (index < 0) return
      const delta = event.key === "ArrowRight" ? 1 : -1
      const nextIndex = index + delta
      if (nextIndex < 0) return
      const next = sequence[nextIndex]
      setEvidencePanelOpen(false)
      setSelectedEvidenceId(null)
      setExpandedReason(false)
      if (!next) {
        setParams({ view: "complete" })
        return
      }
      setParams({ story: next.slug })
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [mode, selectedCatchUpItem, evidencePanelOpen, guidedItems, setParams])

  function openItem(nextSlug: string) {
    setEvidencePanelOpen(false)
    setSelectedEvidenceId(null)
    setExpandedReason(false)
    setParams({ story: nextSlug })
  }

  function openAll() {
    setEvidencePanelOpen(false)
    setSelectedEvidenceId(null)
    setParams({ view: "all" })
  }

  function openComplete() {
    setEvidencePanelOpen(false)
    setSelectedEvidenceId(null)
    setExpandedReason(false)
    setParams({ view: "complete" })
  }

  function start() {
    const first = guidedItems[0]
    if (!first) return
    openItem(first.slug)
  }

  function goNext() {
    if (!selectedCatchUpItem || guidedIndex < 0) return
    const next = guidedItems[guidedIndex + 1]
    if (!next) {
      openComplete()
      return
    }
    openItem(next.slug)
  }

  function goPrevious() {
    if (guidedIndex <= 0) return
    const previous = guidedItems[guidedIndex - 1]
    if (!previous) return
    openItem(previous.slug)
  }

  function openEvidence(evidenceId?: string) {
    const first = selectedCatchUpItem?.evidence[0]
    setSelectedEvidenceId(evidenceId ?? selectedEvidenceId ?? first?.id ?? null)
    setEvidencePanelOpen(true)
  }

  function closeEvidence() {
    setEvidencePanelOpen(false)
  }

  function selectEvidence(evidenceId: string) {
    setSelectedEvidenceId(evidenceId)
    setEvidencePanelOpen(true)
  }

  return {
    mode,
    items,
    guidedItems,
    guidedIndex,
    viewedIds,
    selectedCatchUpItem,
    selectedEvidence,
    expandedReason,
    evidencePanelOpen,
    selectedFilter,
    setSelectedFilter,
    setExpandedReason,
    selectEvidence,
    start,
    openItem,
    openAll,
    openComplete,
    goNext,
    goPrevious,
    openEvidence,
    closeEvidence,
  }
}

export function isViewed(ids: string[], item: CatchUpItem): boolean {
  return ids.includes(item.id)
}
