import React from 'react'

export default function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }){
  return (
    <div style={{padding:12}}>
      <div className="warning">{message} {onRetry && <button onClick={onRetry} style={{marginLeft:8}}>Réessayer</button>}</div>
    </div>
  )
}
