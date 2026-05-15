export function extractJsonFromText(text: string): string | null {
  if (!text) return null

  // Try to find a JSON code block first
  const codeBlock = /```(?:json)?\s*([\s\S]*?)```/i.exec(text)
  if (codeBlock && codeBlock[1]) {
    return codeBlock[1].trim()
  }

  // Fallback: find the first { and last } and take substring
  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first !== -1 && last !== -1 && last > first) {
    return text.slice(first, last + 1)
  }

  return null
}
