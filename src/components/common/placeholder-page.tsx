import type { ReactNode } from "react"
import { PageContainer } from "@/components/common/page-container"

export function PlaceholderPage({
  title,
  summary,
  detail,
  children,
}: {
  title: string
  summary: string
  detail: string
  children?: ReactNode
}) {
  return (
    <PageContainer>
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          ContextBridge
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight text-foreground">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-foreground">{summary}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </PageContainer>
  )
}
