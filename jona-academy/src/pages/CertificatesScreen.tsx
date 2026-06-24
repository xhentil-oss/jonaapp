import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import { certificates } from '../data/mockData'

export default function CertificatesScreen() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: 'var(--nav-height)' }}>
      <Header title="Certifikatat e Mia" />
      <div style={{ padding: '20px' }}>
        {certificates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 52, marginBottom: 16 }}>🏆</p>
            <h3 style={{ marginBottom: 8, color: 'var(--text-primary)' }}>Nuk ka certifikata ende</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Përfundo një kurs për të fituar certifikatën tënde të parë</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {certificates.map(cert => (
              <div key={cert.id} style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                {/* Paraqitja e certifikatës */}
                <div style={{ background: 'linear-gradient(135deg, #2D1B0E, #1A2D1A)', padding: '28px 24px', textAlign: 'center', position: 'relative', borderBottom: '1px solid var(--border)' }}>
                  {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
                    <div key={pos} style={{ position: 'absolute', top: pos.includes('top') ? 10 : undefined, bottom: pos.includes('bottom') ? 10 : undefined, left: pos.includes('left') ? 10 : undefined, right: pos.includes('right') ? 10 : undefined, width: 20, height: 20, borderTop: pos.includes('top') ? '2px solid rgba(122,79,45,0.4)' : 'none', borderBottom: pos.includes('bottom') ? '2px solid rgba(122,79,45,0.4)' : 'none', borderLeft: pos.includes('left') ? '2px solid rgba(122,79,45,0.4)' : 'none', borderRight: pos.includes('right') ? '2px solid rgba(122,79,45,0.4)' : 'none' }} />
                  ))}
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>Certifikatë Përfundimi</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>Kjo certifikon se</p>
                  <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, color: 'white' }}>Emanuela</h2>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>ka përfunduar me sukses</p>
                  <h3 style={{ fontSize: 15, color: '#C4956A', marginBottom: 12, lineHeight: 1.4 }}>{cert.courseTitle}</h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{cert.completedAt}</p>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>ID e Certifikatës</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{cert.code}</p>
                    </div>
                    <div style={{ fontSize: 28 }}>◈</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Shpërnda</button>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Shkarko PDF</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
