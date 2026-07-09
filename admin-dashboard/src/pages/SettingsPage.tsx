import { useAuth } from '../context/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Cilësimet</h1>

      <div className="card" style={{ padding: 20, maxWidth: 480 }}>
        <h3 style={{ fontSize: 15, marginBottom: 14 }}>Llogaria Ime</h3>
        <div style={{ marginBottom: 10 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Emri</p>
          <p style={{ fontWeight: 600 }}>{user?.full_name}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Email</p>
          <p style={{ fontWeight: 600 }}>{user?.email}</p>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 20 }}>
        Cilësime të tjera (njoftime, integrime pagese, etj.) do të shtohen këtu më vonë.
      </p>
    </div>
  )
}
