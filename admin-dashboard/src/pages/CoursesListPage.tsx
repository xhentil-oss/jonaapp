import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import { fetchCourses, fetchCategories, deleteCourse, type AdminCourse, type Category } from '../services/api'

const LEVELS = [
  { value: '', label: 'Të gjitha nivelet' },
  { value: 'fillestare', label: 'Fillestare' },
  { value: 'mesatar', label: 'Mesatar' },
  { value: 'avancuar', label: 'Avancuar' },
  { value: 'te_gjitha_nivelet', label: 'Të gjitha nivelet (fushë)' },
]

export default function CoursesListPage() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [level, setLevel] = useState('')
  const [toDelete, setToDelete] = useState<AdminCourse | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchCategories().then(setCategories).catch(() => {}) }, [])

  const load = () => {
    setLoading(true)
    setError('')
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (categoryId) params.category_id = categoryId
    if (level) params.level = level
    fetchCourses(params).then(setCourses).catch(e => setError(e.message)).finally(() => setLoading(false))
  }

  useEffect(load, [categoryId, level])

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await deleteCourse(toDelete.id)
      setToDelete(null)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gabim')
      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22 }}>Kurset</h1>
        <button className="btn btn-primary" onClick={() => navigate('/courses/new')}>+ Kurs i ri</button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          className="input-field" style={{ maxWidth: 260 }} placeholder="Kërko sipas titullit..."
          value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
        />
        <select className="input-field" style={{ maxWidth: 200 }} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">Të gjitha kategoritë</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input-field" style={{ maxWidth: 200 }} value={level} onChange={e => setLevel(e.target.value)}>
          {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <button className="btn btn-secondary" onClick={load}>Kërko</button>
      </div>

      {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}

      <div className="card">
        {loading ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>Duke ngarkuar...</p>
        ) : courses.length === 0 ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>Asnjë kurs nuk u gjet.</p>
        ) : (
          <table>
            <thead><tr><th>Titulli</th><th>Kategoria</th><th>Niveli</th><th>Çmimi</th><th>Tipi</th><th>Mësime</th><th></th></tr></thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, maxWidth: 320 }}>{c.title}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.category_name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.level}</td>
                  <td>€{Number(c.price).toFixed(2)}</td>
                  <td><span className={`badge ${c.access_type === 'vip' ? 'badge-success' : ''}`}>{c.access_type}</span></td>
                  <td>{c.lessons_count}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button className="btn btn-secondary btn-sm" style={{ marginRight: 6 }} onClick={() => navigate(`/courses/${c.id}`)}>Edito</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setToDelete(c)}>Fshi</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        open={!!toDelete}
        title="Fshi Kursin?"
        message={`A je i sigurt që do të fshish "${toDelete?.title}"? Të gjitha seksionet, mësimet dhe regjistrimet e lidhura do të fshihen. Ky veprim nuk kthehet mbrapa.`}
        danger
        loading={deleting}
        confirmLabel="Fshi"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
