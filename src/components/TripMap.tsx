import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { Itinerary } from '../types/itinerary'
import { geocodePlace } from '../services/nominatim'
import { delay } from '../utils/delay'

// Fix default icon paths for Leaflet in many bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function TripMap({ itinerary }: { itinerary: Itinerary | null }){
  const [points, setPoints] = useState<{lat:number,lon:number,info:string,day:number,time:string}[]>([])
  const [loading, setLoading] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])

  useEffect(() => {
    let mounted = true
    async function run() {
      setPoints([])
      setWarnings([])
      if (!itinerary) return
      setLoading(true)
      const newPoints: any[] = []
      for (const d of itinerary.days) {
        for (const a of d.activities) {
          const q = `${a.locationName}, ${itinerary.city}`
          const g = await geocodePlace(q)
          if (!mounted) return
          if (!g) {
            setWarnings(w => [...w, `Lieu non trouvé: ${a.locationName}`])
            continue
          }
          newPoints.push({ lat: g.lat, lon: g.lon, info: a.title + ' — ' + a.locationName, day: d.day, time: a.time })
          // ensure 1 request per second - geocodePlace already delays, but be defensive
          await delay(200)
        }
      }
      if (mounted) setPoints(newPoints)
      setLoading(false)
    }
    run()
    return ()=>{ mounted=false }
  }, [itinerary])

  if (!itinerary) return <div className="map-container">La carte s'affichera ici.</div>

  const center = points.length ? [points[0].lat, points[0].lon] : [0,0]

  return (
    <div className="map-container">
      {loading && <div style={{padding:8}}>Géocodage en cours...</div>}
      {warnings.map((w, i)=>(<div key={i} className="warning">{w}</div>))}
      <MapContainer center={center as any} zoom={13} style={{height:'550px',width:'100%'}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© OpenStreetMap contributors' />
        {points.map((p, idx)=>(
          <Marker key={idx} position={[p.lat, p.lon] as any}>
            <Popup>
              <div><strong>Jour {p.day}</strong></div>
              <div>{p.time}</div>
              <div>{p.info}</div>
            </Popup>
          </Marker>
        ))}
        {points.length>1 && <Polyline positions={points.map(p=>[p.lat,p.lon]) as any} color="#2563eb" />}
      </MapContainer>
    </div>
  )
}
