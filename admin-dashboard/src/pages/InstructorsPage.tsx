import { useEffect, useState } from 'react'
import ConfirmModal from '../components/ConfirmModal'
import { fetchInstructors, createInstructor, updateInstructor, deleteInstructor, uploadImage, type Instructor } from '../services/api'

const emptyForm = { full_name: '', bio: '', avatar_url: '' }

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Instructor | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toDelete, setToDelete] = useState<Instructor | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const load = () => {
    setLoading(true)
    fetchInstructors().then(setInstructors).catch(e => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (i: Instructor) => { setEditing(i); setForm({ full_name: i.full_name, bio: i.bio || '', avatar_url: i.avatar_url || '' }); setShowForm(true) }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const { url } = await uploadImage(file)
      setForm(f => ({ ...f, avatar_url: url }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gabim ngarkimi')
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    if (!form.full_name.trim()) return
    setSaving(true)
    try {
      if (editing) await updateInstructor(editing.id, form)
      else await createInstructor(form)
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
      await deleteInstructor(toDelete.id)
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
        <h1 style={{ fontSize: 22 }}>Instruktorët</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Instruktor i ri</button>
      </div>

      {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}

      <div className="card">
        {loading ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>Duke ngarkuar...</p>
        ) : (
          <table>
            <thead><tr><th>Foto</th><th>Emri</th><th>Bio</th><th>Kurse</th><th></th></tr></thead>
            <tbody>
              {instructors.map(i => (
                <tr key={i.id}>
                  <td>
                    {i.avatar_url
                      ? <img src={i.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                      : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border)' }} />}
                  </td>
                  <td style={{ fontWeight: 600 }}>{i.full_name}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.bio}</td>
                  <td>{i.courses_count}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm" style={{ marginRight: 6 }} onClick={() => openEdit(i)}>Edito</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setToDelete(i)}>Fshi</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,23,20,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowForm(false)}>
          <div className="card" style={{ width: 440, padding: 24 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, marginBottom: 18 }}>{editing ? 'Edito Instruktorin' : 'Instruktor i Ri'}</h3>
            <div style={{ display: 'flex', gap: 16, marginBottom: 14, alignItems: 'center' }}>
              {form.avatar_url
                ? <img src={form.avatar_url} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
                : <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--border)' }} />}
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                {uploading ? <span className="spinner" /> : 'Ngarko foto'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              </label>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Emri</label>
              <input className="input-field" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Bio</label>
              <textarea className="input-field" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
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
        title="Fshi Instruktorin?"
        message={deleteError || `A je i sigurt që do të fshish "${toDelete?.full_name}"? Ky veprim nuk kthehet mbrapa.`}
        danger
        loading={deleting}
        confirmLabel="Fshi"
        onConfirm={confirmDelete}
        onCancel={() => { setToDelete(null); setDeleteError('') }}
      />
    </div>
  )
}
