const API_KEY_KEY = 'trip_planner_groq_key_v1'
const NOMINATIM_CACHE = 'trip_planner_nominatim_cache_v1'

export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_KEY)
}

export function setApiKey(key: string) {
  localStorage.setItem(API_KEY_KEY, key)
}

export function clearApiKey() {
  localStorage.removeItem(API_KEY_KEY)
}

export function getNominatimCache(): Record<string, any> {
  const raw = localStorage.getItem(NOMINATIM_CACHE)
  return raw ? JSON.parse(raw) : {}
}

export function setNominatimCache(cache: Record<string, any>) {
  localStorage.setItem(NOMINATIM_CACHE, JSON.stringify(cache))
}
