import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { deleteAccount } from '../services/api'
import { LockIcon, ChevronLeftIcon, EyeIcon, EyeOffIcon } from '../components/Icons'

export default function DeleteAccountScreen() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [fjalekalim, setFjalekalim] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [konfirmuar, setKonfirmuar] = useState(false)

  const fshi = async () => {
    if (!fjalekalim) { setError('Shkruaj fjalëkalimin për të konfirmuar.'); return }
    setLoading(true)
    setError('')
    try {
      await deleteAccount(fjalekalim)
      logout()
      navigate('/login')
    } catch (e: any) {
      setError(e?.message || 'Ndodhi një gabim. Provo sërish.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>

      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', flexShrink: 0 }}
        >
          <ChevronLeftIcon size={18} strokeWidth={2} />
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--danger)' }}>Fshi Llogarinë</h2>
      </div>

      <div style={{ flex: 1, padding: '28px 20px' }}>

        <div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 'var(--radius-lg)', padding: '18px', marginBottom: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#DC2626', marginBottom: 8 }}>Ky veprim nuk kthehet mbrapsht</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Fshirja e llogarisë do të heqë përgjithmonë profilin tënd, regjistrimet në kurse, progresin, certifikatat dhe abonimin. Nuk mund t'i rikuperosh më këto të dhëna.
          </p>
        </div>

        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Konfirmo me Fjalëkalimin</label>
            <div className="input-wrapper has-icon">
              <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <LockIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
              </span>
              <input
                className="input-field"
                type={showPass ? 'text' : 'password'}
                placeholder="Fjalëkalimi aktual"
                value={fjalekalim}
                onChange={e => { setFjalekalim(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && konfirmuar && fshi()}
              />
              <button className="input-icon-right" onClick={() => setShowPass(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                {showPass ? <EyeOffIcon size={16} strokeWidth={1.8} /> : <EyeIcon size={16} strokeWidth={1.8} />}
              </button>
            </div>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20, cursor: 'pointer' }}>
          <input type="checkbox" checked={konfirmuar} onChange={e => setKonfirmuar(e.target.checked)} style={{ marginTop: 3 }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>E kuptoj që kjo do të fshijë përgjithmonë llogarinë time dhe të gjitha të dhënat e lidhura me të.</span>
        </label>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          className="btn btn-full"
          onClick={fshi}
          disabled={loading || !konfirmuar}
          style={{ padding: '16px', background: 'var(--danger)', color: 'white', opacity: (loading || !konfirmuar) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {loading ? (
            <>
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Duke fshirë...
            </>
          ) : 'Fshi Llogarinë Përgjithmonë'}
        </button>
      </div>
    </div>
  )
}
