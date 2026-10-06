import { useState } from "react"
import { ChangeReasonDialog } from "@/components/dashboard/change-reason-dialog"
import { SourceIcon, SourceLabel } from "@/components/common/source-icon"
import { StatusLabel } from "@/components/common/status-label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getAttentionTasks } from "@/data/selectors"
import type { Task } from "@/types"

export function AttentionList({
  projectId,
  projectName,
}: {
  projectId: string
  projectName: string
}) {
  const tasks = getAttentionTasks(projectId)
  const [reasonOpen, setReasonOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  return (
    <section aria-labelledby="attention-heading">
      <h2 id="attention-heading" className="text-sm font-medium">
        Your attention
      </h2>
      {tasks.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
          Nothing on {projectName} is waiting on you.
        </p>
      ) : (
        <ul className="mt-3 divide-y rounded-lg border bg-card">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-medium">{task.title}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <SourceIcon source={task.source} />
                    <SourceLabel source={task.source} />
                  </span>
                  <StatusLabel status={task.status} />
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  if (task.id === "task-review-auth") {
                    setReasonOpen(true)
                    return
                  }
                  setActiveTask(task)
                }}
              >
                {task.actionLabel}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <ChangeReasonDialog open={reasonOpen} onOpenChange={setReasonOpen} />
      <Dialog open={activeTask !== null} onOpenChange={(open) => !open && setActiveTask(null)}>
        <DialogContent className="sm:max-w-md">
          {activeTask ? (
            <>
              <DialogHeader>
                <DialogTitle>{activeTask.title}</DialogTitle>
                <DialogDescription>{activeTask.summary}</DialogDescription>
              </DialogHeader>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <SourceIcon source={activeTask.source} />
                <SourceLabel source={activeTask.source} />
                <StatusLabel status={activeTask.status} />
              </p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
