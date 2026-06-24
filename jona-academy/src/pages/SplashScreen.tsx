import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding'), 2500)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--gradient-primary)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 24,
    }}>
      <div style={{
        width: 140, height: 140, borderRadius: 36,
        overflow: 'hidden',
        boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
        border: '2px solid rgba(255,255,255,0.25)',
        animation: 'scaleIn 0.5s ease',
      }}>
        <img src="/jona-7.webp" alt="Jona Academy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6, color: '#FFFFFF' }}>Jona Academy</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15 }}>Rrit. Mëso. Transformo.</p>
      </div>
      <div style={{
        position: 'absolute', bottom: 60,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, border: '3px solid rgba(255,255,255,0.6)',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Loading...</p>
      </div>
    </div>
  )
}
