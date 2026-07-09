import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchStats, type AdminStats } from '../services/api'

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="card" style={{ padding: '18px 20px', flex: 1, minWidth: 180 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</p>
      </div>
      <p style={{ fontSize: 26, fontWeight: 800 }}>{value}</p>
    </div>
  )
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats().then(setStats).catch(e => setError(e.message))
  }, [])

  if (error) return <p style={{ color: 'var(--danger)' }}>{error}</p>
  if (!stats) return <p style={{ color: 'var(--text-muted)' }}>Duke ngarkuar...</p>

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Paneli</h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <StatCard label="Kurse" value={stats.totalCourses} icon="📚" />
        <StatCard label="Kategoritë" value={stats.totalCategories} icon="🏷️" />
        <StatCard label="Studentë" value={stats.totalStudents} icon="👥" />
        <StatCard label="Regjistrime" value={stats.totalEnrollments} icon="✅" />
        <StatCard label="Abonime aktive" value={stats.activeSubscriptions} icon="💳" />
        <StatCard label="Të ardhura totale" value={`€${Number(stats.totalRevenue).toFixed(2)}`} icon="💰" />
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: 320, padding: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Regjistrime të fundit</h3>
          {stats.recentEnrollments.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Ende s'ka regjistrime.</p>
          ) : (
            <table>
              <tbody>
                {stats.recentEnrollments.map(e => (
                  <tr key={e.id}>
                    <td>{e.student_name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{e.course_title}</td>
                    <td style={{ color: 'var(--text-muted)', textAlign: 'right' }}>{fmtDate(e.enrolled_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ flex: 1, minWidth: 320, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15 }}>Studentë të rinj</h3>
            <Link to="/users" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>Shiko të gjithë</Link>
          </div>
          {stats.recentUsers.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Ende s'ka studentë.</p>
          ) : (
            <table>
              <tbody>
                {stats.recentUsers.map(u => (
                  <tr key={u.id}>
                    <td>{u.full_name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ color: 'var(--text-muted)', textAlign: 'right' }}>{fmtDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
