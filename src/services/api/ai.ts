import type { Evidence } from "@/types"
import { apiGet, apiPost, atlasApiProject } from "@/services/api/client"

export interface ChangeExplanation {
  available: boolean
  message: string
  summary?: string
  reason?: string
  whatChanged?: string
  previousState?: string
  currentState?: string
  contributingFactors?: string[]
  confidence?: number
  evidence?: Evidence[]
}

export interface StorySummary {
  available: boolean
  storyId: string
  headline?: string
  summary?: string
  keyDecisions?: string[]
  openQuestions?: string[]
  actionItems?: string[]
}

export interface AskTurn {
  question: string
  answer: string
}

export interface AskRelated {
  id: string
  title: string
  type: string
  graphNodeId?: string | null
}

export interface AskResponse {
  available: boolean
  insufficientEvidence: boolean
  message: string
  answer: string
  confidence: number
  evidence: Evidence[]
  related: AskRelated[]
  graphNodeId?: string | null
}

export interface Capabilities {
  ai: boolean
  semanticSearch: boolean
  contextReconstruction: boolean
}

export function fetchCapabilities(): Promise<Capabilities> {
  return apiGet("/api/capabilities")
}

export function explainChange(changeId: string): Promise<ChangeExplanation> {
  return apiPost(`/api/projects/${atlasApiProject}/explain-change/${changeId}`, {})
}

export function fetchStorySummary(storyId: string): Promise<StorySummary> {
  return apiGet(`/api/projects/${atlasApiProject}/stories/${storyId}/summary`)
}

export function askProject(question: string, history: AskTurn[]): Promise<AskResponse> {
  return apiPost(`/api/projects/${atlasApiProject}/ask`, { question, history })
}
