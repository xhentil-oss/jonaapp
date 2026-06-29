import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { findLesson } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

export default function LessonPlayerScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasLessonAccess } = useAuth()
  const [duke_luajtur, setDukeLuajtur] = useState(false)
  const [tabAktiv, setTabAktiv] = useState<'permbledhje' | 'shenime'>('permbledhje')
  const [progresi, setProgresi] = useState(0)
  const [showFullDesc, setShowFullDesc] = useState(false)

  const found = findLesson(Number(id))

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!found) { navigate('/home'); return }
    if (!hasLessonAccess(found.lesson, found.course.id)) {
      navigate(`/paywall?courseId=${found.course.id}`)
    }
  }, [id])

  if (!found) return null

  const { lesson, course, module: mod } = found

  const allLessons = course.modules.flatMap(m => m.lessons)
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id)
  const nextLesson = allLessons[currentIndex + 1] ?? null
  const prevLesson = allLessons[currentIndex - 1] ?? null

  return (
    <div style={{ minHeight: '100vh', background: '#1C1714', display: 'flex', flexDirection: 'column' }}>

      {/* Video zone */}
      <div style={{ background: '#1C1714', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <button
          onClick={() => navigate(`/course/${found?.course.id}`)}
          style={{ position: 'absolute', top: 12, left: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 2 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        {(lesson as any).videoUrl ? (
          <iframe
            src={`https://drive.google.com/file/d/${(lesson as any).videoUrl}/preview`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="autoplay"
            allowFullScreen
          />
        ) : (
          <>
            <button
              onClick={() => setDukeLuajtur(p => !p)}
              style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'white' }}
            >
              {duke_luajtur ? '⏸' : '▶'}
            </button>
            <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '4px 8px', fontSize: 12, color: 'white' }}>{lesson.duration}</div>
          </>
        )}

        {lesson.isFree && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(74,155,111,0.9)', borderRadius: 12, padding: '4px 10px', fontSize: 11, color: 'white', fontWeight: 600, zIndex: 2 }}>Falas</div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, background: 'var(--bg-primary)', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -8 }}>

        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Progresi i mësimit</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{progresi}%</p>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progresi}%` }} /></div>
        </div>

        <div style={{ padding: '14px 20px 0' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{course.title} · {mod.title}</p>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>{lesson.title}</h2>
        </div>

        <div style={{ display: 'flex', padding: '0 20px', marginTop: 14, borderBottom: '1px solid var(--border)' }}>
          {(['permbledhje', 'shenime'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setTabAktiv(tab)}
              style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: tabAktiv === tab ? 'var(--primary)' : 'var(--text-muted)', borderBottom: tabAktiv === tab ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -1, transition: 'all 0.2s' }}
            >
              {tab === 'permbledhje' ? 'Përmbledhje' : 'Shënime'}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px' }}>
          {tabAktiv === 'permbledhje' ? (
            <div>
              <div style={{ position: 'relative', marginBottom: 4 }}>
                <div style={{ overflow: 'hidden', maxHeight: showFullDesc ? 'none' : 100 }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {course.description || course.shortDesc}
                  </p>
                </div>
                {!showFullDesc && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }} />
                )}
              </div>
              <button
                onClick={() => setShowFullDesc(v => !v)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '4px 0 14px', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {showFullDesc ? 'Lexo më pak' : 'Lexo më shumë'}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showFullDesc ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '12px 14px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Instruktore</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="avatar avatar-sm">{course.instructor[0]}</div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{course.instructor}</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 12, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '12px', border: '1px solid var(--border)' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(122,79,45,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>1</div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Shënimet do të jenë të disponueshme gjatë mësimit.</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '0 20px 32px', display: 'flex', gap: 10, marginTop: 8 }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            disabled={!prevLesson}
            onClick={() => prevLesson && navigate(`/lesson/${prevLesson.id}`)}
          >
            ← Mësimine parë
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => {
              setProgresi(100)
              if (nextLesson) {
                navigate(`/lesson/${nextLesson.id}`)
              } else {
                navigate(`/course/${course.id}`)
              }
            }}
          >
            {nextLesson ? 'Tjetër →' : 'Përfundo ✓'}
          </button>
        </div>
      </div>
    </div>
  )
}
