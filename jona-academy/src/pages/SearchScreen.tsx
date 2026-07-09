import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon, ChevronLeftIcon } from '../components/Icons'
import CourseCard from '../components/CourseCard'
import { fetchCourses, ApiCourse } from '../services/api'

export default function SearchScreen() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    fetchCourses().then(setCourses).catch(console.error)
  }, [])

  const q = query.trim().toLowerCase()
  const results = q
    ? courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.instructor?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      )
    : []

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>

      {/* Header me search input */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', flexShrink: 0 }}
        >
          <ChevronLeftIcon size={18} strokeWidth={2} />
        </button>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            <SearchIcon size={16} color="var(--text-muted)" strokeWidth={2} />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Kërko kurse, instruktorë..."
            style={{ width: '100%', paddingLeft: 38, paddingRight: query ? 36 : 12, paddingTop: 10, paddingBottom: 10, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-full)', fontSize: 14, background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 2 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        {/* Gjendje fillestare */}
        {!q && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <SearchIcon size={28} color="var(--text-muted)" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Kërko kurse</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Shkruaj titullin, instruktorin ose kategorinë</p>
          </div>
        )}

        {/* Pa rezultate */}
        {q && results.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Nuk u gjet asgjë</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Provo me fjalë të tjera</p>
          </div>
        )}

        {/* Rezultate */}
        {results.length > 0 && (
          <>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>{results.length} kurs{results.length !== 1 ? 'e' : ''} u gjet{results.length !== 1 ? 'ën' : ''}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {results.map(c => <CourseCard key={c.id} {...c} variant="horizontal" />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
