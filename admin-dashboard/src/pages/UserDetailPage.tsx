import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import { fetchUser, issueCertificate, type AdminUserDetail } from '../services/api'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmCourseId, setConfirmCourseId] = useState<number | null>(null)
  const [issuing, setIssuing] = useState(false)

  const load = () => {
    if (!id) return
    setLoading(true)
    fetchUser(Number(id)).then(setUser).catch(e => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [id])

  const handleIssue = async () => {
    if (!user || confirmCourseId == null) return
    setIssuing(true)
    try {
      await issueCertificate(user.id, confirmCourseId)
      setConfirmCourseId(null)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gabim')
    } finally {
      setIssuing(false)
    }
  }

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Duke ngarkuar...</p>
  if (error || !user) return <p style={{ color: 'var(--danger)' }}>{error || 'Përdoruesi nuk u gjet'}</p>

  const certifiedCourseIds = new Set(user.certificates.map(c => c.course_id))
  const completedWithoutCert = user.enrollments.filter(e => e.status === 'perfunduar' && !certifiedCourseIds.has(e.course_id))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/users')}>← Kthehu</button>
        <h1 style={{ fontSize: 22 }}>{user.full_name}</h1>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 40 }}>
          <div><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Email</p><p style={{ fontWeight: 600 }}>{user.email}</p></div>
          <div><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Anëtarësia</p><p style={{ fontWeight: 600 }}>{user.membership_type}</p></div>
          <div><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Regjistruar</p><p style={{ fontWeight: 600 }}>{fmtDate(user.created_at)}</p></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Kurset e Regjistruara ({user.enrollments.length})</h3>
          {user.enrollments.length === 0 ? <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Asnjë.</p> : (
            <table>
              <tbody>
                {user.enrollments.map(e => (
                  <tr key={e.id}>
                    <td>{e.course_title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{Number(e.progress_percent).toFixed(0)}%</td>
                    <td>{e.status === 'perfunduar' ? <span className="badge badge-success">Përfunduar</span> : <span className="badge">Aktiv</span>}</td>
                    <td style={{ textAlign: 'right' }}>
                      {e.status === 'perfunduar' && !certifiedCourseIds.has(e.course_id) && (
                        <button className="btn btn-secondary btn-sm" onClick={() => setConfirmCourseId(e.course_id)}>Lësho Certifikatë</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Certifikatat ({user.certificates.length})</h3>
          {user.certificates.length === 0 ? <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Asnjë.</p> : (
            <table>
              <tbody>
                {user.certificates.map(c => (
                  <tr key={c.id}>
                    <td>{c.course_title}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{c.certificate_code}</td>
                    <td style={{ color: 'var(--text-muted)', textAlign: 'right' }}>{fmtDate(c.issued_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Abonimet ({user.subscriptions.length})</h3>
          {user.subscriptions.length === 0 ? <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Asnjë.</p> : (
            <table>
              <tbody>
                {user.subscriptions.map(s => (
                  <tr key={s.id}>
                    <td>{s.plan_name}</td>
                    <td>{s.status === 'aktiv' ? <span className="badge badge-success">Aktiv</span> : <span className="badge badge-muted">{s.status}</span>}</td>
                    <td style={{ color: 'var(--text-muted)', textAlign: 'right' }}>{fmtDate(s.started_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Pagesat ({user.payments.length})</h3>
          {user.payments.length === 0 ? <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Asnjë.</p> : (
            <table>
              <tbody>
                {user.payments.map(p => (
                  <tr key={p.id}>
                    <td>€{Number(p.amount).toFixed(2)}</td>
                    <td>{p.status === 'i_suksesshem' ? <span className="badge badge-success">Sukses</span> : <span className="badge badge-muted">{p.status}</span>}</td>
                    <td style={{ color: 'var(--text-muted)', textAlign: 'right' }}>{fmtDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {completedWithoutCert.length > 0 && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
          {completedWithoutCert.length} kurs(e) të përfunduara pa certifikatë ende.
        </p>
      )}

      <ConfirmModal
        open={confirmCourseId != null}
        title="Lësho Certifikatë?"
        message="Do të krijohet një certifikatë e re për këtë student dhe kurs."
        confirmLabel="Lësho"
        loading={issuing}
        onConfirm={handleIssue}
        onCancel={() => setConfirmCourseId(null)}
      />
    </div>
  )
}
