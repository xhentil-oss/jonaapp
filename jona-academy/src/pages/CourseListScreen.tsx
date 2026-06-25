import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import { courses, categories } from '../data/mockData'

export default function CourseListScreen() {
  const [searchParams] = useSearchParams()
  const categoryIdParam = searchParams.get('category')
  const initialCategory = categoryIdParam
    ? (categories.find(c => c.id === Number(categoryIdParam))?.name ?? 'Të gjitha')
    : 'Të gjitha'
  const [filtriAktiv, setFiltriAktiv] = useState(initialCategory)
  const filtrat = ['Të gjitha', ...categories.map(c => c.name)]
  const filtered = filtriAktiv === 'Të gjitha' ? courses : courses.filter(c => c.category === filtriAktiv)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: 'var(--nav-height)' }}>
      <Header title="Të gjitha Kurset" showBack />

      <div style={{ padding: '14px 20px', display: 'flex', gap: 8, overflowX: 'auto', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
        {filtrat.map(f => (
          <button key={f} className={`chip ${filtriAktiv === f ? 'active' : ''}`} onClick={() => setFiltriAktiv(f)}>{f}</button>
        ))}
      </div>

      <div style={{ padding: '14px 20px 6px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{filtered.length} kurse u gjetën</p>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(c => <CourseCard key={c.id} {...c} variant="horizontal" />)}
      </div>

      <BottomNav />
    </div>
  )
}
