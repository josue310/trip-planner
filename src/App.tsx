import React, { useEffect, useState } from 'react'
import TripForm from './components/TripForm'
import TripMap from './components/TripMap'
import DayTimeline from './components/DayTimeline'
import ApiKeyModal from './components/ApiKeyModal'
import LoadingState from './components/LoadingState'
import ErrorState from './components/ErrorState'
import { Itinerary } from './types/itinerary'
import { getApiKey, setApiKey, clearApiKey } from './services/storage'
import { generateItinerary } from './services/groq'
import { exportToJson, exportToText } from './utils/export'

export default function App() {
  const [apiKey, setKey] = useState<string | null>(getApiKey())
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showApiModal, setShowApiModal] = useState(false)

  useEffect(() => {
    setKey(getApiKey())
  }, [])

  async function handleGenerate(city: string, days: number, interests: string[]) {
    setError(null)
    if (!apiKey) {
      setShowApiModal(true)
      return
    }
    setLoading(true)
    try {
      const res = await generateItinerary(city, days, interests, apiKey)
      setItinerary(res)
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la génération de l\'itinéraire')
    } finally {
      setLoading(false)
    }
  }

  function handleSaveApiKey(k: string) {
    setApiKey(k)
    setKey(k)
    setShowApiModal(false)
  }

  function handleClearKey() {
    clearApiKey()
    setKey(null)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Trip Planner</h1>
        <div className="api-controls">
          <button onClick={() => setShowApiModal(true)}>Gérer la clé Groq</button>
          <button onClick={handleClearKey}>Supprimer la clé</button>
        </div>
      </header>

      <main className="main-grid">
        <section className="left">
          <TripForm onGenerate={handleGenerate} example={() => handleGenerate('Bangkok', 3, ['gastronomie','culture','nature'])} />

          {loading && <LoadingState message="Génération en cours..." />}
          {error && <ErrorState message={error} onRetry={() => { setError(null); }} />}

          {itinerary ? (
            <>
              <div className="itinerary-controls">
                <button onClick={() => exportToJson(itinerary)}>Exporter JSON</button>
                <button onClick={() => exportToText(itinerary)}>Copier texte</button>
              </div>
              <div className="days">
                {itinerary.days.map((d) => (
                  <DayTimeline key={d.day} day={d} />
                ))}
              </div>
            </>
          ) : (
            !loading && <p>Aucun itinéraire généré.</p>
          )}
        </section>

        <aside className="right">
          <TripMap itinerary={itinerary} />
        </aside>
      </main>

      {showApiModal && <ApiKeyModal onSave={handleSaveApiKey} onClose={() => setShowApiModal(false)} />}
    </div>
  )
}
