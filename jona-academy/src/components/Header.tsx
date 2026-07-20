import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from './Icons'

interface HeaderProps {
  title?: string
  showBack?: boolean
  transparent?: boolean
  rightElement?: React.ReactNode
}

export default function Header({ title, showBack = false, transparent = false, rightElement }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      background: transparent ? 'transparent' : 'rgba(255,255,255,0.97)',
      borderBottom: transparent ? 'none' : '1px solid var(--border)',
      boxShadow: transparent ? 'none' : '0 1px 8px rgba(28,23,20,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              flexShrink: 0,
            }}
          >
            <ChevronLeftIcon size={18} strokeWidth={2} />
          </button>
        )}
        {title && (
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {rightElement}
      </div>
    </header>
  )
}
