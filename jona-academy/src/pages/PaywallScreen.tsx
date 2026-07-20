import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { StarIcon } from '../components/Icons'
import { fetchCourse, type ApiCourse } from '../services/api'

const planet = [
  {
    id: 'mujor',
    emri: 'Mujor',
    cmimi: '€9.99',
    periudha: '/muaj',
    kursim: null,
    karakteristikat: ['Të gjitha kurset premium', 'Kurse të reja çdo javë', 'Certifikata', 'Anulo kurdo'],
  },
  {
    id: 'vjetor',
    emri: 'Vjetor',
    cmimi: '€59.99',
    periudha: '/vit',
    kursim: 'Kursej 50%',
    karakteristikat: ['Të gjitha kurset premium', 'Kurse të reja çdo javë', 'Certifikata', 'Mbështetje prioritare', '2 muaj falas'],
    popular: true,
  },
]

export default function PaywallScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const courseId = new URLSearchParams(location.search).get('courseId')
  const [course, setCourse] = useState<ApiCourse | null>(null)
  const [zgjedhur, setZgjedhur] = useState<'mujor' | 'vjetor' | 'njëherë'>('vjetor')

  useEffect(() => {
    if (courseId) fetchCourse(Number(courseId)).then(setCourse).catch(console.error)
  }, [courseId])

  const handleCTA = () => {
    if (zgjedhur === 'njëherë') {
      if (course) {
        navigate(`/checkout/${course.id}`)
      } else {
        navigate('/courses')
      }
    } else {
      navigate(`/checkout/sub-${zgjedhur}`)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, padding: '16px 24px 40px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #7A4F2D, #A0673A)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 6px 20px rgba(122,79,45,0.3)' }}>
            <StarIcon size={28} color="white" strokeWidth={1.8} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Zhblloko Premium</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>Zgjedh si dëshiron të vazhdosh. Blerje e vetme ose akses i plotë me abonim.</p>
        </div>

        {/* Blerje e vetme */}
        <button
          onClick={() => setZgjedhur('njëherë')}
          style={{
            background: zgjedhur === 'njëherë' ? 'rgba(122,79,45,0.08)' : 'var(--bg-secondary)',
            border: `2px solid ${zgjedhur === 'njëherë' ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-lg)', padding: '16px', cursor: 'pointer', marginBottom: 12,
            width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s',
          }}
        >
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>Blerje e vetme e kursit</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Akses vetëm për këtë kurs, përgjithmonë</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: zgjedhur === 'njëherë' ? 'var(--primary)' : 'var(--text-primary)' }}>{course?.price ?? '€29'}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>një herë</p>
          </div>
        </button>

        <div className="divider-text">ose abonohu për të gjitha kurset</div>

        {planet.map(plan => (
          <button
            key={plan.id}
            onClick={() => setZgjedhur(plan.id as 'mujor' | 'vjetor')}
            style={{
              background: zgjedhur === plan.id ? 'rgba(122,79,45,0.08)' : 'var(--bg-secondary)',
              border: `2px solid ${zgjedhur === plan.id ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)', padding: '16px', cursor: 'pointer', marginBottom: 10,
              width: '100%', textAlign: 'left', position: 'relative', transition: 'all 0.2s',
            }}
          >
            {plan.popular && (
              <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--gradient-primary)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}>
                <StarIcon size={11} color="white" strokeWidth={2.5} /> Më i Popullarizuar
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Abonim {plan.emri}</p>
                {plan.kursim && <span className="badge badge-success">{plan.kursim}</span>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: zgjedhur === plan.id ? 'var(--primary)' : 'var(--text-primary)' }}>{plan.cmimi}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{plan.periudha}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {plan.karakteristikat.map(k => <span key={k} style={{ fontSize: 12, color: 'var(--text-secondary)' }}>✓ {k}</span>)}
            </div>
          </button>
        ))}

        <button className="btn btn-primary btn-full" onClick={handleCTA} style={{ marginTop: 16, padding: '16px', fontSize: 16 }}>
          {zgjedhur === 'njëherë'
            ? course ? `Blej për ${course.price}` : 'Zgjidh një kurs'
            : `Fillo Abonimin ${zgjedhur === 'vjetor' ? 'Vjetor' : 'Mujor'}`}
        </button>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', marginBottom: 10, display: 'block', width: '100%' }}>Rikthe Blerjet</button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>Kushtet e Shërbimit</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>Politika e Privatësisë</span>
          </div>
        </div>
      </div>
    </div>
  )
}
