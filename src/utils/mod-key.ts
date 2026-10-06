export function modKeyLabel(): string {
  if (typeof navigator === "undefined") return "Ctrl K"
  const platform = navigator.platform
  const agent = navigator.userAgent
  if (/Mac|iPhone|iPad/.test(platform) || /Mac OS|iPhone|iPad/.test(agent)) {
    return "⌘K"
  }
  return "Ctrl K"
}
