import { Itinerary } from '../types/itinerary'

export function exportToJson(itinerary: Itinerary) {
  const data = JSON.stringify(itinerary, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${itinerary.city || 'itinerary'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportToText(itinerary: Itinerary) {
  const lines: string[] = []
  lines.push(`${itinerary.city}, ${itinerary.country}`)
  itinerary.days.forEach((d) => {
    lines.push(`Day ${d.day}: ${d.title}`)
    d.activities.forEach((a) => {
      lines.push(`- ${a.time} ${a.title} (${a.locationName}) — ${a.estimatedDuration}`)
    })
  })
  const text = lines.join('\n')
  navigator.clipboard.writeText(text)
}
