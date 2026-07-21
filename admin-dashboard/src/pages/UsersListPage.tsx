import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import { fetchUsers, deleteUser, type AdminUserListItem } from '../services/api'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function UsersListPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<AdminUserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [userToDelete, setUserToDelete] = useState<AdminUserListItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    fetchUsers(search || undefined).then(setUsers).catch(e => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleDelete = async () => {
    if (!userToDelete) return
    setDeleting(true)
    setError('')
    try {
      await deleteUser(userToDelete.id)
      setUsers(prev => prev.filter(x => x.id !== userToDelete.id))
      setUserToDelete(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ndodhi një gabim')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Përdoruesit</h1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          className="input-field" style={{ maxWidth: 280 }} placeholder="Kërko sipas emrit ose email-it..."
          value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
        />
        <button className="btn btn-secondary" onClick={load}>Kërko</button>
      </div>

      {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}

      <div className="card">
        {loading ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>Duke ngarkuar...</p>
        ) : users.length === 0 ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>Asnjë përdorues nuk u gjet.</p>
        ) : (
          <table>
            <thead><tr><th>Emri</th><th>Email</th><th>Kurse</th><th>Certifikata</th><th>Abonim</th><th>Regjistruar</th><th></th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>{u.enrollments_count}</td>
                  <td>{u.certificates_count}</td>
                  <td>{u.has_active_subscription ? <span className="badge badge-success">Aktiv</span> : <span className="badge badge-muted">—</span>}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{fmtDate(u.created_at)}</td>
                  <td style={{ textAlign: 'right', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/users/${u.id}`)}>Shiko</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setUserToDelete(u)}>Fshi</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        open={userToDelete != null}
        title="Fshi Përdoruesin?"
        message={userToDelete ? `Të fshihet "${userToDelete.full_name}" (${userToDelete.email})? Kjo do të fshijë edhe regjistrimet, certifikatat dhe pagesat e tij. Ky veprim nuk kthehet mbrapsht.` : ''}
        confirmLabel="Fshi"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  )
}
