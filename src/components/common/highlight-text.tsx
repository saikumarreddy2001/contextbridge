import { queryTerms } from "@/utils/history"

export function HighlightText({ text, query }: { text: string; query: string }) {
  const terms = queryTerms(query)
  if (terms.length === 0) return text
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi")
  const parts = text.split(pattern)
  return parts.map((part, index) => {
    const match = terms.some((term) => term.toLowerCase() === part.toLowerCase())
    if (!match) return <span key={`${part}-${index}`}>{part}</span>
    return (
      <mark key={`${part}-${index}`} className="bg-foreground/15 text-foreground">
        {part}
      </mark>
    )
  })
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
