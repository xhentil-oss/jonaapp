import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  BarChartIcon, BookOpenIcon, TagIcon, GraduationCapIcon, UsersIcon,
  AwardIcon, CreditCardIcon, WalletIcon, SettingsIcon,
} from './Icons'

const navItems = [
  { to: '/', label: 'Paneli', Icon: BarChartIcon, end: true },
  { to: '/courses', label: 'Kurset', Icon: BookOpenIcon },
  { to: '/categories', label: 'Kategoritë', Icon: TagIcon },
  { to: '/instructors', label: 'Instruktorët', Icon: GraduationCapIcon },
  { to: '/users', label: 'Përdoruesit', Icon: UsersIcon },
  { to: '/certificates', label: 'Certifikatat', Icon: AwardIcon },
  { to: '/subscriptions', label: 'Abonimet', Icon: CreditCardIcon },
  { to: '/payments', label: 'Pagesat', Icon: WalletIcon },
  { to: '/settings', label: 'Cilësimet', Icon: SettingsIcon },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 'var(--sidebar-width)', background: 'var(--bg-sidebar)', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 20px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 15 }}>JA</div>
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>Jona Academy</p>
            <p style={{ color: 'var(--text-on-dark)', fontSize: 11 }}>Admin</p>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' }}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 8, fontSize: 14, fontWeight: 500,
                color: isActive ? 'white' : 'var(--text-on-dark)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              })}
            >
              <item.Icon size={17} strokeWidth={1.8} /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 20px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 12 }}>
          <p style={{ color: 'white', fontSize: 13, fontWeight: 600, marginTop: 12, marginBottom: 2 }}>{user?.full_name}</p>
          <p style={{ color: 'var(--text-on-dark)', fontSize: 12, marginBottom: 12 }}>{user?.email}</p>
          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
            onClick={() => { logout(); navigate('/login') }}
          >
            Dil
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: 28, maxWidth: 'calc(100vw - var(--sidebar-width))', overflowX: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
