import { Itinerary } from '../types/itinerary'
import { extractJsonFromText } from '../utils/json'

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.1-70b-versatile'

export async function generateItinerary(city: string, days: number, interests: string[], apiKey: string): Promise<Itinerary> {
  const prompt = `You are a helpful travel planner. Produce ONLY valid JSON (no markdown, no extra text). Generate a realistic day-by-day itinerary for ${city} adapted to the following interests: ${interests.join(', ')}. The itinerary must be suitable for ${days} day(s). Include precise, geocodable place names (restaurants, museums, parks, beaches, etc.) and avoid suggesting places that are extremely far apart within the same day. Organize activities by time and include reasonable estimated durations. Output JSON in this exact schema:\n{\n  "city": "string",\n  "country": "string",\n  "days": [ {\n    "day": 1,\n    "title": "string",\n    "summary": "string",\n    "activities": [ {\n      "time": "09:00",\n      "title": "string",\n      "description": "string",\n      "locationName": "string",\n      "estimatedDuration": "string",\n      "category": "gastronomie | culture | plages | nature | business | autre"\n    } ]\n  } ]\n}\nDo not include any commentary, Markdown, or text outside the single JSON object.`

  const body = {
    model: MODEL,
    messages: [
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 1200
  }

  async function callOnce(): Promise<Itinerary> {
    const res = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const txt = await res.text()
      throw new Error(`Groq API error: ${res.status} ${txt}`)
    }

    const data = await res.json()
    // Response format similar to OpenAI: choices[0].message.content
    const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || ''
    const cleaned = extractJsonFromText(content)
    if (!cleaned) throw new Error('Impossible d\'extraire du JSON depuis la réponse IA')

    try {
      return JSON.parse(cleaned) as Itinerary
    } catch (e) {
      throw new Error('JSON invalide reçu de l\'IA')
    }
  }

  try {
    return await callOnce()
  } catch (e) {
    // retry once
    try {
      return await callOnce()
    } catch (e2: any) {
      throw new Error(e2.message || 'Failed to generate itinerary')
    }
  }
}

// Comment: For serverless deployment, move this call to a server endpoint and store the API key in an environment variable. Use the same request body but send the key from the server.
