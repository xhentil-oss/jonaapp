import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '../components/Icons'

const opsionet = [
  { vlera: 'wifi', etiketa: 'Vetëm Wi-Fi', pershkrimi: 'Shkarko vetëm kur je i lidhur me Wi-Fi' },
  { vlera: 'te-dyja', etiketa: 'Wi-Fi dhe Celular', pershkrimi: 'Shkarko me çdo lidhje interneti' },
  { vlera: 'jo', etiketa: 'Çaktivizo Shkarkimet', pershkrimi: 'Mos shkarko asnjë material' },
]

export default function DownloadsScreen() {
  const navigate = useNavigate()
  const [zgjedhja, setZgjedhja] = useState('wifi')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeftIcon size={18} strokeWidth={2} />
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Shkarkimet</h2>
      </div>

      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          Zgjidhni kur të lejohen shkarkimet e materialeve të kursit.
        </p>

        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          {opsionet.map((opsioni, i) => (
            <button
              key={opsioni.vlera}
              onClick={() => setZgjedhja(opsioni.vlera)}
              style={{ width: '100%', padding: '16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderBottom: i < opsionet.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <div style={{ textAlign: 'left', flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>{opsioni.etiketa}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{opsioni.pershkrimi}</p>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${zgjedhja === opsioni.vlera ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {zgjedhja === opsioni.vlera && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
