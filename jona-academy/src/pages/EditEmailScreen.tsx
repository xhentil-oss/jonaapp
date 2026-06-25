import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reauthenticateWithCredential, EmailAuthProvider, updateEmail } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { MailIcon, LockIcon, ChevronLeftIcon, EyeIcon, EyeOffIcon } from '../components/Icons'

export default function EditEmailScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [emailRi, setEmailRi] = useState('')
  const [fjalekalim, setFjalekalim] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const ruaj = async () => {
    if (!emailRi.trim()) { setError('Shkruaj email-in e ri.'); return }
    if (!/\S+@\S+\.\S+/.test(emailRi)) { setError('Email-i nuk është i vlefshëm.'); return }
    if (!fjalekalim) { setError('Shkruaj fjalëkalimin aktual.'); return }
    setLoading(true)
    setError('')
    try {
      const credential = EmailAuthProvider.credential(user!.email!, fjalekalim)
      await reauthenticateWithCredential(auth.currentUser!, credential)
      await updateEmail(auth.currentUser!, emailRi.trim())
      await updateDoc(doc(db, 'users', auth.currentUser!.uid), { email: emailRi.trim() })
      setSuccess(true)
      setTimeout(() => navigate(-1), 1200)
    } catch (e: any) {
      const code = e?.code || ''
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Fjalëkalimi është i gabuar.')
      } else if (code === 'auth/email-already-in-use') {
        setError('Ky email është tashmë në përdorim.')
      } else if (code === 'auth/too-many-requests') {
        setError('Shumë tentativa. Provo pas disa minutash.')
      } else {
        setError('Ndodhi një gabim. Provo sërish.')
      }
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
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Ndrysho Email-in</h2>
      </div>

      <div style={{ flex: 1, padding: '28px 20px' }}>

        {/* Email aktual */}
        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
          <label className="input-label" style={{ marginBottom: 6, display: 'block' }}>Email Aktual</label>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{user?.email}</p>
        </div>

        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>

          {/* Email i ri */}
          <div className="input-group">
            <label className="input-label">Email i Ri</label>
            <div className="input-wrapper has-icon">
              <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <MailIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
              </span>
              <input
                className="input-field"
                type="email"
                placeholder="adresa@email.com"
                value={emailRi}
                onChange={e => { setEmailRi(e.target.value); setError('') }}
                autoFocus
              />
            </div>
          </div>

          {/* Fjalëkalimi për verifikim */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Fjalëkalimi Aktual</label>
            <div className="input-wrapper has-icon">
              <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <LockIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
              </span>
              <input
                className="input-field"
                type={showPass ? 'text' : 'password'}
                placeholder="Konfirmo me fjalëkalim"
                value={fjalekalim}
                onChange={e => { setFjalekalim(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && ruaj()}
              />
              <button className="input-icon-right" onClick={() => setShowPass(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                {showPass ? <EyeOffIcon size={16} strokeWidth={1.8} /> : <EyeIcon size={16} strokeWidth={1.8} />}
              </button>
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
            <p style={{ fontSize: 13, color: '#4A9B6F', fontWeight: 600, margin: 0 }}>Email-i u ndryshua me sukses!</p>
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
              Duke ndryshuar...
            </>
          ) : 'Ndrysho Email-in'}
        </button>
      </div>
    </div>
  )
}
