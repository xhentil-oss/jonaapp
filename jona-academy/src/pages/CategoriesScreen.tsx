import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import { SearchIcon, CategoryIcon } from '../components/Icons'
import { fetchCourses, fetchCategories, type ApiCourse, type ApiCategory } from '../services/api'

export default function CategoriesScreen() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])

  useEffect(() => {
    fetchCourses().then(data => {
      setCourses(data)
      fetchCategories(data).then(setCategories)
    }).catch(console.error)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: 'var(--nav-height)' }}>
      <Header title="Eksplorimi" showNotification />

      <div style={{ padding: '12px 20px 20px', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
        <div className="input-wrapper has-icon">
          <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
          </span>
          <input className="input-field" placeholder="Kërko kurse, tema..." style={{ borderRadius: 'var(--radius-full)' }} />
        </div>
      </div>

      {/* Statistikat */}
      <div style={{ display: 'flex', gap: 12, padding: '16px 20px' }}>
        {[
          { label: 'Kurse', value: courses.length },
          { label: 'Kategori', value: categories.length },
          { label: 'Studentë', value: '2.4k' },
        ].map(stat => (
          <div key={stat.label} style={{ flex: 1, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 12px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>{stat.value}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 20px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Të gjitha Kategoritë</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => navigate(`/courses?category=${cat.id}`)}
              style={{ background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}08)`, border: `1px solid ${cat.color}25`, borderRadius: 'var(--radius-lg)', padding: '20px 16px', cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${cat.color}18`, border: `1px solid ${cat.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <CategoryIcon name={cat.name} size={24} color={cat.color} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{cat.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cat.count} kurse</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
