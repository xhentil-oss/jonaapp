import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'
import { certificates } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

function shpërnda(cert: { code: string; courseTitle: string }) {
  const teksti = `Kam përfunduar me sukses kursin "${cert.courseTitle}" në Jona Academy! 🎓 ID: ${cert.code}`
  if (navigator.share) {
    navigator.share({ title: 'Certifikatë Jona Academy', text: teksti })
  } else {
    navigator.clipboard?.writeText(teksti)
  }
}

function shkarkoPDF(emri: string, cert: { code: string; courseTitle: string; completedAt: string }) {
  const certHTML = `
    <div style="width:260mm;min-height:170mm;background:linear-gradient(135deg,#2D1B0E,#1A2D1A);border:2px solid rgba(196,149,106,0.35);border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;text-align:center;">
      <div style="position:absolute;top:14px;left:14px;width:24px;height:24px;border-top:2px solid rgba(196,149,106,0.5);border-left:2px solid rgba(196,149,106,0.5);"></div>
      <div style="position:absolute;top:14px;right:14px;width:24px;height:24px;border-top:2px solid rgba(196,149,106,0.5);border-right:2px solid rgba(196,149,106,0.5);"></div>
      <div style="position:absolute;bottom:14px;left:14px;width:24px;height:24px;border-bottom:2px solid rgba(196,149,106,0.5);border-left:2px solid rgba(196,149,106,0.5);"></div>
      <div style="position:absolute;bottom:14px;right:14px;width:24px;height:24px;border-bottom:2px solid rgba(196,149,106,0.5);border-right:2px solid rgba(196,149,106,0.5);"></div>
      <p style="font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;font-family:Arial,sans-serif;">Certifikatë Përfundimi</p>
      <p style="font-size:12px;color:rgba(255,255,255,0.45);margin-bottom:14px;font-family:Arial,sans-serif;">Kjo certifikon se</p>
      <h1 style="font-size:36px;font-weight:bold;color:white;margin-bottom:8px;font-family:Georgia,serif;">${emri}</h1>
      <p style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:16px;font-family:Arial,sans-serif;">ka përfunduar me sukses</p>
      <div style="width:60px;height:1px;background:rgba(196,149,106,0.3);margin:0 auto 16px;"></div>
      <h2 style="font-size:18px;color:#C4956A;margin-bottom:18px;line-height:1.4;font-family:Georgia,serif;">${cert.courseTitle}</h2>
      <p style="font-size:12px;color:rgba(255,255,255,0.35);margin-bottom:8px;font-family:Arial,sans-serif;">${cert.completedAt}</p>
      <p style="font-size:11px;color:rgba(255,255,255,0.22);font-family:monospace;letter-spacing:1px;">${cert.code}</p>
    </div>`

  const printStyle = document.createElement('style')
  printStyle.id = '__cert_print_style__'
  printStyle.innerHTML = `
    @media print {
      @page { size: A4 landscape; margin: 10mm; }
      body > *:not(#__cert_print__) { display: none !important; }
      #__cert_print__ { display: flex !important; align-items: center; justify-content: center; min-height: 100vh; background: #1A1109; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    #__cert_print__ { display: none; }`

  const printDiv = document.createElement('div')
  printDiv.id = '__cert_print__'
  printDiv.innerHTML = certHTML

  document.head.appendChild(printStyle)
  document.body.appendChild(printDiv)

  window.print()

  setTimeout(() => {
    document.head.removeChild(printStyle)
    document.body.removeChild(printDiv)
  }, 500)
}

export default function CertificatesScreen() {
  const { profile, user } = useAuth()
  const emri = profile?.emri || user?.displayName || 'Përdorues'
  const [kopjuar, setKopjuar] = useState<number | null>(null)

  const handleShpërnda = (cert: typeof certificates[0]) => {
    const teksti = `Kam përfunduar me sukses kursin "${cert.courseTitle}" në Jona Academy! 🎓 ID: ${cert.code}`
    if (navigator.share) {
      navigator.share({ title: 'Certifikatë Jona Academy', text: teksti })
    } else {
      navigator.clipboard?.writeText(teksti).then(() => {
        setKopjuar(cert.id)
        setTimeout(() => setKopjuar(null), 2000)
      })
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: 'var(--nav-height)' }}>
      <Header title="Certifikatat e Mia" />
      <div style={{ padding: '20px' }}>
        {certificates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
            </div>
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
                  <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, color: 'white' }}>{emri}</h2>
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
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      onClick={() => handleShpërnda(cert)}
                    >
                      {kopjuar === cert.id ? (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          U kopjua
                        </>
                      ) : (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                          Shpërnda
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      onClick={() => shkarkoPDF(emri, cert)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Shkarko PDF
                    </button>
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
