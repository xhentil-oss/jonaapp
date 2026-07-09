import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import { fetchCourses, fetchCategories, type ApiCourse, type ApiCategory } from '../services/api'

export default function CourseListScreen() {
  const [searchParams] = useSearchParams()
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])

  useEffect(() => {
    fetchCourses().then(data => {
      setCourses(data)
      fetchCategories(data).then(setCategories)
    }).catch(console.error)
  }, [])

  const categoryIdParam = searchParams.get('category')
  const [filtriAktiv, setFiltriAktiv] = useState('Të gjitha')

  useEffect(() => {
    if (categoryIdParam && categories.length > 0) {
      const cat = categories.find(c => c.id === Number(categoryIdParam))
      if (cat) setFiltriAktiv(cat.name)
    }
  }, [categoryIdParam, categories])

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
