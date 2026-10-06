import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/navigation/sidebar"
import { TopBar } from "@/components/navigation/top-bar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { TooltipProvider } from "@/components/ui/tooltip"

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <TooltipProvider>
      <div className="flex min-h-svh bg-background">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <Sidebar variant="dock" />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onOpenNav={() => setMobileNavOpen(true)} />
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent
              side="left"
              className="w-72 gap-0 bg-sidebar p-0 data-[side=left]:w-72"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>ContextBridge sections</SheetDescription>
              </SheetHeader>
              <Sidebar variant="sheet" onNavigate={() => setMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>
          <main id="main" className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
