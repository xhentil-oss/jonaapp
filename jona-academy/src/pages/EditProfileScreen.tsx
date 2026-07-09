import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfileName } from '../services/api'
import { UserIcon, ChevronLeftIcon } from '../components/Icons'

export default function EditProfileScreen() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()

  const [emri, setEmri] = useState(user?.full_name || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const ruaj = async () => {
    if (!emri.trim()) { setError('Emri nuk mund të jetë bosh.'); return }
    setLoading(true)
    setError('')
    try {
      await updateProfileName(emri.trim())
      await refreshUser()
      setSuccess(true)
      setTimeout(() => navigate(-1), 1200)
    } catch (e: any) {
      setError(e?.message || 'Ndodhi një gabim. Provo sërish.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', flexShrink: 0 }}
        >
          <ChevronLeftIcon size={18} strokeWidth={2} />
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Ndrysho Profilin</h2>
      </div>

      <div style={{ flex: 1, padding: '28px 20px' }}>

        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800, color: 'white', border: '3px solid rgba(122,79,45,0.25)', userSelect: 'none' }}>
            {emri.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        {/* Emri */}
        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Emri i Plotë</label>
            <div className="input-wrapper has-icon">
              <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <UserIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
              </span>
              <input
                className="input-field"
                type="text"
                placeholder="Emri juaj i plotë"
                value={emri}
                onChange={e => { setEmri(e.target.value); setError(''); setSuccess(false) }}
              />
            </div>
          </div>
        </div>

        {/* Email (vetëm lexim) */}
        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 24 }}>
          <label className="input-label" style={{ marginBottom: 6, display: 'block' }}>Email</label>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{user?.email}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Email-i nuk mund të ndryshohet.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(74,155,111,0.1)', border: '1px solid rgba(74,155,111,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A9B6F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <p style={{ fontSize: 13, color: '#4A9B6F', fontWeight: 600, margin: 0 }}>Profili u ruajt me sukses!</p>
          </div>
        )}

        <button
          className="btn btn-primary btn-full"
          onClick={ruaj}
          disabled={loading || success}
          style={{ padding: '16px', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {loading ? (
            <>
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Duke ruajtur...
            </>
          ) : 'Ruaj Ndryshimet'}
        </button>
      </div>
    </div>
  )
}
