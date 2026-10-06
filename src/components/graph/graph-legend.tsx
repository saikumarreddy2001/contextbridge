const items = ["Requirement", "Decision", "Task", "Code Change", "Meeting", "Problem", "Blocker", "Dashed: AI inferred"]

export function GraphLegend() {
  return (
    <ul
      aria-label="Graph legend"
      className="flex flex-wrap gap-x-3 gap-y-1 rounded-md border bg-background/90 px-2 py-1.5 text-[10px] text-muted-foreground"
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
