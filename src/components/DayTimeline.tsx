import React from 'react'
import { Day } from '../types/itinerary'

export default function DayTimeline({ day }: { day: Day }){
  return (
    <div className="day-card">
      <h3>Jour {day.day} — {day.title}</h3>
      <p>{day.summary}</p>
      <div className="timeline">
        {day.activities.map((a, idx) => (
          <div className="activity" key={idx}>
            <div style={{minWidth:60,fontWeight:700}}>{a.time}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}>{a.title}</div>
              <div style={{fontSize:13,color:'#334155'}}>{a.description}</div>
              <div style={{fontSize:12,color:'#6b7280',marginTop:6}}>{a.locationName} — {a.estimatedDuration} — {a.category}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
