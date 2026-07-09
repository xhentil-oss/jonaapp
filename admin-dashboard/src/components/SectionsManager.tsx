import { useState } from 'react'
import ConfirmModal from './ConfirmModal'
import {
  createSection, updateSection, deleteSection,
  createLesson, updateLesson, deleteLesson,
  type AdminSection, type AdminLesson,
} from '../services/api'

function fmtDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

interface LessonFormState {
  sectionId: number
  lesson: AdminLesson | null
  title: string
  video_url: string
  duration_seconds: number
  is_free: boolean
  order_index: number
}

export default function SectionsManager({ courseId, sections, onRefresh }: { courseId: number; sections: AdminSection[]; onRefresh: () => void }) {
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [addingSection, setAddingSection] = useState(false)
  const [editingSection, setEditingSection] = useState<{ id: number; title: string } | null>(null)
  const [sectionToDelete, setSectionToDelete] = useState<AdminSection | null>(null)
  const [lessonToDelete, setLessonToDelete] = useState<AdminLesson | null>(null)
  const [lessonForm, setLessonForm] = useState<LessonFormState | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const addSection = async () => {
    if (!newSectionTitle.trim()) return
    setBusy(true)
    try {
      await createSection(courseId, { title: newSectionTitle.trim(), order_index: sections.length + 1 })
      setNewSectionTitle('')
      setAddingSection(false)
      onRefresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gabim')
    } finally {
      setBusy(false)
    }
  }

  const saveSectionTitle = async () => {
    if (!editingSection) return
    setBusy(true)
    try {
      await updateSection(editingSection.id, { title: editingSection.title })
      setEditingSection(null)
      onRefresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gabim')
    } finally {
      setBusy(false)
    }
  }

  const confirmDeleteSection = async () => {
    if (!sectionToDelete) return
    setBusy(true)
    try {
      await deleteSection(sectionToDelete.id)
      setSectionToDelete(null)
      onRefresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gabim')
    } finally {
      setBusy(false)
    }
  }

  const openNewLesson = (sectionId: number, order: number) => setLessonForm({
    sectionId, lesson: null, title: '', video_url: '', duration_seconds: 0, is_free: false, order_index: order,
  })
  const openEditLesson = (l: AdminLesson) => setLessonForm({
    sectionId: l.section_id, lesson: l, title: l.title, video_url: l.video_url || '',
    duration_seconds: l.duration_seconds, is_free: !!l.is_free, order_index: l.order_index,
  })

  const saveLesson = async () => {
    if (!lessonForm || !lessonForm.title.trim()) return
    setBusy(true)
    try {
      const data = {
        title: lessonForm.title.trim(),
        video_url: lessonForm.video_url.trim() || undefined,
        duration_seconds: lessonForm.duration_seconds,
        is_free: lessonForm.is_free,
        order_index: lessonForm.order_index,
      }
      if (lessonForm.lesson) await updateLesson(lessonForm.lesson.id, data)
      else await createLesson(lessonForm.sectionId, data)
      setLessonForm(null)
      onRefresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gabim')
    } finally {
      setBusy(false)
    }
  }

  const confirmDeleteLesson = async () => {
    if (!lessonToDelete) return
    setBusy(true)
    try {
      await deleteLesson(lessonToDelete.id)
      setLessonToDelete(null)
      onRefresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gabim')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}

      {sections.map(section => (
        <div key={section.id} className="card" style={{ marginBottom: 14, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            {editingSection?.id === section.id ? (
              <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                <input
                  className="input-field" value={editingSection.title}
                  onChange={e => setEditingSection({ id: section.id, title: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && saveSectionTitle()}
                  autoFocus
                />
                <button className="btn btn-primary btn-sm" onClick={saveSectionTitle} disabled={busy}>Ruaj</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditingSection(null)}>Anulo</button>
              </div>
            ) : (
              <>
                <h4 style={{ fontSize: 15, cursor: 'pointer' }} onClick={() => setEditingSection({ id: section.id, title: section.title })}>
                  {section.title} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 12 }}>({section.lessons.length} mësime)</span>
                </h4>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openNewLesson(section.id, section.lessons.length + 1)}>+ Mësim</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setSectionToDelete(section)}>Fshi Seksionin</button>
                </div>
              </>
            )}
          </div>

          {section.lessons.length > 0 && (
            <table>
              <tbody>
                {section.lessons.map(l => (
                  <tr key={l.id}>
                    <td style={{ width: 24, color: 'var(--text-muted)' }}>{l.order_index}</td>
                    <td>{l.title}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{fmtDuration(l.duration_seconds)}</td>
                    <td>{l.is_free ? <span className="badge badge-success">Falas</span> : null}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button className="btn btn-secondary btn-sm" style={{ marginRight: 6 }} onClick={() => openEditLesson(l)}>Edito</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setLessonToDelete(l)}>Fshi</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}

      {addingSection ? (
        <div className="card" style={{ padding: 16, display: 'flex', gap: 8 }}>
          <input
            className="input-field" placeholder="Titulli i seksionit" value={newSectionTitle}
            onChange={e => setNewSectionTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSection()}
            autoFocus
          />
          <button className="btn btn-primary btn-sm" onClick={addSection} disabled={busy}>Shto</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setAddingSection(false)}>Anulo</button>
        </div>
      ) : (
        <button className="btn btn-secondary" onClick={() => setAddingSection(true)}>+ Seksion i ri</button>
      )}

      {lessonForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,23,20,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setLessonForm(null)}>
          <div className="card" style={{ width: 440, padding: 24 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, marginBottom: 18 }}>{lessonForm.lesson ? 'Edito Mësimin' : 'Mësim i Ri'}</h3>
            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Titulli</label>
              <input className="input-field" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Google Drive ID (video_url)</label>
              <input className="input-field" value={lessonForm.video_url} onChange={e => setLessonForm({ ...lessonForm, video_url: e.target.value })} placeholder="1UK1uft7JX2jbc1qhcpgytM4NT27ht_Ku" />
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label className="input-label">Kohëzgjatja (sekonda)</label>
                <input className="input-field" type="number" value={lessonForm.duration_seconds} onChange={e => setLessonForm({ ...lessonForm, duration_seconds: Number(e.target.value) })} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="input-label">Radha</label>
                <input className="input-field" type="number" value={lessonForm.order_index} onChange={e => setLessonForm({ ...lessonForm, order_index: Number(e.target.value) })} />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 14 }}>
              <input type="checkbox" checked={lessonForm.is_free} onChange={e => setLessonForm({ ...lessonForm, is_free: e.target.checked })} />
              Mësim falas (parapamje)
            </label>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setLessonForm(null)}>Anulo</button>
              <button className="btn btn-primary" onClick={saveLesson} disabled={busy}>{busy ? <span className="spinner" /> : 'Ruaj'}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!sectionToDelete}
        title="Fshi Seksionin?"
        message={`A je i sigurt që do të fshish "${sectionToDelete?.title}"? Të gjitha mësimet brenda tij do të fshihen.`}
        danger loading={busy} confirmLabel="Fshi"
        onConfirm={confirmDeleteSection}
        onCancel={() => setSectionToDelete(null)}
      />
      <ConfirmModal
        open={!!lessonToDelete}
        title="Fshi Mësimin?"
        message={`A je i sigurt që do të fshish "${lessonToDelete?.title}"?`}
        danger loading={busy} confirmLabel="Fshi"
        onConfirm={confirmDeleteLesson}
        onCancel={() => setLessonToDelete(null)}
      />
    </div>
  )
}
