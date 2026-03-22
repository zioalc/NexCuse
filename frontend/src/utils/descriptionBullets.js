/**
 * Turn a paragraph into bullet lines: sentences first, then dashes/semicolons.
 */
export function descriptionToBullets(text) {
  if (!text || typeof text !== "string") return []
  const t = text.trim()
  if (!t) return []

  const bySentence = t
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (bySentence.length > 1) return bySentence

  const byBreak = t
    .split(/\s*[—–;]\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (byBreak.length > 1) return byBreak

  return [t]
}
