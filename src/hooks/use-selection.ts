import { useSyncExternalStore } from "react"
import { getProjectsForWorkspace } from "@/data/selectors"
import { workspaces } from "@/data/workspaces"
import type { Project } from "@/types"
import { createStoredString } from "@/utils/stored-signal"

function isWorkspaceId(value: string): boolean {
  return workspaces.some((workspace) => workspace.id === value)
}

function isProjectId(value: string): boolean {
  return value.length > 0
}

const workspaceSignal = createStoredString<string>("contextbridge-workspace", "northstar", isWorkspaceId)
const projectSignal = createStoredString<string>("contextbridge-project", "atlas", isProjectId)

export function useWorkspace() {
  const workspaceId = useSyncExternalStore(
    workspaceSignal.subscribe,
    workspaceSignal.getSnapshot,
    workspaceSignal.getSnapshot,
  )
  const workspace = workspaces.find((item) => item.id === workspaceId) ?? workspaces[0]

  return {
    workspace,
    workspaces,
    setWorkspace(nextId: string) {
      if (!isWorkspaceId(nextId)) return
      workspaceSignal.set(nextId)
    },
  }
}

export function useProject() {
  const { workspace } = useWorkspace()
  const available = getProjectsForWorkspace(workspace.id)
  const projectId = useSyncExternalStore(
    projectSignal.subscribe,
    projectSignal.getSnapshot,
    projectSignal.getSnapshot,
  )
  const matched = available.find((item) => item.id === projectId)
  const project: Project | undefined = matched ?? available[0]

  return {
    project,
    projects: available,
    setProject(nextId: string) {
      if (!available.some((item) => item.id === nextId)) return
      projectSignal.set(nextId)
    },
  }
}
