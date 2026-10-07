import { chooseDemoData, useProjectBundle } from "@/services/api/bundle"

export function DataNotice({
  status,
  message,
}: {
  status: "loading" | "error" | "demo"
  message?: string | null
}) {
  const bundle = useProjectBundle()
  if (status === "demo" && bundle.demoReason === "unconfigured") return null
  if (status === "loading") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Loading the Project Atlas reconstruction.</p>
      </div>
    )
  }
  if (status === "demo") {
    return (
      <p className="border-b px-4 py-2 text-sm text-muted-foreground">
        Showing saved demo data. The reconstruction service is not feeding this view.
      </p>
    )
  }
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-3 px-4 py-16">
      <h1 className="text-base font-medium">Reconstruction unavailable</h1>
      <p className="text-sm text-muted-foreground">
        {message ?? "The reconstruction service could not be reached."} The catch-up, graph, timeline, and search views
        can use the saved Atlas demo instead.
      </p>
      <button
        type="button"
        onClick={chooseDemoData}
        className="min-h-11 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Use demo data
      </button>
    </div>
  )
}
