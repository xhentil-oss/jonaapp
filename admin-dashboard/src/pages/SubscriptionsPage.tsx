import { useEffect, useState } from 'react'
import { fetchSubscriptions, type AdminSubscription } from '../services/api'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' })
}

const STATUS_LABEL: Record<string, string> = { aktiv: 'Aktiv', anulluar: 'Anulluar', skaduar: 'Skaduar' }

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<AdminSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSubscriptions().then(setSubs).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Abonimet</h1>

      {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}

      <div className="card">
        {loading ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>Duke ngarkuar...</p>
        ) : subs.length === 0 ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>Ende s'ka abonime.</p>
        ) : (
          <table>
            <thead><tr><th>Studenti</th><th>Plani</th><th>Çmimi</th><th>Statusi</th><th>Filluar</th><th>Ripërtërihet</th></tr></thead>
            <tbody>
              {subs.map(s => (
                <tr key={s.id}>
                  <td>{s.student_name}<br /><span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s.student_email}</span></td>
                  <td>{s.plan_name}</td>
                  <td>€{Number(s.plan_price).toFixed(2)}</td>
                  <td>{s.status === 'aktiv' ? <span className="badge badge-success">Aktiv</span> : <span className="badge badge-muted">{STATUS_LABEL[s.status] || s.status}</span>}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{fmtDate(s.started_at)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.renews_at ? fmtDate(s.renews_at) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
