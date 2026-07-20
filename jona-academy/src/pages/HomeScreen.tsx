import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import CourseCard from '../components/CourseCard'
import CategoryCard from '../components/CategoryCard'
import { SearchIcon, SparkleIcon, SunIcon } from '../components/Icons'
import { useAuth } from '../context/AuthContext'
import { fetchCourses, fetchCategories, type ApiCourse, type ApiCategory } from '../services/api'

const citateMotivuese = [
  { citate: 'Sekreti i fillimit është të fillosh.', autor: 'Mark Twain' },
  { citate: 'Suksesi nuk vjen tek ata që presin, por tek ata që veprojnë.', autor: 'Fatjona Cici' },
  { citate: 'Çdo ditë është një mundësi e re për të qenë versioni më i mirë i vetes.', autor: 'Jona Academy' },
]

export default function HomeScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const displayName = user?.full_name || 'Mirë se vini'
  const avatarLetter = displayName.charAt(0).toUpperCase()
  const citate = citateMotivuese[0]

  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])

  useEffect(() => {
    fetchCourses().then(data => {
      setCourses(data)
      fetchCategories(data).then(setCategories)
    }).catch(console.error)
  }, [])

  const kursetEZgjedhura = courses.filter(c => c.isPremium).slice(0, 4)
  const kursetEReja = courses.slice(4, 10)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: 'var(--nav-height)' }}>

      {/* Top Bar */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
            <SunIcon size={14} color="var(--primary)" strokeWidth={2} />
            Mirëmëngjes
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{displayName}</h2>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => navigate('/search')} style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <SearchIcon size={18} />
          </button>
          <div className="avatar avatar-sm" style={{ cursor: 'pointer', background: 'var(--gradient-primary)' }} onClick={() => navigate('/profile')}>{avatarLetter}</div>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative', minHeight: 200, boxShadow: '0 6px 28px rgba(28,23,20,0.18)' }}>
          <img src="/jona-brown-1.png" alt="Jona Academy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(28,23,20,0.82) 0%, rgba(28,23,20,0.35) 100%)' }} />
          <div style={{ position: 'relative', padding: '24px 20px' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5 }}>Jona Academy</p>
            <h3 style={{ color: 'white', fontSize: 17, marginBottom: 6, fontWeight: 800, lineHeight: 1.3 }}>Transformo jetën tënde</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 16 }}>{courses.length} kurse të disponueshme</p>
            <button className="btn" onClick={() => navigate('/courses')} style={{ background: 'white', color: 'var(--primary)', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 'var(--radius-full)' }}>Shiko Kurset</button>
          </div>
        </div>
      </div>

      {/* Kategoritë */}
      <div style={{ marginTop: 24, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 16 }}>
          <span className="section-title">Kategoritë</span>
          <button className="section-link" onClick={() => navigate('/categories')}>Shiko të gjitha</button>
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingLeft: 20, paddingRight: 20, paddingBottom: 8 }}>
          {categories.map(cat => <CategoryCard key={cat.id} {...cat} />)}
        </div>
      </div>

      {/* Kurse të Zgjedhura */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Kurse të Zgjedhura</span>
          <button className="section-link" onClick={() => navigate('/courses')}>Shiko të gjitha</button>
        </div>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }}>
          {kursetEZgjedhura.map(c => <CourseCard key={c.id} {...c} variant="default" />)}
        </div>
      </div>

      {/* Motivim Sot */}
      <div className="section">
        <div className="section-header">
          <span className="section-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <SparkleIcon size={16} color="var(--primary)" strokeWidth={2} /> Motivim Sot
          </span>
        </div>
        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border)', borderLeft: '4px solid var(--primary)', boxShadow: 'var(--shadow-card)' }}>
          <p style={{ fontSize: 15, fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.7 }}>"{citate.citate}"</p>
          <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700 }}>— {citate.autor}</p>
        </div>
      </div>

      {/* Kurse të Reja */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Kurse të Reja</span>
          <button className="section-link" onClick={() => navigate('/courses')}>Shiko të gjitha</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {kursetEReja.map(c => <CourseCard key={c.id} {...c} variant="horizontal" />)}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
