import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, ChevronLeftIcon } from '../components/Icons'
import { useAuth } from '../context/AuthContext'

export default function RegisterScreen() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [emri, setEmri] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [konfirmo, setKonfirmo] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async () => {
    if (!emri || !email || !password || !konfirmo) { setError('Plotëso të gjitha fushat.'); return }
    if (password.length < 6) { setError('Fjalëkalimi duhet të ketë të paktën 6 karaktere.'); return }
    if (password !== konfirmo) { setError('Fjalëkalimet nuk përputhen.'); return }
    setLoading(true)
    setError('')
    try {
      await register(emri, email, password)
      navigate('/login')
    } catch (e: any) {
      setError(e?.message || 'Ndodhi një gabim. Provo sërish.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
          <ChevronLeftIcon size={18} strokeWidth={2} />
        </button>
      </div>

      <div style={{ flex: 1, padding: '24px 24px 40px' }}>
        <h1 style={{ fontSize: 24, marginBottom: 6, color: 'var(--text-primary)' }}>Krijo Llogari</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Fillo udhëtimin tënd të mësimit sot</p>

        <div className="input-group">
          <label className="input-label">Emri i Plotë</label>
          <div className="input-wrapper has-icon">
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <UserIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
            </span>
            <input className="input-field" type="text" placeholder="Emri juaj i plotë" value={emri} onChange={e => setEmri(e.target.value)} />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Email</label>
          <div className="input-wrapper has-icon">
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <MailIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
            </span>
            <input className="input-field" type="email" placeholder="emaili@juaj.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Fjalëkalimi</label>
          <div className="input-wrapper has-icon">
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
            </span>
            <input className="input-field" type={showPass ? 'text' : 'password'} placeholder="Min. 6 karaktere" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="input-icon-right" onClick={() => setShowPass(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              {showPass ? <EyeOffIcon size={16} strokeWidth={1.8} /> : <EyeIcon size={16} strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: 4 }}>
          <label className="input-label">Konfirmo Fjalëkalimin</label>
          <div className="input-wrapper has-icon">
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
            </span>
            <input className="input-field" type="password" placeholder="Përsërit fjalëkalimin" value={konfirmo} onChange={e => setKonfirmo(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRegister()} />
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, marginTop: 12 }}>
            <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          className="btn btn-primary btn-full"
          onClick={handleRegister}
          disabled={loading}
          style={{ marginBottom: 16, padding: '16px', marginTop: 20, opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          {loading ? (
            <>
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Duke krijuar...
            </>
          ) : 'Krijo Llogari'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6, marginTop: 20 }}>
          Duke krijuar llogari, pranon{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Kushtet e Shërbimit</span>{' '}dhe{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Politikën e Privatësisë</span>
        </p>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Ke llogari?{' '}
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Hyr</button>
        </p>
      </div>
    </div>
  )
}
