import { useState } from "react"
import { SourceIcon, SourceLabel } from "@/components/common/source-icon"
import { ChangeReasonDialog } from "@/components/dashboard/change-reason-dialog"
import { Button } from "@/components/ui/button"
import { getImportantChanges } from "@/data/selectors"
import { sourceLabels } from "@/utils/labels"
import { cn } from "@/utils/cn"

export function ImportantChanges({
  projectId,
  projectName,
}: {
  projectId: string
  projectName: string
}) {
  const changes = getImportantChanges(projectId)
  const [reasonOpen, setReasonOpen] = useState(false)

  return (
    <section aria-labelledby="important-changes-heading">
      <h2 id="important-changes-heading" className="text-sm font-medium">
        Important changes
      </h2>
      {changes.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
          No important changes were recorded on {projectName} while you were away.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          {changes.map((change) => (
            <article
              key={change.id}
              className={cn(
                "rounded-lg border bg-card px-4 py-4",
                change.featured && "border-foreground/20",
              )}
            >
              <p className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                <span
                  className={cn(
                    "size-1.5 rounded-full bg-foreground/50",
                    change.eyebrow === "High priority" && "bg-destructive",
                    change.eyebrow === "Blocker" && "bg-destructive",
                  )}
                  aria-hidden="true"
                />
                <span>{change.eyebrow}</span>
              </p>
              <h3 className="mt-2 text-base font-medium tracking-tight">{change.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{change.summary}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                <time>{change.dateLabel}</time>
                <span aria-hidden="true"> · </span>
                <span>{change.projectName}</span>
                <span aria-hidden="true"> · </span>
                <span>
                  Sources{" "}
                  {change.sources.map((source) => sourceLabels[source]).join(", ")}
                </span>
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {change.sources.map((source) => (
                  <li
                    key={source}
                    className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground"
                  >
                    <SourceIcon source={source} />
                    <SourceLabel source={source} />
                  </li>
                ))}
              </ul>
              {change.featured ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setReasonOpen(true)}
                >
                  See why this changed
                </Button>
              ) : null}
            </article>
          ))}
        </div>
      )}
      <ChangeReasonDialog open={reasonOpen} onOpenChange={setReasonOpen} />
    </section>
  )
}
