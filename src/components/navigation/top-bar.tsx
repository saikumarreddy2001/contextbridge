import { Menu } from "lucide-react"
import { NotificationsMenu } from "@/components/navigation/notifications-menu"
import { ProfileMenu } from "@/components/navigation/profile-menu"
import { ProjectSwitcher } from "@/components/navigation/project-switcher"
import { SearchField } from "@/components/navigation/search-field"
import { ThemeToggle } from "@/components/navigation/theme-toggle"
import { Button } from "@/components/ui/button"

export function TopBar({ onOpenNav }: { onOpenNav: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 border-b bg-background px-3 py-2 sm:gap-3 sm:px-4">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenNav}
        aria-label="Open navigation"
      >
        <Menu />
      </Button>
      <ProjectSwitcher />
      <SearchField />
      <div className="flex shrink-0 items-center gap-0.5">
        <ThemeToggle />
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </header>
  )
}
