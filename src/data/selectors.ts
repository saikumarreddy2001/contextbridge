import { activities } from "@/data/activities"
import { blockers } from "@/data/blockers"
import { decisions } from "@/data/decisions"
import { projects } from "@/data/projects"
import { requirementChanges } from "@/data/requirements"
import { sources } from "@/data/sources"
import { tasks } from "@/data/tasks"
import { currentUser } from "@/data/user"
import type { Activity, Priority, Project, Source, SourceKind, Status, Task } from "@/types"

export interface CatchUpStat {
  id: string
  count: number
  label: string
}

export interface ImportantChangeView {
  id: string
  eyebrow: string
  title: string
  summary: string
  dateLabel: string
  projectName: string
  sources: SourceKind[]
  priority: Priority
  featured: boolean
}

function affectsUser(status: Status): boolean {
  return status === "open" || status === "in-progress" || status === "blocked"
}

export function getProjectsForWorkspace(workspaceId: string): Project[] {
  return projects.filter((project) => project.workspaceId === workspaceId)
}

export function getCatchUpStats(projectId: string): CatchUpStat[] {
  const decisionCount = decisions.filter((item) => item.projectId === projectId).length
  const requirementCount = requirementChanges.filter((item) => item.projectId === projectId).length
  const blockerCount = blockers.filter((item) => item.projectId === projectId).length
  const taskCount = tasks.filter(
    (item) =>
      item.projectId === projectId &&
      item.assigneeId === currentUser.id &&
      affectsUser(item.status),
  ).length
  const discussionCount = activities.filter(
    (item) => item.projectId === projectId && item.source === "discussion" && item.status === "open",
  ).length

  return [
    { id: "decisions", count: decisionCount, label: "Important decisions" },
    { id: "requirements", count: requirementCount, label: "Requirement changes" },
    {
      id: "blockers",
      count: blockerCount,
      label: blockerCount === 1 ? "New blocker" : "New blockers",
    },
    { id: "tasks", count: taskCount, label: "Tasks affecting you" },
    { id: "discussions", count: discussionCount, label: "Unresolved discussions" },
  ]
}

export function getImportantChanges(projectId: string): ImportantChangeView[] {
  const project = projects.find((item) => item.id === projectId)
  if (!project) return []

  const views: ImportantChangeView[] = []
  const decision = decisions.find((item) => item.id === "dec-auth-revised" && item.projectId === projectId)
  const requirement = requirementChanges.find((item) => item.id === "req-sso" && item.projectId === projectId)
  const blocker = blockers.find((item) => item.id === "blk-payments" && item.projectId === projectId)

  if (decision) {
    views.push({
      id: decision.id,
      eyebrow: "High priority",
      title: decision.title,
      summary: decision.summary,
      dateLabel: decision.decidedOn,
      projectName: project.name,
      sources: decision.sources,
      priority: decision.priority,
      featured: true,
    })
  }

  if (requirement) {
    views.push({
      id: requirement.id,
      eyebrow: "Requirement change",
      title: requirement.title,
      summary: requirement.summary,
      dateLabel: requirement.changedOn,
      projectName: project.name,
      sources: requirement.sources,
      priority: requirement.priority,
      featured: false,
    })
  }

  if (blocker) {
    views.push({
      id: blocker.id,
      eyebrow: "Blocker",
      title: blocker.title,
      summary: blocker.summary,
      dateLabel: blocker.updatedOn,
      projectName: project.name,
      sources: blocker.sources,
      priority: blocker.priority,
      featured: false,
    })
  }

  return views
}

export function getRecentActivity(projectId: string): Activity[] {
  return activities.filter((item) => item.projectId === projectId && !item.background)
}

export function countProjectActivities(projectId: string): number {
  return activities.filter((item) => item.projectId === projectId).length
}

export function getAttentionTasks(projectId: string): Task[] {
  return tasks.filter(
    (item) =>
      item.projectId === projectId &&
      item.assigneeId === currentUser.id &&
      affectsUser(item.status),
  )
}

export function getSources(projectId: string): Source[] {
  return sources.filter((item) => item.projectId === projectId)
}

export function getDecisionCount(projectId: string): number {
  return decisions.filter((item) => item.projectId === projectId).length
}

export function getRequirementCount(projectId: string): number {
  return requirementChanges.filter((item) => item.projectId === projectId).length
}

export function getBlockerCount(projectId: string): number {
  return blockers.filter((item) => item.projectId === projectId).length
}
