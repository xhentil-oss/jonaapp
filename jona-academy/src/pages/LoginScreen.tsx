import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, GlobeIcon } from '../components/Icons'
import { useAuth } from '../context/AuthContext'

export default function LoginScreen() {
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) { setError('Plotëso të gjitha fushat.'); return }
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/home')
    } catch (e: any) {
      const code = e?.code || ''
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Email ose fjalëkalim i gabuar.')
      } else if (code === 'auth/too-many-requests') {
        setError('Shumë tentativa. Provo sërish pas pak minutash.')
      } else {
        setError('Ndodhi një gabim. Provo sërish.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>

      <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
        <img src="/jona-brown-1.png" alt="Jona Academy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, rgba(28,23,20,0.65) 0%, transparent 100%)' }} />
        <h2 style={{ position: 'absolute', bottom: 16, left: 20, color: 'white', fontSize: 22, fontWeight: 800, letterSpacing: 0.3, margin: 0 }}>Jona Academy</h2>
      </div>

      <div style={{ flex: 1, padding: '28px 24px' }}>
        <h1 style={{ fontSize: 24, marginBottom: 6, color: 'var(--text-primary)' }}>Mirë se u ktheve</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Hyr për të vazhduar mësimin</p>

        <div className="input-group">
          <label className="input-label">Email</label>
          <div className="input-wrapper has-icon">
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <MailIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
            </span>
            <input className="input-field" type="email" placeholder="emaili@juaj.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Fjalëkalimi</label>
          <div className="input-wrapper has-icon">
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
            </span>
            <input className="input-field" type={showPass ? 'text' : 'password'} placeholder="Shkruaj fjalëkalimin" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <button className="input-icon-right" onClick={() => setShowPass(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              {showPass ? <EyeOffIcon size={16} strokeWidth={1.8} /> : <EyeIcon size={16} strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
          </div>
        )}

        <button onClick={() => navigate('/forgot-password')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, cursor: 'pointer', marginBottom: 24, padding: 0 }}>
          Harrove fjalëkalimin?
        </button>

        <button
          className="btn btn-primary btn-full"
          onClick={handleLogin}
          disabled={loading}
          style={{ marginBottom: 16, padding: '16px', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {loading ? (
            <>
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Duke hyrë...
            </>
          ) : 'Hyr'}
        </button>

        <div className="divider-text">ose vazhdo me</div>

        <button
          className="btn btn-secondary btn-full"
          style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          onClick={async () => { try { await loginWithGoogle(); navigate('/home') } catch (e: any) { setError('Nuk u lidh me Google. Provo sërish.') } }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Vazhdo me Google
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Nuk ke llogari?{' '}
          <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Regjistrohu</button>
        </p>
      </div>
    </div>
  )
}
