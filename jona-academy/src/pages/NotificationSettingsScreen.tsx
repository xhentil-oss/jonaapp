import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '../components/Icons'

const kategorite = [
  {
    id: 'kurse',
    titulli: 'Kurse të Reja',
    pershkrimi: 'Njoftim kur shtohen kurse të reja',
  },
  {
    id: 'kujtues',
    titulli: 'Kujtues Mësimi',
    pershkrimi: 'Të kujtojmë të vazhdosh mësimet',
  },
  {
    id: 'oferta',
    titulli: 'Oferta & Promocione',
    pershkrimi: 'Zbritje dhe oferta të veçanta',
  },
  {
    id: 'certifikata',
    titulli: 'Certifikata',
    pershkrimi: 'Kur certifikata jote është gati',
  },
  {
    id: 'mesazhe',
    titulli: 'Mesazhe',
    pershkrimi: 'Mesazhe nga instruktorët',
  },
]

function Toggle({ aktiv, onChange }: { aktiv: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 48, height: 28, borderRadius: 14,
        background: aktiv ? 'var(--primary)' : 'var(--border)',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
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
  const [gjithçka, setGjithçka] = useState(true)
  const [aktive, setAktive] = useState<Record<string, boolean>>({
    kurse: true,
    kujtues: true,
    oferta: false,
    certifikata: true,
    mesazhe: true,
  })

  const ndryshoGjithçka = () => {
    const vlera = !gjithçka
    setGjithçka(vlera)
    const te_gjitha: Record<string, boolean> = {}
    kategorite.forEach(k => { te_gjitha[k.id] = vlera })
    setAktive(te_gjitha)
  }

  const ndrysho = (id: string) => {
    const te_reja = { ...aktive, [id]: !aktive[id] }
    setAktive(te_reja)
    setGjithçka(Object.values(te_reja).every(Boolean))
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

        {/* Toggle i përgjithshëm */}
        <div style={{
          background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', padding: '16px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 8,
        }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>
              Të gjitha njoftimet
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              Hap ose mbyll të gjitha
            </p>
          </div>
          <Toggle aktiv={gjithçka} onChange={ndryshoGjithçka} />
        </div>

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
              <Toggle aktiv={aktive[k.id]} onChange={() => ndrysho(k.id)} />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
