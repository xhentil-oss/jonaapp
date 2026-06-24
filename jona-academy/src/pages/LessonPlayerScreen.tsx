import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const mesimiData = {
  id: 1,
  titulli: 'Çfarë janë limitet njerëzore?',
  kohezgjatja: '12:00',
  kursiTitulli: 'Trajnimi "PËRTEJ LIMITEVE NJERËZOR"',
  pershkrimi: 'Në këtë mësim, eksplorojmë konceptin fundamental të limiteve njerëzore dhe pse ato përcaktojnë trajektoren e jetës suaj. Do të mësoni dallimin midis mentalitetit të fiksuar dhe atij të rritjes.',
  shenimet: [
    'Limitet janë koleksioni i besimeve që formojnë mënyrën si e shihni veten dhe botën.',
    'Mentalitet i fiksuar: aftësitë janë të lindura dhe të pandryshueshme.',
    'Mentalitet i rritjes: aftësitë mund të zhvillohen nëpërmjet përkushtimit.',
    'Mentaliteti juaj ndikon në mënyrën si reagoni ndaj sfidave dhe suksesit.',
  ],
  mesimitjetër: { id: 2, titulli: 'Si funksionon truri ynë' },
}

export default function LessonPlayerScreen() {
  const navigate = useNavigate()
  const mesimi = mesimiData
  const [duke_luajtur, setDukeLuajtur] = useState(false)
  const [tabAktiv, setTabAktiv] = useState<'permbledhje' | 'shenime'>('permbledhje')
  const [progresi, setProgresi] = useState(35)

  return (
    <div style={{ minHeight: '100vh', background: '#1C1714', display: 'flex', flexDirection: 'column' }}>
      {/* Zona e videос */}
      <div style={{ background: '#1C1714', aspectRatio: '16/9', maxHeight: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 12, left: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'white' }}>←</button>
        <button onClick={() => setDukeLuajtur(p => !p)} style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'white' }}>
          {duke_luajtur ? '⏸' : '▶'}
        </button>
        <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '4px 8px', fontSize: 12, color: 'white' }}>{mesimi.kohezgjatja}</div>
      </div>

      {/* Përmbajtja */}
      <div style={{ flex: 1, background: 'var(--bg-primary)', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -8 }}>
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Progresi i mësimit</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{progresi}%</p>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progresi}%` }} /></div>
        </div>

        <div style={{ padding: '14px 20px 0' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{mesimi.kursiTitulli}</p>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>{mesimi.titulli}</h2>
        </div>

        <div style={{ display: 'flex', padding: '0 20px', marginTop: 14, borderBottom: '1px solid var(--border)' }}>
          {(['permbledhje', 'shenime'] as const).map(tab => (
            <button key={tab} onClick={() => setTabAktiv(tab)} style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: tabAktiv === tab ? 'var(--primary)' : 'var(--text-muted)', borderBottom: tabAktiv === tab ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -1, transition: 'all 0.2s' }}>
              {tab === 'permbledhje' ? 'Përmbledhje' : 'Shënime'}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px' }}>
          {tabAktiv === 'permbledhje' ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>{mesimi.pershkrimi}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mesimi.shenimet.map((shen, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(122,79,45,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{shen}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '0 20px 32px', display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} disabled>← Mësimine parë</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setProgresi(100); navigate(`/lesson/2`) }}>
            {mesimi.mesimitjetër ? 'Tjetër →' : 'Përfundo ✓'}
          </button>
        </div>
      </div>
    </div>
  )
}
