import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import { BookOpenIcon, AwardIcon, TrendingUpIcon } from '../components/Icons'
import { myCourses } from '../data/mockData'

export default function MyCoursesScreen() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'te-gjitha' | 'aktive' | 'perfunduara'>('te-gjitha')

  const filtered = myCourses.filter(c => {
    if (tab === 'aktive') return c.progress > 0 && c.progress < 100
    if (tab === 'perfunduara') return c.progress === 100
    return true
  })

  const tabs = [
    { id: 'te-gjitha', label: 'Të gjitha' },
    { id: 'aktive', label: 'Aktive' },
    { id: 'perfunduara', label: 'Përfunduara' },
  ] as const

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: 'var(--nav-height)' }}>
      <Header title="Kurset e Mia" />

      <div style={{ display: 'flex', gap: 12, padding: '16px 20px' }}>
        {[
          { label: 'Regjistruar', value: myCourses.length, Icon: BookOpenIcon, color: '#7A4F2D' },
          { label: 'Përfunduar', value: myCourses.filter(c => c.progress === 100).length, Icon: AwardIcon, color: '#4A9B6F' },
          { label: 'Në progres', value: myCourses.filter(c => c.progress > 0 && c.progress < 100).length, Icon: TrendingUpIcon, color: '#6366F1' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', padding: '12px 8px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
              <s.Icon size={20} color={s.color} strokeWidth={1.8} />
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '12px 8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: tab === t.id ? 'var(--primary)' : 'var(--text-muted)', borderBottom: tab === t.id ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -1 }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><BookOpenIcon size={40} color="#C4B5AC" strokeWidth={1.2} /></div>
            <p style={{ color: 'var(--text-secondary)' }}>Nuk ka kurse këtu</p>
          </div>
        ) : (
          filtered.map(c => <CourseCard key={c.id} {...c} variant="horizontal" />)
        )}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '20px', marginTop: 8 }}>
          <button className="btn btn-primary btn-full" onClick={() => navigate('/courses')}>Shfleto Kurset</button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
