import { PlaceholderPage } from "@/components/common/placeholder-page"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"
import type { Theme } from "@/hooks/use-theme"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <PlaceholderPage
      title="Settings"
      summary="Personal defaults for ContextBridge."
      detail="Notification routing, connected sources, and account defaults will be managed here. Appearance is available now and is stored in this browser."
    >
      <div>
        <h2 className="text-sm font-medium">Appearance</h2>
        <div className="mt-3 flex gap-2" role="group" aria-label="Theme">
          <ThemeChoice label="Light" value="light" current={theme} onSelect={setTheme} />
          <ThemeChoice label="Dark" value="dark" current={theme} onSelect={setTheme} />
        </div>
      </div>
    </PlaceholderPage>
  )
}

function ThemeChoice({
  label,
  value,
  current,
  onSelect,
}: {
  label: string
  value: Theme
  current: Theme
  onSelect: (theme: Theme) => void
}) {
  const selected = current === value
  return (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      aria-pressed={selected}
      onClick={() => onSelect(value)}
    >
      {label}
    </Button>
  )
}
