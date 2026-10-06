export function CatchUpProgress({ index, total }: { index: number; total: number }) {
  const current = String(index + 1).padStart(2, "0")
  const length = String(total).padStart(2, "0")
  return (
    <p
      className="text-xs font-medium tracking-widest text-muted-foreground tabular-nums"
      aria-label={`Story ${index + 1} of ${total}`}
    >
      <span className="text-foreground" aria-hidden="true">
        {current}
      </span>
      <span aria-hidden="true"> / {length}</span>
    </p>
  )
}
