import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { SidebarNav } from "@/components/navigation/sidebar-nav"
import { primaryNav, secondaryNav } from "@/components/navigation/nav-items"
import { WorkspaceSwitcher } from "@/components/navigation/workspace-switcher"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { currentUser } from "@/data/user"
import { useSidebar } from "@/hooks/use-sidebar"
import { cn } from "@/utils/cn"

export function Sidebar({
  variant,
  onNavigate,
}: {
  variant: "dock" | "sheet"
  onNavigate?: () => void
}) {
  const { collapsed, toggle } = useSidebar()
  const isCollapsed = variant === "dock" && collapsed

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground",
        variant === "dock" &&
          "sticky top-0 hidden h-svh shrink-0 border-r border-sidebar-border transition-[width] duration-200 ease-out md:flex",
        variant === "dock" && (isCollapsed ? "w-16" : "w-60"),
        variant === "sheet" && "w-full",
      )}
    >
      <div className={cn("flex items-center gap-2 px-3 py-3", isCollapsed && "justify-center px-2")}>
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
            <path
              d="M1.5 11.5h13M3 11.5V7.5h2.5v4M10.5 11.5V7.5H13v4M5.5 8.5h5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </span>
        {isCollapsed ? null : (
          <span className="text-sm font-semibold tracking-tight">ContextBridge</span>
        )}
        {variant === "dock" && !isCollapsed ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="ml-auto text-muted-foreground"
            onClick={toggle}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose />
          </Button>
        ) : null}
      </div>

      <div className={cn("px-2", isCollapsed && "px-1.5")}>
        <WorkspaceSwitcher collapsed={isCollapsed} />
      </div>

      <nav aria-label="Primary" className={cn("mt-3 flex-1 overflow-y-auto px-2", isCollapsed && "px-1.5")}>
        <SidebarNav items={primaryNav} collapsed={isCollapsed} onNavigate={onNavigate} />
      </nav>

      <div className={cn("mt-auto px-2 pb-2", isCollapsed && "px-1.5")}>
        {variant === "dock" && isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="mb-2 w-full text-muted-foreground"
                onClick={toggle}
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Expand sidebar
            </TooltipContent>
          </Tooltip>
        ) : null}
        <nav aria-label="Account" className="mb-2">
          <SidebarNav items={secondaryNav} collapsed={isCollapsed} onNavigate={onNavigate} />
        </nav>
        <div
          className={cn(
            "flex items-center gap-2 border-t border-sidebar-border px-2 py-3",
            isCollapsed && "justify-center px-0",
          )}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
            {currentUser.initials}
          </span>
          {isCollapsed ? (
            <span className="sr-only">
              {currentUser.name}, {currentUser.title}. Demo workspace — synthetic Project Atlas data
            </span>
          ) : (
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{currentUser.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{currentUser.title}</span>
              <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">
                Demo workspace — synthetic Project Atlas data
              </span>
            </span>
          )}
        </div>
      </div>
    </aside>
  )
}
