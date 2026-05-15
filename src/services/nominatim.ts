import { delay } from '../utils/delay'
import { getNominatimCache, setNominatimCache } from './storage'

export interface GeocodeResult {
  lat: number
  lon: number
  display_name: string
}

export async function geocodePlace(query: string): Promise<GeocodeResult | null> {
  const cache = getNominatimCache()
  if (cache[query]) return cache[query]

  // Respect Nominatim rate limit: 1 request per second
  await delay(1000)

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
  try {
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en'
      }
    })
    if (!res.ok) return null
    const arr = await res.json()
    if (!arr || arr.length === 0) return null
    const first = arr[0]
    const result = { lat: parseFloat(first.lat), lon: parseFloat(first.lon), display_name: first.display_name }
    cache[query] = result
    setNominatimCache(cache)
    return result
  } catch (e) {
    return null
  }
}
