import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import {
  BookOpenIcon, AwardIcon, CreditCardIcon,
  SettingsIcon, HelpCircleIcon, FileTextIcon,
  StarIcon, LogOutIcon, ChevronRightIcon,
} from '../components/Icons'
import { useAuth } from '../context/AuthContext'
import { fetchCertificates, type ApiCertificate } from '../services/api'

const menuItems = [
  { Icon: BookOpenIcon,   label: 'Kurset e Mia',         path: '/my-courses', countKey: 'courses'      },
  { Icon: AwardIcon,      label: 'Certifikatat',          path: '/certificates', countKey: 'certs'      },
  { Icon: CreditCardIcon, label: 'Abonimi',               path: '/paywall'                              },
  { Icon: SettingsIcon,   label: 'Cilësimet',             path: '/settings'                             },
  { Icon: HelpCircleIcon, label: 'Ndihma & Mbështetja',   path: '/help'                                 },
  { Icon: FileTextIcon,   label: 'Kushtet & Privatësia',  path: '/terms'                                },
]

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { user, enrollments, subscription, logout } = useAuth()
  const [certificates, setCertificates] = useState<ApiCertificate[]>([])

  useEffect(() => {
    fetchCertificates().then(setCertificates).catch(console.error)
  }, [])

  const displayName = user?.full_name || 'Përdorues'
  const displayEmail = user?.email || ''
  const avatarLetter = displayName.charAt(0).toUpperCase()

  const counts: Record<string, number> = {
    courses: enrollments.length,
    certs: certificates.length,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: 'var(--nav-height)' }}>

      {/* Header */}
      <div style={{ background: 'var(--gradient-primary)', padding: '48px 24px 32px' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="avatar avatar-xl" style={{ margin: '0 auto 12px', border: '3px solid rgba(255,255,255,0.3)' }}>{avatarLetter}</div>
          <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{displayName}</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 16 }}>{displayEmail}</p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: 'white', fontWeight: 600 }}>
            <StarIcon size={13} color="white" strokeWidth={2.2} />
            {subscription ? `Anëtar ${subscription.plan_name}` : 'Anëtar Falas'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
        {[
          { label: 'Kurse',       value: enrollments.length },
          { label: 'Përfunduar',  value: enrollments.filter(c => c.progress === 100).length },
          { label: 'Certifikata', value: certificates.length },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, padding: '16px 8px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Plan banner */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ background: 'rgba(122,79,45,0.07)', border: '1px solid rgba(122,79,45,0.2)', borderRadius: 'var(--radius-lg)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{subscription ? subscription.plan_name : 'Pa Abonim'}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {subscription ? `Ripërtërihet ${new Date(subscription.renews_at).toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Abonohu për akses të plotë'}
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/paywall')}>{subscription ? 'Menaxho' : 'Abonohu'}</button>
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          {menuItems.map((item, i) => {
            const count = item.countKey ? counts[item.countKey] : undefined
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{ width: '100%', padding: '15px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, borderBottom: i < menuItems.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.Icon size={17} color="var(--text-secondary)" strokeWidth={1.8} />
                </div>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'left' }}>{item.label}</span>
                {count !== undefined && (
                  <span style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '2px 8px', fontSize: 12, color: 'var(--text-muted)' }}>{count}</span>
                )}
                <ChevronRightIcon size={16} color="var(--text-muted)" strokeWidth={2} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: '16px 20px' }}>
        <button
          onClick={async () => { await logout(); navigate('/login') }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', background: 'rgba(217,79,79,0.06)', color: 'var(--danger)', border: '1px solid rgba(217,79,79,0.2)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
        >
          <LogOutIcon size={16} color="var(--danger)" strokeWidth={2} />
          Dil nga Llogaria
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
