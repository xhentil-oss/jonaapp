import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) { setError('Plotëso email dhe fjalëkalimin.'); return }
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ndodhi një gabim.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
      <div className="card" style={{ width: 380, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, margin: '0 auto 12px' }}>JA</div>
          <h1 style={{ fontSize: 20, marginBottom: 4 }}>Jona Academy Admin</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Hyr për të menaxhuar platformën</p>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="input-label">Email</label>
          <input
            className="input-field" type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="admin@jonacademy.com"
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label className="input-label">Fjalëkalimi</label>
          <input
            className="input-field" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(217,79,79,0.2)', borderRadius: 8, padding: '10px 12px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</p>
          </div>
        )}

        <button className="btn btn-primary" style={{ width: '100%', padding: 12 }} onClick={handleSubmit} disabled={loading}>
          {loading ? <span className="spinner" /> : 'Hyr'}
        </button>
      </div>
    </div>
  )
}
