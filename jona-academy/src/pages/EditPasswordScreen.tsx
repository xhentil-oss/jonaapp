import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updatePassword as updatePasswordApi } from '../services/api'
import { LockIcon, ChevronLeftIcon, EyeIcon, EyeOffIcon } from '../components/Icons'

export default function EditPasswordScreen() {
  const navigate = useNavigate()

  const [fjalekalimAktual, setFjalekalimAktual] = useState('')
  const [fjalekalimRi, setFjalekalimRi] = useState('')
  const [konfirmo, setKonfirmo] = useState('')
  const [showAktual, setShowAktual] = useState(false)
  const [showRi, setShowRi] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const ndrysho = async () => {
    if (!fjalekalimAktual) { setError('Shkruaj fjalëkalimin aktual.'); return }
    if (fjalekalimRi.length < 6) { setError('Fjalëkalimi i ri duhet të ketë të paktën 6 karaktere.'); return }
    if (fjalekalimRi !== konfirmo) { setError('Fjalëkalimet e reja nuk përputhen.'); return }
    setLoading(true)
    setError('')
    try {
      await updatePasswordApi(fjalekalimAktual, fjalekalimRi)
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
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Ndrysho Fjalëkalimin</h2>
      </div>

      <div style={{ flex: 1, padding: '28px 20px' }}>

        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>

          {/* Fjalëkalimi aktual */}
          <div className="input-group">
            <label className="input-label">Fjalëkalimi Aktual</label>
            <div className="input-wrapper has-icon">
              <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <LockIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
              </span>
              <input
                className="input-field"
                type={showAktual ? 'text' : 'password'}
                placeholder="Fjalëkalimi juaj aktual"
                value={fjalekalimAktual}
                onChange={e => { setFjalekalimAktual(e.target.value); setError('') }}
                autoFocus
              />
              <button className="input-icon-right" onClick={() => setShowAktual(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                {showAktual ? <EyeOffIcon size={16} strokeWidth={1.8} /> : <EyeIcon size={16} strokeWidth={1.8} />}
              </button>
            </div>
          </div>

          {/* Fjalëkalimi i ri */}
          <div className="input-group">
            <label className="input-label">Fjalëkalimi i Ri</label>
            <div className="input-wrapper has-icon">
              <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <LockIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
              </span>
              <input
                className="input-field"
                type={showRi ? 'text' : 'password'}
                placeholder="Min. 6 karaktere"
                value={fjalekalimRi}
                onChange={e => { setFjalekalimRi(e.target.value); setError('') }}
              />
              <button className="input-icon-right" onClick={() => setShowRi(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                {showRi ? <EyeOffIcon size={16} strokeWidth={1.8} /> : <EyeIcon size={16} strokeWidth={1.8} />}
              </button>
            </div>
          </div>

          {/* Konfirmo */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Konfirmo Fjalëkalimin e Ri</label>
            <div className="input-wrapper has-icon">
              <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <LockIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
              </span>
              <input
                className="input-field"
                type="password"
                placeholder="Përsërit fjalëkalimin e ri"
                value={konfirmo}
                onChange={e => { setKonfirmo(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && ndrysho()}
              />
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
          </div>
        )}

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(74,155,111,0.1)', border: '1px solid rgba(74,155,111,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A9B6F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <p style={{ fontSize: 13, color: '#4A9B6F', fontWeight: 600, margin: 0 }}>Fjalëkalimi u ndryshua me sukses!</p>
          </div>
        )}

        <button
          className="btn btn-primary btn-full"
          onClick={ndrysho}
          disabled={loading || success}
          style={{ padding: '16px', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {loading ? (
            <>
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Duke ndryshuar...
            </>
          ) : 'Ndrysho Fjalëkalimin'}
        </button>
      </div>
    </div>
  )
}
