import { PageContainer } from "@/components/common/page-container"

export function EmptyWorkspace({ workspaceName }: { workspaceName: string }) {
  return (
    <PageContainer>
      <div className="max-w-xl py-8">
        <h1 className="text-2xl font-medium tracking-tight">No project in {workspaceName}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This workspace has no project history in ContextBridge. Switch to Northstar
          Technologies to open Project Atlas, Customer Portal, or Analytics Modernization.
        </p>
      </div>
    </PageContainer>
  )
}
