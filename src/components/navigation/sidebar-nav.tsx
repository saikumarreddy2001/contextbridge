import { NavLink } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { NavItem } from "@/components/navigation/nav-items"
import { cn } from "@/utils/cn"

export function SidebarNav({
  items,
  collapsed,
  onNavigate,
}: {
  items: NavItem[]
  collapsed: boolean
  onNavigate?: () => void
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => (
        <li key={item.to}>
          <NavRow item={item} collapsed={collapsed} onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  )
}

function NavRow({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem
  collapsed: boolean
  onNavigate?: () => void
}) {
  const Icon = item.icon
  const link = (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
          collapsed && "justify-center px-0",
        )
      }
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className={cn("truncate", collapsed && "sr-only")}>{item.label}</span>
    </NavLink>
  )

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  )
}
