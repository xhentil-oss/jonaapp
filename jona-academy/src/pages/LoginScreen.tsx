import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from '../components/Icons'
import { useAuth } from '../context/AuthContext'

export default function LoginScreen() {
  const navigate = useNavigate()
  const { login } = useAuth()
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
      setError(e?.message || 'Ndodhi një gabim. Provo sërish.')
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

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Nuk ke llogari?{' '}
          <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Regjistrohu</button>
        </p>
      </div>
    </div>
  )
}
