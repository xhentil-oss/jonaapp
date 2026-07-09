import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SectionsManager from '../components/SectionsManager'
import {
  fetchCourse, createCourse, updateCourse, fetchCategories, fetchInstructors, uploadImage,
  type AdminCourse, type Category, type Instructor,
} from '../services/api'

// Uploaded images live under the backend's /uploads; older seed images are
// relative paths served by the student frontend's own public/ folder and
// can't be resolved from here, but the field itself is still editable.
function resolveImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('/uploads')) {
    return url.startsWith('/uploads') ? `https://app.jonacademy.com${url}` : url
  }
  return url
}

const LEVELS = [
  { value: 'fillestare', label: 'Fillestare' },
  { value: 'mesatar', label: 'Mesatar' },
  { value: 'avancuar', label: 'Avancuar' },
  { value: 'te_gjitha_nivelet', label: 'Të gjitha nivelet' },
]
const ACCESS_TYPES = [
  { value: 'premium', label: 'Premium' },
  { value: 'vip', label: 'VIP' },
  { value: 'free', label: 'Falas' },
]

type FormState = {
  title: string
  short_description: string
  long_description: string
  category_id: string
  instructor_id: string
  level: string
  duration_minutes: number
  price: string
  access_type: string
  cover_image_url: string
  is_new: boolean
  is_featured: boolean
}

const emptyForm: FormState = {
  title: '', short_description: '', long_description: '', category_id: '', instructor_id: '',
  level: 'te_gjitha_nivelet', duration_minutes: 0, price: '0', access_type: 'premium',
  cover_image_url: '', is_new: false, is_featured: false,
}

export default function CourseFormPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>(emptyForm)
  const [course, setCourse] = useState<AdminCourse | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
    fetchInstructors().then(setInstructors).catch(() => {})
  }, [])

  const load = () => {
    if (isNew) return
    setLoading(true)
    fetchCourse(Number(id))
      .then(c => {
        setCourse(c)
        setForm({
          title: c.title,
          short_description: c.short_description || '',
          long_description: c.long_description || '',
          category_id: String(c.category_id),
          instructor_id: String(c.instructor_id),
          level: c.level,
          duration_minutes: c.duration_minutes,
          price: c.price,
          access_type: c.access_type,
          cover_image_url: c.cover_image_url || '',
          is_new: !!c.is_new,
          is_featured: !!c.is_featured,
        })
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(load, [id])

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const { url } = await uploadImage(file)
      setForm(f => ({ ...f, cover_image_url: url }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gabim ngarkimi')
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    if (!form.title.trim() || !form.category_id || !form.instructor_id) {
      setError('Titulli, kategoria dhe instruktori janë të detyrueshëm.')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      title: form.title.trim(),
      short_description: form.short_description,
      long_description: form.long_description,
      category_id: Number(form.category_id),
      instructor_id: Number(form.instructor_id),
      level: form.level,
      duration_minutes: Number(form.duration_minutes),
      price: Number(form.price),
      access_type: form.access_type,
      cover_image_url: form.cover_image_url,
      is_new: form.is_new,
      is_featured: form.is_featured,
    }
    try {
      if (isNew) {
        const { id: newId } = await createCourse(payload)
        navigate(`/courses/${newId}`)
      } else {
        await updateCourse(Number(id), payload)
        load()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gabim')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Duke ngarkuar...</p>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/courses')}>← Kthehu</button>
        <h1 style={{ fontSize: 22 }}>{isNew ? 'Kurs i Ri' : 'Edito Kursin'}</h1>
      </div>

      {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}

      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
          <div style={{ flexShrink: 0 }}>
            <label className="input-label">Foto e kursit</label>
            {form.cover_image_url
              ? <img src={resolveImageUrl(form.cover_image_url)} alt="" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
              : <div style={{ width: 120, height: 90, borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />}
            <label className="btn btn-secondary btn-sm" style={{ marginTop: 8, cursor: 'pointer', width: 120, justifyContent: 'center' }}>
              {uploading ? <span className="spinner" /> : 'Ngarko foto'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            </label>
          </div>

          <div style={{ flex: 1 }}>
            <label className="input-label">Titulli</label>
            <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ marginBottom: 14 }} />
            <label className="input-label">Përshkrimi i shkurtër</label>
            <textarea className="input-field" value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} style={{ minHeight: 60 }} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="input-label">Përshkrimi i gjatë</label>
          <textarea className="input-field" value={form.long_description} onChange={e => setForm({ ...form, long_description: e.target.value })} style={{ minHeight: 160, fontFamily: 'monospace', fontSize: 13 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
          <div>
            <label className="input-label">Kategoria</label>
            <select className="input-field" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Zgjidh...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Instruktori</label>
            <select className="input-field" value={form.instructor_id} onChange={e => setForm({ ...form, instructor_id: e.target.value })}>
              <option value="">Zgjidh...</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Niveli</label>
            <select className="input-field" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
              {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Çmimi (€)</label>
            <input className="input-field" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <div>
            <label className="input-label">Kohëzgjatja (minuta)</label>
            <input className="input-field" type="number" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: Number(e.target.value) })} />
          </div>
          <div>
            <label className="input-label">Lloji i aksesit</label>
            <select className="input-field" value={form.access_type} onChange={e => setForm({ ...form, access_type: e.target.value })}>
              {ACCESS_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={form.is_new} onChange={e => setForm({ ...form, is_new: e.target.checked })} /> I ri
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} /> I zgjedhur (featured)
          </label>
        </div>

        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? <span className="spinner" /> : isNew ? 'Krijo Kursin' : 'Ruaj Ndryshimet'}
        </button>
      </div>

      {!isNew && course && (
        <>
          <h2 style={{ fontSize: 18, marginBottom: 14 }}>Seksionet dhe Mësimet</h2>
          <SectionsManager courseId={course.id} sections={course.sections || []} onRefresh={load} />
        </>
      )}
    </div>
  )
}
