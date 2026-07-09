import { useEffect, useState } from 'react'
import ConfirmModal from '../components/ConfirmModal'
import { fetchCertificates, revokeCertificate, type AdminCertificate } from '../services/api'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<AdminCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toRevoke, setToRevoke] = useState<AdminCertificate | null>(null)
  const [revoking, setRevoking] = useState(false)

  const load = () => {
    setLoading(true)
    fetchCertificates().then(setCerts).catch(e => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const confirmRevoke = async () => {
    if (!toRevoke) return
    setRevoking(true)
    try {
      await revokeCertificate(toRevoke.id)
      setToRevoke(null)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gabim')
    } finally {
      setRevoking(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Certifikatat</h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
        Certifikatat lëshohen automatikisht kur një student përfundon 100% të një kursi, ose manualisht nga faqja e detajeve të përdoruesit.
      </p>

      {error && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}

      <div className="card">
        {loading ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>Duke ngarkuar...</p>
        ) : certs.length === 0 ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>Ende s'ka certifikata.</p>
        ) : (
          <table>
            <thead><tr><th>Kodi</th><th>Studenti</th><th>Kursi</th><th>Lëshuar</th><th></th></tr></thead>
            <tbody>
              {certs.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.certificate_code}</td>
                  <td>{c.student_name}<br /><span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{c.student_email}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.course_title}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{fmtDate(c.issued_at)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => setToRevoke(c)}>Anulo</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        open={!!toRevoke}
        title="Anulo Certifikatën?"
        message={`A je i sigurt që do të anulosh certifikatën "${toRevoke?.certificate_code}" për ${toRevoke?.student_name}?`}
        danger loading={revoking} confirmLabel="Anulo Certifikatën"
        onConfirm={confirmRevoke}
        onCancel={() => setToRevoke(null)}
      />
    </div>
  )
}
