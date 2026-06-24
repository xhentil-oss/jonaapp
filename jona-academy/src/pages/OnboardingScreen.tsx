import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const slides = [
  {
    image: '/jona-1.webp',
    title: 'Rrit Veten Çdo Ditë',
    subtitle: 'Zbulo qindra kurse për motivim, shëndet, mirëqenie dhe zhvillim personal.',
  },
  {
    image: '/jona-7.webp',
    title: 'Mëso në Ritmin Tënd',
    subtitle: 'Shiko mësimet kur të duash, kudo që të jesh. Gjurmo progresin dhe fito certifikata.',
  },
  {
    image: '/jona-9.webp',
    title: 'Transformo Jetën Tënde',
    subtitle: 'Bashkohu me mijëra studentë që po ndryshojnë jetën e tyre me Jona Academy.',
  },
]

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()
  const slide = slides[current]

  const next = () => {
    if (current < slides.length - 1) setCurrent(c => c + 1)
    else navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', padding: '60px 24px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 40 }}>
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer' }}>Kalo</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
        <div key={current} className="scale-in" style={{ width: 220, height: 220, borderRadius: 48, overflow: 'hidden', boxShadow: '0 8px 32px rgba(28,23,20,0.18)', border: '2px solid var(--border)' }}>
          <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        </div>
        <div key={`text-${current}`} className="fade-in" style={{ textAlign: 'center', padding: '0 12px' }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 14, color: 'var(--text-primary)' }}>{slide.title}</h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{slide.subtitle}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, cursor: 'pointer', background: i === current ? 'var(--primary)' : 'var(--border)', transition: 'all 0.3s' }} />
        ))}
      </div>

      <button className="btn btn-primary btn-full" onClick={next} style={{ fontSize: 16, padding: '16px' }}>
        {current < slides.length - 1 ? 'Vazhdo →' : 'Fillo Tani'}
      </button>
    </div>
  )
}
