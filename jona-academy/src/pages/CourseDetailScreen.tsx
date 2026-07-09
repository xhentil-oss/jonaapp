import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LockIcon, LayersIcon, ClockIcon, TrendingUpIcon, ChevronLeftIcon } from '../components/Icons'
import { useAuth } from '../context/AuthContext'
import { fetchCourse, ApiCourse } from '../services/api'

function fmtSeconds(s: number): string {
  const m = Math.round(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem === 0 ? `${h}h` : `${h}h ${rem}m`
}

export default function CourseDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasCourseAccess, hasLessonAccess, hasSubscription } = useAuth()
  const [expandedModule, setExpandedModule] = useState<number | null>(0)
  const [showFullDesc, setShowFullDesc] = useState(true)
  const [course, setCourse] = useState<ApiCourse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetchCourse(Number(id))
      .then(data => { setCourse(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <p style={{ color: 'var(--text-muted)' }}>Duke ngarkuar...</p>
    </div>
  )

  if (!course) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <p style={{ color: 'var(--text-muted)' }}>Kursi nuk u gjet.</p>
    </div>
  )

  const hasAccess = hasCourseAccess(course.id)
  const isSubscriber = hasSubscription()
  const sections = course.sections || []

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 120 }}>

      {/* Hero */}
      <div style={{ height: 260, position: 'relative', overflow: 'hidden', background: `${course.color}22` }}>
        {course.image
          ? <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90 }}>{course.emoji}</div>
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%)' }} />
        <button
          onClick={() => navigate('/home')}
          style={{ position: 'absolute', top: 16, left: 16, width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
        >
          <ChevronLeftIcon size={18} color="white" strokeWidth={2} />
        </button>
        {!hasAccess && (
          <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.55)', borderRadius: 20, padding: '6px 12px', fontSize: 12, color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <LockIcon size={12} color="white" strokeWidth={2.2} />
            Premium
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <span className="badge badge-primary">{course.category}</span>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>{course.level}</span>
          {course.isFree && <span className="badge badge-free">Falas</span>}
          {isSubscriber && !course.isFree && <span className="badge" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366F1', border: '1px solid rgba(99,102,241,0.25)' }}>✓ Abonuar</span>}
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, lineHeight: 1.3 }}>{course.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, lineHeight: 1.7 }}>{course.shortDesc}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div className="avatar avatar-sm">{course.instructor[0]}</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{course.instructor}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Instruktore</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 20 }}>
          {[
            { Icon: LayersIcon,    color: '#7A4F2D', label: 'Mësime',      value: course.lessons },
            { Icon: ClockIcon,     color: '#4A9B6F', label: 'Kohëzgjatja', value: course.duration },
            { Icon: TrendingUpIcon, color: '#6366F1', label: 'Niveli',     value: course.level },
          ].map((stat, i) => (
            <div key={i} style={{ flex: 1, padding: '14px 10px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                <stat.Icon size={20} color={stat.color} strokeWidth={1.8} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <h3 style={{ fontSize: 16, marginBottom: 10 }}>Rreth këtij kursi</h3>
        <div style={{ position: 'relative' }}>
          <div style={{ overflow: 'hidden', maxHeight: showFullDesc ? 'none' : 120 }}>
            {(course.description || course.shortDesc).split('\n').map((line, i) => {
              if (line.trim() === '') return <div key={i} style={{ height: 10 }} />
              const isBullet = line.startsWith('■') || line.startsWith('●')
              return <p key={i} style={{ color: isBullet ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: 14, marginBottom: isBullet ? 4 : 0, lineHeight: 1.75, fontWeight: isBullet ? 500 : 400 }}>{line}</p>
            })}
          </div>
          {!showFullDesc && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }} />}
        </div>
        <button
          onClick={() => setShowFullDesc(v => !v)}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 14, fontWeight: 700, cursor: 'pointer', padding: '8px 0 16px', display: 'flex', alignItems: 'center', gap: 5 }}
        >
          {showFullDesc ? 'Lexo më pak' : 'Lexo më shumë'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showFullDesc ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        {/* Sections */}
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>Përmbajtja e Kursit</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {sections.map((sec, si) => (
            <div key={sec.id} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <button
                onClick={() => setExpandedModule(expandedModule === si ? null : si)}
                style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{sec.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sec.lessons.length} mësime</p>
                </div>
                <span style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', display: 'inline-block', transform: expandedModule === si ? 'rotate(180deg)' : 'none' }}>▾</span>
              </button>

              {expandedModule === si && (
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  {sec.lessons.map((lesson) => {
                    const lessonObj = { isFree: !!lesson.is_free }
                    const canAccess = hasLessonAccess(lessonObj, course.id)
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => canAccess ? navigate(`/lesson/${lesson.id}`) : navigate(`/paywall?courseId=${course.id}`)}
                        style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: canAccess ? 'rgba(74,155,111,0.12)' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${canAccess ? 'var(--secondary)' : 'var(--border)'}` }}>
                          {canAccess
                            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--secondary)" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            : <LockIcon size={13} color="var(--text-muted)" strokeWidth={1.8} />
                          }
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: canAccess ? 'var(--text-primary)' : 'var(--text-muted)', marginBottom: 2 }}>{lesson.title}</p>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                              <ClockIcon size={10} color="var(--text-muted)" strokeWidth={2} /> {fmtSeconds(lesson.duration_seconds)}
                            </span>
                            {lesson.is_free && <span className="badge badge-free" style={{ fontSize: 9, padding: '2px 6px' }}>Falas</span>}
                            {!lesson.is_free && !hasAccess && <span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 2 }}><LockIcon size={9} color="var(--text-muted)" strokeWidth={2} /> Premium</span>}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '16px 20px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', boxShadow: '0 -4px 20px rgba(28,23,20,0.08)', borderTop: '1px solid var(--border)' }}>
        {hasAccess ? (
          <button className="btn btn-primary btn-full" onClick={() => {
            const firstLesson = sections[0]?.lessons?.[0]
            navigate(`/lesson/${firstLesson?.id ?? 1}`)
          }} style={{ padding: '16px' }}>
            ▶ Fillo Kursin
          </button>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <button className="btn btn-outline btn-full" onClick={() => navigate(`/paywall?courseId=${course.id}`)}>Abonohu</button>
              <button className="btn btn-primary btn-full" style={{ padding: '16px' }} onClick={() => navigate(`/checkout/${course.id}`)}>
                Blej {course.price}
              </button>
            </div>
            {sections[0]?.lessons?.[0]?.is_free && (
              <button className="btn btn-secondary btn-full" style={{ fontSize: 13 }} onClick={() => navigate(`/lesson/${sections[0].lessons[0].id}`)}>
                ▶ Shiko mësimin e parë falas
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
