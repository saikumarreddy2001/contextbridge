import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function WelcomeHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-medium tracking-tight text-foreground">Welcome back, Alex</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          You were away for 8 working days. Here&apos;s what changed while you were gone.
        </p>
      </div>
      <Button asChild className="w-full sm:w-auto">
        <Link to="/catch-up">
          Show Me What I Missed
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </div>
  )
}
