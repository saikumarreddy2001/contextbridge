import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useProject, useWorkspace } from "@/hooks/use-selection"

export function ProjectSwitcher() {
  const { workspace } = useWorkspace()
  const { project, projects, setProject } = useProject()

  if (!project) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" className="h-8 max-w-44 px-2.5" aria-label="No project selected">
            <span className="truncate">No project</span>
            <ChevronsUpDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64! min-w-64">
          <DropdownMenuLabel>{workspace.name}</DropdownMenuLabel>
          <DropdownMenuItem disabled>No projects in this workspace</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-8 max-w-[11rem] px-2.5 sm:max-w-56"
          aria-label={`Project: ${project.name}, ${project.statusLabel}`}
        >
          <span className="truncate">{project.name}</span>
          <ChevronsUpDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72! min-w-72">
        <DropdownMenuLabel>{workspace.name}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={project.id} onValueChange={setProject}>
          {projects.map((item) => (
            <DropdownMenuRadioItem key={item.id} value={item.id}>
              <span className="flex min-w-0 flex-col">
                <span>{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.statusLabel}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
