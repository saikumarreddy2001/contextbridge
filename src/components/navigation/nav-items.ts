import {
  CircleHelp,
  History,
  Inbox,
  Layers,
  LayoutDashboard,
  Scale,
  MessageSquare,
  Search,
  Settings,
  Waypoints,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export const primaryNav: NavItem[] = [
  { label: "Overview", to: "/overview", icon: LayoutDashboard },
  { label: "What I Missed", to: "/catch-up", icon: Inbox },
  { label: "Timeline", to: "/timeline", icon: History },
  { label: "Context Graph", to: "/graph", icon: Waypoints },
  { label: "Decisions", to: "/decisions", icon: Scale },
  { label: "Sources", to: "/sources", icon: Layers },
  { label: "Search", to: "/search", icon: Search },
  { label: "Ask Context", to: "/ask", icon: MessageSquare },
]

export const secondaryNav: NavItem[] = [
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Help", to: "/help", icon: CircleHelp },
]
