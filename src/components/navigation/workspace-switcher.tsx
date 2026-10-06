import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useWorkspace } from "@/hooks/use-selection"
import { cn } from "@/utils/cn"

export function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const { workspace, workspaces, setWorkspace } = useWorkspace()

  const trigger = (
    <DropdownMenuTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        className={cn(
          "h-auto w-full justify-start gap-2 px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent",
          collapsed && "justify-center px-0",
        )}
        aria-label={`Workspace: ${workspace.name}`}
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-[10px] font-medium text-primary-foreground">
          {workspace.name.slice(0, 1)}
        </span>
        {collapsed ? null : (
          <>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium">{workspace.name}</span>
              <span className="block truncate text-xs font-normal text-muted-foreground">
                {workspace.detail}
              </span>
            </span>
            <ChevronsUpDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
          </>
        )}
      </Button>
    </DropdownMenuTrigger>
  )

  return (
    <DropdownMenu>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {workspace.name}
          </TooltipContent>
        </Tooltip>
      ) : (
        trigger
      )}
      <DropdownMenuContent align="start" className="w-64! min-w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={workspace.id} onValueChange={setWorkspace}>
          {workspaces.map((item) => (
            <DropdownMenuRadioItem key={item.id} value={item.id}>
              <span className="flex flex-col">
                <span>{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.detail}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Workspace settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
