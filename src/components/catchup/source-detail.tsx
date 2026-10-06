import type { Evidence } from "@/types"

export function SourceDetail({ evidence }: { evidence: Evidence }) {
  return (
    <article className="border-t px-3 py-4" aria-live="polite">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {evidence.kindLabel}
      </p>
      <h3 className="mt-1 text-sm font-medium">{evidence.title}</h3>
      <p className="mt-2 text-xs text-muted-foreground">
        {evidence.dateLabel}
        <span aria-hidden="true"> · </span>
        {evidence.author}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{evidence.projectName}</p>
      {evidence.meta.length > 0 ? (
        <dl className="mt-3 space-y-1">
          {evidence.meta.map((field) => (
            <div key={field.label} className="text-xs">
              <dt className="inline font-medium">{field.label}: </dt>
              <dd className="inline text-muted-foreground">{field.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <blockquote className="mt-3 border-l-2 pl-3 text-sm leading-relaxed">
        {evidence.excerpt}
      </blockquote>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">Relationship: </span>
        {evidence.relationship}
      </p>
    </article>
  )
}
