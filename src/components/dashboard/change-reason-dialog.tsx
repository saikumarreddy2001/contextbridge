import { authStory } from "@/data/auth-story"
import { SourceIcon, SourceLabel } from "@/components/common/source-icon"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function ChangeReasonDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Why the authentication architecture changed</DialogTitle>
          <DialogDescription>
            The team originally selected Auth0. Implementation showed the refresh model
            would not hold, and the September 22 session revised the decision.
          </DialogDescription>
        </DialogHeader>
        <ol className="max-h-[min(24rem,60vh)] space-y-3 overflow-y-auto pr-1">
          {authStory.map((step) => (
            <li key={step.id} className="grid grid-cols-[4.5rem_1fr] gap-3">
              <time className="pt-0.5 text-xs text-muted-foreground">{step.dateLabel}</time>
              <div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{step.detail}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <SourceIcon source={step.source} />
                  <SourceLabel source={step.source} />
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs text-muted-foreground">
          This is the written trace. The context graph is not part of this phase.
        </p>
      </DialogContent>
    </Dialog>
  )
}
