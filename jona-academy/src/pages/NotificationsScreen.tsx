import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BellIcon, ChevronLeftIcon } from '../components/Icons'
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, type ApiNotification } from '../services/api'

function IkonaKurs({ lexuar }: { lexuar: boolean }) {
  const c = lexuar ? '#9CA3AF' : '#7A4F2D'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )
}

function IkonaCertifikatë({ lexuar }: { lexuar: boolean }) {
  const c = lexuar ? '#9CA3AF' : '#7A4F2D'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  )
}

const IkonatPerTip: Record<string, React.FC<{ lexuar: boolean }>> = {
  kurs: IkonaKurs,
  'certifikatë': IkonaCertifikatë,
}

const ngjyraPerTip: Record<string, string> = {
  kurs: 'rgba(122,79,45,0.1)',
  'certifikatë': 'rgba(245,158,11,0.1)',
}

function kohaMëParë(iso: string): string {
  const diffMs = Date.parse(iso + 'Z') - Date.now()
  const minuta = Math.round(-diffMs / 60000)
  if (minuta < 60) return `${Math.max(minuta, 0)} min më parë`
  const orë = Math.round(minuta / 60)
  if (orë < 24) return `${orë} orë më parë`
  const ditë = Math.round(orë / 24)
  return `${ditë} ditë më parë`
}

export default function NotificationsScreen() {
  const navigate = useNavigate()
  const [lista, setLista] = useState<ApiNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications().then(setLista).catch(console.error).finally(() => setLoading(false))
  }, [])

  const shënoTëGjitha = () => {
    setLista(l => l.map(n => ({ ...n, lexuar: 1 })))
    markAllNotificationsRead().catch(console.error)
  }
  const fshi = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLista(l => l.filter(n => n.id !== id))
    deleteNotification(id).catch(console.error)
  }
  const lexo = (id: number) => {
    setLista(l => l.map(n => n.id === id ? { ...n, lexuar: 1 } : n))
    markNotificationRead(id).catch(console.error)
  }
  const paLexuar = lista.filter(n => !n.lexuar).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', flexShrink: 0 }}
        >
          <ChevronLeftIcon size={18} strokeWidth={2} />
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>Njoftimet</h2>
        {paLexuar > 0 && (
          <button onClick={shënoTëGjitha} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
            Shëno të gjitha
          </button>
        )}
      </div>

      <div style={{ flex: 1, padding: '16px 20px' }}>

        {paLexuar > 0 && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>{paLexuar} njoftim të palexuar</p>
        )}

        {!loading && lista.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <BellIcon size={28} color="var(--text-muted)" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Nuk ka njoftime</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Do të njoftohesh kur ka lajme të reja</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lista.map(n => {
              const Ikona = IkonatPerTip[n.type]
              const lexuar = !!n.lexuar
              return (
                <div
                  key={n.id}
                  onClick={() => lexo(n.id)}
                  style={{ background: lexuar ? 'var(--bg-primary)' : 'rgba(122,79,45,0.05)', border: `1px solid ${lexuar ? 'var(--border)' : 'rgba(122,79,45,0.18)'}`, borderRadius: 'var(--radius-lg)', padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12, transition: 'all 0.15s', position: 'relative' }}
                >
                  {/* Ikona */}
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: lexuar ? 'var(--bg-secondary)' : ngjyraPerTip[n.type], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Ikona lexuar={lexuar} />
                  </div>

                  {/* Teksti */}
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <p style={{ fontSize: 14, fontWeight: lexuar ? 500 : 700, color: 'var(--text-primary)', margin: 0 }}>{n.titulli}</p>
                      {!lexuar && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, display: 'inline-block' }} />}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 5px', lineHeight: 1.4 }}>{n.mesazhi}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{kohaMëParë(n.created_at)}</p>
                  </div>

                  {/* Butoni fshi */}
                  <button
                    onClick={e => fshi(n.id, e)}
                    style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
