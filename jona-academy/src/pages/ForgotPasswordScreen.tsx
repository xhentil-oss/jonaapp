import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MailIcon, ChevronLeftIcon } from '../components/Icons'
import { requestPasswordReset } from '../services/api'

export default function ForgotPasswordScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [derguar, setDerguar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (derguar) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        {/* Elegant mail icon */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <div style={{ width: 88, height: 88, borderRadius: 24, background: 'linear-gradient(135deg, rgba(122,79,45,0.1), rgba(122,79,45,0.06))', border: '1.5px solid rgba(122,79,45,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MailIcon size={36} color="var(--primary)" strokeWidth={1.4} />
          </div>
          <div style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: '50%', background: '#4A9B6F', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: 'var(--text-primary)' }}>Kontrollo email-in tënd</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.65, fontSize: 14 }}>Nëse ky email ekziston, dërguam një link për rivendosjen e fjalëkalimit në:</p>
        <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 14, marginBottom: 32 }}>{email}</p>
        <button className="btn btn-primary btn-full" onClick={() => navigate('/login')} style={{ padding: '16px' }}>Kthehu te Hyrja</button>
        <button onClick={() => setDerguar(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', marginTop: 14 }}>Kthehu prapa</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
          <ChevronLeftIcon size={18} strokeWidth={2} />
        </button>
      </div>
      <div style={{ flex: 1, padding: '32px 24px' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, rgba(122,79,45,0.1), rgba(122,79,45,0.06))', border: '1.5px solid rgba(122,79,45,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <MailIcon size={28} color="var(--primary)" strokeWidth={1.4} />
        </div>
        <h1 style={{ fontSize: 24, marginBottom: 8, color: 'var(--text-primary)' }}>Harrove Fjalëkalimin?</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6, fontSize: 14 }}>Shkruaj email-in tënd dhe do të dërgojmë një link për të rivendosur fjalëkalimin.</p>
        <div className="input-group" style={{ marginBottom: 28 }}>
          <label className="input-label">Adresa Email</label>
          <div className="input-wrapper has-icon">
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <MailIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
            </span>
            <input className="input-field" type="email" placeholder="emaili@juaj.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, marginTop: -12 }}>
            <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
          </div>
        )}
        <button
          className="btn btn-primary btn-full"
          style={{ padding: '16px', opacity: email.includes('@') && !loading ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          disabled={!email.includes('@') || loading}
          onClick={async () => {
            setLoading(true)
            setError('')
            try {
              await requestPasswordReset(email)
              setDerguar(true)
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Ndodhi një gabim. Provo sërish.')
            } finally {
              setLoading(false)
            }
          }}
        >
          {loading ? (
            <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Duke dërguar...</>
          ) : 'Dërgo Kërkesën'}
        </button>
      </div>
    </div>
  )
}
