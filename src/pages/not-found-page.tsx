import { Link } from "react-router-dom"
import { PageContainer } from "@/components/common/page-container"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <PageContainer>
      <div className="max-w-xl py-8">
        <h1 className="text-2xl font-medium tracking-tight">This page is not in ContextBridge</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The address does not match a section of the product.
        </p>
        <Button asChild className="mt-4">
          <Link to="/overview">Back to Overview</Link>
        </Button>
      </div>
    </PageContainer>
  )
}
