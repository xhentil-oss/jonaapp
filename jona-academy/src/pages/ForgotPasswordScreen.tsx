import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ForgotPasswordScreen() {
  const navigate = useNavigate()
  const [derguar, setDerguar] = useState(false)

  if (derguar) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="scale-in" style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(74,155,111,0.12)', border: '2px solid var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, marginBottom: 24 }}>✅</div>
        <h2 style={{ marginBottom: 12, textAlign: 'center', color: 'var(--text-primary)' }}>Kontrollo email-in tënd</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>Kemi dërguar një lidhje për të rivendosur fjalëkalimin në adresën tuaj email.</p>
        <button className="btn btn-primary btn-full" onClick={() => navigate('/login')}>Kthehu te Hyrja</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--text-primary)' }}>←</button>
      </div>
      <div style={{ flex: 1, padding: '32px 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🔑</div>
        <h1 style={{ fontSize: 24, marginBottom: 8, color: 'var(--text-primary)' }}>Harrove Fjalëkalimin?</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>Shkruaj adresën tënde email dhe do të dërgojmë një lidhje për të rivendosur fjalëkalimin.</p>
        <div className="input-group" style={{ marginBottom: 28 }}>
          <label className="input-label">Adresa Email</label>
          <div className="input-wrapper has-icon">
            <span className="input-icon">✉</span>
            <input className="input-field" type="email" placeholder="emaili@juaj.com" />
          </div>
        </div>
        <button className="btn btn-primary btn-full" onClick={() => setDerguar(true)} style={{ padding: '16px' }}>Dërgo Lidhjen</button>
      </div>
    </div>
  )
}
