import { useNavigate, useLocation } from 'react-router-dom'
import { GridIcon, CompassIcon, BookOpenIcon, AwardIcon, UserIcon } from './Icons'

const tabs = [
  { path: '/home', Icon: GridIcon, label: 'Kryesore' },
  { path: '/categories', Icon: CompassIcon, label: 'Eksplorimi' },
  { path: '/my-courses', Icon: BookOpenIcon, label: 'Kurset e Mia' },
  { path: '/certificates', Icon: AwardIcon, label: 'Certifikata' },
  { path: '/profile', Icon: UserIcon, label: 'Profili' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, height: 'var(--nav-height)',
      background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)', boxShadow: '0 -4px 20px rgba(28,23,20,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      zIndex: 100, padding: '0 4px',
    }}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path
        return (
          <button key={tab.path} onClick={() => navigate(tab.path)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 8px', background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
            <div style={{ width: 36, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: active ? 'rgba(122,79,45,0.12)' : 'transparent', transition: 'all 0.2s' }}>
              <tab.Icon size={20} color={active ? 'var(--primary)' : '#A89A90'} strokeWidth={active ? 2.2 : 1.6} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 600, color: active ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.2s', textAlign: 'center', lineHeight: 1.2 }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
