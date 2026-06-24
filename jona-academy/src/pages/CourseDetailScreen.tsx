import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courses } from '../data/mockData'
import { LockIcon, LayersIcon, ClockIcon, TrendingUpIcon, ChevronLeftIcon } from '../components/Icons'

export default function CourseDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expandedModule, setExpandedModule] = useState<number | null>(0)
  const course = courses.find(c => c.id === Number(id)) || courses[0]
  const hasAccess = course.isFree

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 120 }}>

      {/* Hero */}
      <div style={{
        height: 260, position: 'relative', overflow: 'hidden',
        background: `${course.color}22`,
      }}>
        {course.image
          ? <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90 }}>{course.emoji}</div>
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%)' }} />
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 16, left: 16,
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: 'white',
          }}
        >
          <ChevronLeftIcon size={18} color="white" strokeWidth={2} />
        </button>
        {!hasAccess && (
          <div style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(0,0,0,0.55)', borderRadius: 20,
            padding: '6px 12px', fontSize: 12, color: 'white', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
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
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, lineHeight: 1.3 }}>{course.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, lineHeight: 1.7 }}>{course.shortDesc}</p>

        {/* Instructor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div className="avatar avatar-sm">{course.instructor[0]}</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{course.instructor}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Instruktore</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 20 }}>
          {[
            { Icon: LayersIcon,    color: '#7A4F2D', label: 'Mësime',     value: course.lessons  },
            { Icon: ClockIcon,     color: '#4A9B6F', label: 'Kohëzgjatja', value: course.duration },
            { Icon: TrendingUpIcon, color: '#6366F1', label: 'Niveli',     value: course.level    },
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
        {course.description.split('\n\n').map((para, i) => (
          <p key={i} style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 12, lineHeight: 1.75 }}>{para}</p>
        ))}

        {/* Website link */}
        {(course as any).website && (
          <a
            href={(course as any).website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(122,79,45,0.06)', border: '1px solid rgba(122,79,45,0.2)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 24, textDecoration: 'none' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 1 }}>Informacione të plota</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>jonacademy.com</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        )}

        {/* Modules */}
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>Përmbajtja e Kursit</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {course.modules.map((mod, mi) => (
            <div key={mod.id} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <button
                onClick={() => setExpandedModule(expandedModule === mi ? null : mi)}
                style={{
                  width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{mod.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{mod.lessons.length} mësime</p>
                </div>
                <span style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', display: 'inline-block', transform: expandedModule === mi ? 'rotate(180deg)' : 'none' }}>▾</span>
              </button>

              {expandedModule === mi && (
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  {mod.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => hasAccess || lesson.isFree ? navigate(`/lesson/${lesson.id}`) : navigate('/paywall')}
                      style={{
                        width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: lesson.isFree ? 'rgba(74,155,111,0.12)' : 'var(--bg-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                        border: `1px solid ${lesson.isFree ? 'var(--secondary)' : 'var(--border)'}`,
                      }}>
                        {lesson.isFree
                          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--secondary)" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          : <LockIcon size={13} color="var(--text-muted)" strokeWidth={1.8} />
                        }
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{lesson.title}</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <ClockIcon size={10} color="var(--text-muted)" strokeWidth={2} /> {lesson.duration}
                          </span>
                          {lesson.isFree && <span className="badge badge-free" style={{ fontSize: 9, padding: '2px 6px' }}>Falas</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, padding: '16px 20px',
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
      boxShadow: '0 -4px 20px rgba(28,23,20,0.08)',
        borderTop: '1px solid var(--border)',
      }}>
        {hasAccess ? (
          <button className="btn btn-primary btn-full" onClick={() => navigate(`/lesson/1`)} style={{ padding: '16px' }}>
            ▶ Fillo Kursin
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline btn-full" onClick={() => navigate('/paywall')}>
              Abonohu
            </button>
            <button
              className="btn btn-primary btn-full"
              style={{ padding: '16px' }}
              onClick={() => navigate(`/checkout/${course.id}`)}
            >
              Blej {course.price}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
