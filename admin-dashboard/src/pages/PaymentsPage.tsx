import { useEffect, useState } from 'react'
import { fetchPayments, type AdminPayment } from '../services/api'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' })
}

const STATUS_LABEL: Record<string, string> = { i_suksesshem: 'Sukses', deshtuar: 'Dështuar', ne_pritje: 'Në pritje' }

export default function PaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPayments().then(setPayments).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  const total = payments.filter(p => p.status === 'i_suksesshem').reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22 }}>Pagesat</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Total i arkëtuar: <strong style={{ color: 'var(--text-primary)' }}>€{total.toFixed(2)}</strong></p>
      </div>

      {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}

      <div className="card">
        {loading ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>Duke ngarkuar...</p>
        ) : payments.length === 0 ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>Ende s'ka pagesa.</p>
        ) : (
          <table>
            <thead><tr><th>Studenti</th><th>Përshkrimi</th><th>Shuma</th><th>Statusi</th><th>Data</th></tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>{p.student_name}<br /><span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{p.student_email}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.course_title || (p.subscription_id ? 'Abonim' : '—')}</td>
                  <td>€{Number(p.amount).toFixed(2)}</td>
                  <td>{p.status === 'i_suksesshem' ? <span className="badge badge-success">Sukses</span> : <span className="badge badge-danger">{STATUS_LABEL[p.status] || p.status}</span>}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{fmtDate(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
