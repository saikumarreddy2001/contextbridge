import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { currentUser } from "@/data/user"

export function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-8 gap-2 px-1.5"
          aria-label={`Account menu for ${currentUser.name}`}
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {currentUser.initials}
          </span>
          <span className="hidden text-sm font-medium lg:inline">{currentUser.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60! min-w-60">
        <DropdownMenuLabel className="font-normal">
          <span className="block text-sm font-medium text-foreground">{currentUser.name}</span>
          <span className="block text-xs text-muted-foreground">{currentUser.title}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Preferences</DropdownMenuItem>
        <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
