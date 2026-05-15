import React, { useState } from 'react'
import { setApiKey as saveKey } from '../services/storage'

export default function ApiKeyModal({ onSave, onClose }: { onSave: (k: string) => void; onClose: () => void }) {
  const [key, setKey] = useState('')

  function handleSave() {
    if (!key) return
    saveKey(key)
    onSave(key)
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Clé Groq API</h3>
        <p>Entrez votre clé Groq (sera stockée localement dans localStorage).</p>
        <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-..." />
        <div style={{ marginTop: 8 }}>
          <button className="btn" onClick={handleSave}>Enregistrer</button>
          <button style={{ marginLeft: 8 }} onClick={onClose}>Fermer</button>
        </div>
        <p style={{ marginTop: 8, fontSize: 12, color: '#555' }}>Pour déployer: déplacez l'appel API côté serveur (Vercel/Netlify) et utilisez une variable d'environnement pour la clé.</p>
      </div>
    </div>
  )
}
