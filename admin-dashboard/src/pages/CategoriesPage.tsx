import { useEffect, useState } from 'react'
import ConfirmModal from '../components/ConfirmModal'
import { fetchCategories, createCategory, updateCategory, deleteCategory, type Category } from '../services/api'

const emptyForm = { name: '', icon: '', color: '#7A4F2D' }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const load = () => {
    setLoading(true)
    fetchCategories().then(setCategories).catch(e => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, icon: c.icon || '', color: c.color || '#7A4F2D' }); setShowForm(true) }

  const save = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editing) await updateCategory(editing.id, form)
      else await createCategory(form)
      setShowForm(false)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gabim')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteCategory(toDelete.id)
      setToDelete(null)
      load()
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Gabim')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22 }}>Kategoritë</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Kategori e re</button>
      </div>

      {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}

      <div className="card">
        {loading ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>Duke ngarkuar...</p>
        ) : (
          <table>
            <thead><tr><th>Ikona</th><th>Emri</th><th>Ngjyra</th><th>Kurse</th><th></th></tr></thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td style={{ fontSize: 18 }}>{c.icon}</td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td><span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 4, background: c.color || '#ccc', verticalAlign: 'middle' }} /></td>
                  <td>{c.courses_count}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm" style={{ marginRight: 6 }} onClick={() => openEdit(c)}>Edito</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setToDelete(c)}>Fshi</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,23,20,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowForm(false)}>
          <div className="card" style={{ width: 400, padding: 24 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, marginBottom: 18 }}>{editing ? 'Edito Kategorinë' : 'Kategori e Re'}</h3>
            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Emri</label>
              <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Ikona (emoji)</label>
              <input className="input-field" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="🎯" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Ngjyra</label>
              <input className="input-field" type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ height: 40 }} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Anulo</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? <span className="spinner" /> : 'Ruaj'}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Fshi Kategorinë?"
        message={deleteError || `A je i sigurt që do të fshish "${toDelete?.name}"? Ky veprim nuk kthehet mbrapa.`}
        danger
        loading={deleting}
        confirmLabel="Fshi"
        onConfirm={confirmDelete}
        onCancel={() => { setToDelete(null); setDeleteError('') }}
      />
    </div>
  )
}
