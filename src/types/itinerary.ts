export type Category = 'gastronomie' | 'culture' | 'plages' | 'nature' | 'business' | 'autre'

export interface Activity {
  time: string
  title: string
  description: string
  locationName: string
  estimatedDuration: string
  category: Category
}

export interface Day {
  day: number
  title: string
  summary: string
  activities: Activity[]
}

export interface Itinerary {
  city: string
  country: string
  days: Day[]
}
