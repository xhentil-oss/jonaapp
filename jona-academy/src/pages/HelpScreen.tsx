import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '../components/Icons'

const pyetjet = [
  {
    id: 1,
    pyetja: 'Si mund të blej një kurs?',
    pergjigjja: 'Shko tek kursi që dëshiron, shtyp "Blej" dhe ndiq hapat e pagesës. Mund të paguash me kartë krediti ose debi.',
  },
  {
    id: 2,
    pyetja: 'Si funksionon abonimi?',
    pergjigjja: 'Abonimi të jep qasje të plotë në të gjitha kurset e platformës. Rinovohet automatikisht çdo vit. Mund ta anulosh në çdo kohë nga profili yt.',
  },
  {
    id: 3,
    pyetja: 'A mund të shkarkoj mësimet offline?',
    pergjigjja: 'Po, mësimet premium mund të shkarkohen për t\'i parë offline. Shko tek mësimi dhe shtyp ikonën e shkarkimit.',
  },
  {
    id: 4,
    pyetja: 'Si marr certifikatën?',
    pergjigjja: 'Pasi të përfundosh të gjitha mësimet e kursit, certifikata gjenerohet automatikisht dhe është e disponueshme tek "Certifikatat" në profilin tënd.',
  },
  {
    id: 5,
    pyetja: 'Si ndryshoj fjalëkalimin?',
    pergjigjja: 'Shko tek Profili → Cilësimet → Ndrysho Fjalëkalimin. Do të të dërgohet një kod konfirmimi në emailin tënd.',
  },
  {
    id: 6,
    pyetja: 'Çfarë bëj nëse video nuk luan?',
    pergjigjja: 'Kontrollo lidhjen me internetin. Nëse problemi vazhdon, provo të rifrezkosh faqen ose kontakto mbështetjen tonë.',
  },
]

const kontaktet = [
  {
    ikona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    titulli: 'Email',
    vlera: 'support@jonakademy.al',
    ngjyra: 'rgba(122,79,45,0.1)',
    ngjyraIkones: 'var(--primary)',
  },
  {
    ikona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.23h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    titulli: 'WhatsApp',
    vlera: '+355 69 000 0000',
    ngjyra: 'rgba(16,185,129,0.1)',
    ngjyraIkones: '#10B981',
  },
  {
    ikona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2H3v16h5l3 3 3-3h7V2z"/>
        <line x1="9" y1="9" x2="15" y2="9"/>
        <line x1="9" y1="13" x2="12" y2="13"/>
      </svg>
    ),
    titulli: 'Chat Live',
    vlera: 'E hënë – E premte, 9:00–17:00',
    ngjyra: 'rgba(99,102,241,0.1)',
    ngjyraIkones: '#6366F1',
  },
]

export default function HelpScreen() {
  const navigate = useNavigate()
  const [hapur, setHapur] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>

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
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>Ndihma & Mbështetja</h2>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>

        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #A0653A 100%)',
          borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: '0 0 3px' }}>Si mund të ndihmojmë?</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Gjej përgjigje ose na kontakto direkt</p>
          </div>
        </div>

        {/* Pyetjet e shpeshta */}
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: 0.5 }}>
          PYETJET MË TË SHPESHTA
        </p>

        <div style={{
          background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 24,
        }}>
          {pyetjet.map((p, i) => (
            <div key={p.id}>
              <button
                onClick={() => setHapur(hapur === p.id ? null : p.id)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '15px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  borderBottom: hapur === p.id ? '1px solid var(--border)' : i < pyetjet.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'left' }}>
                  {p.pyetja}
                </span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transform: hapur === p.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {hapur === p.id && (
                <div style={{ padding: '12px 18px 15px', background: 'var(--bg-secondary)' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {p.pergjigjja}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Kontakto */}
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: 0.5 }}>
          NA KONTAKTO
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {kontaktet.map((k, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: k.ngjyra,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: k.ngjyraIkones,
              }}>
                {k.ikona}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{k.titulli}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{k.vlera}</p>
              </div>
              <ChevronRightIcon size={16} color="var(--text-muted)" />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
