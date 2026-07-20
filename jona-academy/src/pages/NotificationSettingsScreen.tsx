import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '../components/Icons'
import { fetchNotificationSettings, updateNotificationSettings, type NotificationSettings } from '../services/api'

const kategorite = [
  {
    id: 'new_courses' as const,
    titulli: 'Kurse të Reja',
    pershkrimi: 'Njoftim kur shtohen kurse të reja',
  },
  {
    id: 'certificates' as const,
    titulli: 'Certifikata',
    pershkrimi: 'Kur certifikata jote është gati',
  },
]

const defaultSettings: NotificationSettings = {
  new_courses: 1, lesson_reminders: 1, offers_promotions: 0, certificates: 1, messages: 1,
}

function Toggle({ aktiv, onChange, disabled }: { aktiv: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      style={{
        width: 48, height: 28, borderRadius: 14,
        background: aktiv ? 'var(--primary)' : 'var(--border)',
        border: 'none', cursor: disabled ? 'default' : 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: aktiv ? 23 : 3,
        width: 22, height: 22, borderRadius: '50%',
        background: 'white',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

export default function NotificationSettingsScreen() {
  const navigate = useNavigate()
  const [aktive, setAktive] = useState<NotificationSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNotificationSettings().then(setAktive).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  const ruaj = (te_reja: NotificationSettings) => {
    setAktive(te_reja)
    updateNotificationSettings(te_reja).catch(e => setError(e.message))
  }

  const ndrysho = (id: keyof NotificationSettings) => {
    ruaj({ ...aktive, [id]: aktive[id] ? 0 : 1 })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)',
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/profile')}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-primary)', flexShrink: 0,
          }}
        >
          <ChevronLeftIcon size={18} strokeWidth={2} />
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>Njoftimet</h2>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
          </div>
        )}

        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '14px 0 8px 4px' }}>
          LLOJET E NJOFTIMEVE
        </p>

        {/* Lista e kategorive */}
        <div style={{
          background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', overflow: 'hidden',
        }}>
          {kategorite.map((k, i) => (
            <div
              key={k.id}
              style={{
                padding: '15px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                borderBottom: i < kategorite.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                  {k.titulli}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                  {k.pershkrimi}
                </p>
              </div>
              <Toggle aktiv={!!aktive[k.id]} onChange={() => ndrysho(k.id)} disabled={loading} />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
