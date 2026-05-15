import React from 'react'

export default function LoadingState({ message }: { message?: string }){
  return (
    <div style={{padding:12}}>
      <div className="day-card">{message || 'Chargement...'}</div>
    </div>
  )
}
