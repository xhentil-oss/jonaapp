import { useNavigate } from 'react-router-dom'
import { ClockIcon, LayersIcon, LockIcon } from './Icons'

interface CourseCardProps {
  id: number
  title: string
  instructor: string
  category: string
  duration: string
  lessons: number
  level: string
  price?: string
  isFree?: boolean
  isPremium?: boolean
  progress?: number
  color?: string
  emoji?: string
  image?: string
  variant?: 'default' | 'horizontal' | 'compact'
}

function MetaItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {icon}
      {text}
    </span>
  )
}

export default function CourseCard({ id, title, instructor, category, duration, lessons, level, price, isFree, isPremium, progress, color = '#7A4F2D', emoji = '🎯', image, variant = 'default' }: CourseCardProps) {
  const navigate = useNavigate()
  const iconColor = '#A89A90'
  const iconSize = 11

  if (variant === 'horizontal') {
    return (
      <div
        onClick={() => navigate(`/course/${id}`)}
        style={{
          display: 'flex', gap: 12, background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
          padding: 12, cursor: 'pointer', transition: 'box-shadow 0.2s',
        }}
      >
        <div style={{ width: 80, height: 80, borderRadius: 12, flexShrink: 0, overflow: 'hidden', position: 'relative', background: `${color}22` }}>
          {image
            ? <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{emoji}</div>
          }
          {isPremium && !isFree && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LockIcon size={18} color="white" strokeWidth={2} />
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
            <span className="badge badge-primary" style={{ fontSize: 10 }}>{category}</span>
            {isFree && <span className="badge badge-free" style={{ fontSize: 10 }}>Falas</span>}
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{instructor}</p>
          <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-muted)', alignItems: 'center' }}>
            <MetaItem icon={<ClockIcon size={iconSize} color={iconColor} strokeWidth={2} />} text={duration} />
            <span>·</span>
            <MetaItem icon={<LayersIcon size={iconSize} color={iconColor} strokeWidth={2} />} text={`${lessons} mësime`} />
          </div>
          {progress !== undefined && (
            <div style={{ marginTop: 8 }}>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{progress}% përfunduar</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={() => navigate(`/course/${id}`)}
        style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
          padding: 10, cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center',
        }}
      >
        <div style={{ width: 46, height: 46, borderRadius: 10, flexShrink: 0, overflow: 'hidden', background: `${color}22` }}>
          {image
            ? <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{emoji}</div>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
          <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-muted)', alignItems: 'center', marginTop: 2 }}>
            <MetaItem icon={<LayersIcon size={iconSize} color={iconColor} strokeWidth={2} />} text={`${lessons} mësime`} />
            <span>·</span>
            <MetaItem icon={<ClockIcon size={iconSize} color={iconColor} strokeWidth={2} />} text={duration} />
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A89A90" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    )
  }

  // default card
  return (
    <div
      onClick={() => navigate(`/course/${id}`)}
      style={{
        width: 220, flexShrink: 0, background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{ height: 130, position: 'relative', overflow: 'hidden', background: `${color}22` }}>
        {image
          ? <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52 }}>{emoji}</div>
        }
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
        {isPremium && !isFree && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '5px 7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LockIcon size={13} color="white" strokeWidth={2} />
          </div>
        )}
        {isFree && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span className="badge badge-free">Falas</span>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 14px' }}>
        <span className="badge badge-primary" style={{ marginBottom: 8, display: 'inline-flex' }}>{category}</span>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3, lineHeight: 1.4 }}>{title}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{instructor}</p>
        <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-muted)', alignItems: 'center', marginBottom: 10 }}>
          <MetaItem icon={<ClockIcon size={iconSize} color={iconColor} strokeWidth={2} />} text={duration} />
          <span>·</span>
          <span>{level}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: isFree ? 'var(--secondary)' : 'var(--primary)' }}>
            {isFree ? 'Falas' : price}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
            <LayersIcon size={iconSize} color={iconColor} strokeWidth={2} />
            <span>{lessons}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
