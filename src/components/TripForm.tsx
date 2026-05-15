import React, { useState } from 'react'

const INTERESTS = ['gastronomie','culture','plages','nature','business']

export default function TripForm({ onGenerate, example }: { onGenerate: (city:string, days:number, interests:string[]) => void, example: () => void }){
  const [city, setCity] = useState('')
  const [days, setDays] = useState(3)
  const [selected, setSelected] = useState<string[]>([])

  function toggle(i: string){
    setSelected(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev,i])
  }

  function submit(e: React.FormEvent){
    e.preventDefault()
    onGenerate(city, Number(days), selected)
  }

  return (
    <form className="trip-form" onSubmit={submit}>
      <label>Ville de départ</label>
      <input type="text" value={city} onChange={(e)=>setCity(e.target.value)} placeholder="e.g. Bangkok" />

      <label>Nombre de jours</label>
      <input type="number" value={days} onChange={(e)=>setDays(Number(e.target.value))} min={1} max={30} />

      <label>Centres d'intérêt</label>
      <div className="interests">
        {INTERESTS.map(i=> (
          <div key={i} className="interest" onClick={()=>toggle(i)} style={{border:selected.includes(i)?'1px solid var(--accent)':''}}>
            <input type="checkbox" checked={selected.includes(i)} readOnly /> {i}
          </div>
        ))}
      </div>

      <div style={{marginTop:12}}>
        <button className="btn" type="submit">Générer l'itinéraire</button>
        <button type="button" style={{marginLeft:8}} onClick={example}>Exemple rapide</button>
      </div>
    </form>
  )
}
