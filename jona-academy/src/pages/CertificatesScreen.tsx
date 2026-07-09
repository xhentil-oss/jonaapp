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
    <div style="width:257mm;height:182mm;background:#FDFAF5;border:1px solid #C4956A;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0;position:relative;overflow:hidden;font-family:Georgia,serif;">
      <!-- Outer border -->
      <div style="position:absolute;inset:6mm;border:2px solid #C4956A;pointer-events:none;"></div>
      <div style="position:absolute;inset:8.5mm;border:1px solid rgba(196,149,106,0.4);pointer-events:none;"></div>
      <!-- Corner ornaments -->
      <div style="position:absolute;top:9mm;left:9mm;width:12mm;height:12mm;border-top:3px solid #C4956A;border-left:3px solid #C4956A;"></div>
      <div style="position:absolute;top:9mm;right:9mm;width:12mm;height:12mm;border-top:3px solid #C4956A;border-right:3px solid #C4956A;"></div>
      <div style="position:absolute;bottom:9mm;left:9mm;width:12mm;height:12mm;border-bottom:3px solid #C4956A;border-left:3px solid #C4956A;"></div>
      <div style="position:absolute;bottom:9mm;right:9mm;width:12mm;height:12mm;border-bottom:3px solid #C4956A;border-right:3px solid #C4956A;"></div>
      <!-- Background watermark circle -->
      <div style="position:absolute;width:120mm;height:120mm;border-radius:50%;border:1px solid rgba(196,149,106,0.07);top:50%;left:50%;transform:translate(-50%,-50%);"></div>
      <div style="position:absolute;width:90mm;height:90mm;border-radius:50%;border:1px solid rgba(196,149,106,0.06);top:50%;left:50%;transform:translate(-50%,-50%);"></div>
      <!-- Content -->
      <div style="position:relative;z-index:1;text-align:center;padding:0 20mm;width:100%;box-sizing:border-box;">
        <!-- Academy name -->
        <p style="font-size:9pt;letter-spacing:5px;text-transform:uppercase;color:#8B6914;margin:0 0 2mm;font-family:Arial,sans-serif;font-weight:600;">JONA ACADEMY</p>
        <!-- Divider -->
        <div style="display:flex;align-items:center;justify-content:center;gap:3mm;margin:0 0 4mm;">
          <div style="height:1px;width:25mm;background:linear-gradient(to right,transparent,#C4956A);"></div>
          <div style="width:3mm;height:3mm;border:1px solid #C4956A;transform:rotate(45deg);"></div>
          <div style="height:1px;width:25mm;background:linear-gradient(to left,transparent,#C4956A);"></div>
        </div>
        <p style="font-size:22pt;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:#2C1A0E;margin:0 0 3mm;font-family:Georgia,serif;">CERTIFIKATË</p>
        <p style="font-size:9pt;color:#7A6040;letter-spacing:1px;margin:0 0 5mm;font-family:Arial,sans-serif;">E PËRFUNDIMIT TË SUKSESSHËM</p>
        <p style="font-size:9pt;color:#555;margin:0 0 2mm;font-family:Arial,sans-serif;">Kjo certifikatë vërteton se</p>
        <h1 style="font-size:26pt;color:#2C1A0E;margin:0 0 2mm;font-style:italic;font-family:Georgia,serif;font-weight:bold;">${emri}</h1>
        <p style="font-size:9pt;color:#555;margin:0 0 4mm;font-family:Arial,sans-serif;">ka përfunduar me sukses trajnimin</p>
        <!-- Divider -->
        <div style="display:flex;align-items:center;justify-content:center;gap:3mm;margin:0 0 3mm;">
          <div style="height:1px;width:20mm;background:rgba(196,149,106,0.4);"></div>
          <div style="width:2mm;height:2mm;border-radius:50%;background:#C4956A;"></div>
          <div style="height:1px;width:20mm;background:rgba(196,149,106,0.4);"></div>
        </div>
        <h2 style="font-size:14pt;color:#8B4513;margin:0 0 5mm;line-height:1.4;font-family:Georgia,serif;">"${cert.courseTitle}"</h2>
        <!-- Signature row -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin:0 10mm;padding-top:4mm;">
          <div style="text-align:center;">
            <div style="width:35mm;border-bottom:1px solid #C4956A;margin-bottom:1.5mm;"></div>
            <p style="font-size:7pt;color:#888;font-family:Arial,sans-serif;letter-spacing:0.5px;">DATA E LËSHIMIT</p>
            <p style="font-size:8pt;color:#555;font-family:Arial,sans-serif;">${cert.completedAt}</p>
          </div>
          <div style="text-align:center;">
            <p style="font-size:18pt;color:#C4956A;font-family:Georgia,serif;margin:0 0 0.5mm;font-style:italic;">Jona</p>
            <div style="width:35mm;border-bottom:1px solid #C4956A;margin-bottom:1.5mm;"></div>
            <p style="font-size:7pt;color:#888;font-family:Arial,sans-serif;letter-spacing:0.5px;">DREJTORESHA</p>
            <p style="font-size:8pt;color:#555;font-family:Arial,sans-serif;">Fatjona Cici</p>
          </div>
          <div style="text-align:center;">
            <div style="width:35mm;border-bottom:1px solid #C4956A;margin-bottom:1.5mm;"></div>
            <p style="font-size:7pt;color:#888;font-family:Arial,sans-serif;letter-spacing:0.5px;">ID E CERTIFIKATËS</p>
            <p style="font-size:8pt;color:#555;font-family:monospace;">${cert.code}</p>
          </div>
        </div>
      </div>
    </div>`

  const printStyle = document.createElement('style')
  printStyle.id = '__cert_print_style__'
  printStyle.innerHTML = `
    @media print {
      @page { size: A4 landscape; margin: 5mm; }
      body > *:not(#__cert_print__) { display: none !important; }
      #__cert_print__ { display: flex !important; align-items: center; justify-content: center; min-height: 100vh; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
                <div style={{ background: '#FDFAF5', padding: '28px 20px 22px', textAlign: 'center', position: 'relative', borderBottom: '1px solid #E8D9C0', overflow: 'hidden' }}>
                  {/* Outer frame */}
                  <div style={{ position: 'absolute', inset: 8, border: '1.5px solid #C4956A', pointerEvents: 'none', borderRadius: 2 }} />
                  <div style={{ position: 'absolute', inset: 11, border: '1px solid rgba(196,149,106,0.3)', pointerEvents: 'none', borderRadius: 1 }} />
                  {/* Corner pieces */}
                  {[
                    { top: 11, left: 11 },
                    { top: 11, right: 11 },
                    { bottom: 11, left: 11 },
                    { bottom: 11, right: 11 },
                  ].map((pos, i) => (
                    <div key={i} style={{
                      position: 'absolute', width: 14, height: 14,
                      ...pos,
                      borderTop: (pos as any).top !== undefined ? '2.5px solid #C4956A' : 'none',
                      borderBottom: (pos as any).bottom !== undefined ? '2.5px solid #C4956A' : 'none',
                      borderLeft: (pos as any).left !== undefined ? '2.5px solid #C4956A' : 'none',
                      borderRight: (pos as any).right !== undefined ? '2.5px solid #C4956A' : 'none',
                    }} />
                  ))}
                  {/* Background watermark */}
                  <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(196,149,106,0.07)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Academy name */}
                    <p style={{ fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: '#8B6914', margin: '0 0 6px', fontWeight: 600 }}>JONA ACADEMY</p>

                    {/* Divider ornament */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                      <div style={{ height: 1, width: 40, background: 'linear-gradient(to right, transparent, #C4956A)' }} />
                      <div style={{ width: 5, height: 5, border: '1px solid #C4956A', transform: 'rotate(45deg)' }} />
                      <div style={{ height: 1, width: 40, background: 'linear-gradient(to left, transparent, #C4956A)' }} />
                    </div>

                    <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#2C1A0E', margin: '0 0 2px' }}>CERTIFIKATË</p>
                    <p style={{ fontSize: 9, color: '#9A7A50', letterSpacing: 1.5, margin: '0 0 12px', textTransform: 'uppercase' }}>E Përfundimit të Suksesshëm</p>

                    <p style={{ fontSize: 11, color: '#777', margin: '0 0 4px' }}>Kjo certifikatë vërteton se</p>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: '#2C1A0E', margin: '0 0 4px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>{emri}</h2>
                    <p style={{ fontSize: 11, color: '#777', margin: '0 0 10px' }}>ka përfunduar me sukses trajnimin</p>

                    {/* Course title */}
                    <div style={{ background: 'rgba(196,149,106,0.08)', border: '1px solid rgba(196,149,106,0.2)', borderRadius: 6, padding: '8px 14px', margin: '0 10px 12px' }}>
                      <p style={{ fontSize: 13, color: '#8B4513', fontWeight: 700, margin: 0, lineHeight: 1.4, fontFamily: 'Georgia, serif' }}>"{cert.courseTitle}"</p>
                    </div>

                    {/* Signature row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '0 8px', paddingTop: 8 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 60, borderBottom: '1px solid #C4956A', margin: '0 auto 3px' }} />
                        <p style={{ fontSize: 9, color: '#AAA', margin: '0 0 1px', letterSpacing: 0.5, textTransform: 'uppercase' }}>Data</p>
                        <p style={{ fontSize: 10, color: '#666', margin: 0 }}>{cert.completedAt}</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 16, color: '#C4956A', fontFamily: 'Georgia, serif', margin: '0 0 1px', fontStyle: 'italic' }}>Jona</p>
                        <div style={{ width: 60, borderBottom: '1px solid #C4956A', margin: '0 auto 3px' }} />
                        <p style={{ fontSize: 9, color: '#AAA', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Drejtoresha</p>
                        <p style={{ fontSize: 10, color: '#666', margin: 0 }}>Fatjona Cici</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 60, borderBottom: '1px solid #C4956A', margin: '0 auto 3px' }} />
                        <p style={{ fontSize: 9, color: '#AAA', margin: '0 0 1px', letterSpacing: 0.5, textTransform: 'uppercase' }}>ID</p>
                        <p style={{ fontSize: 10, color: '#666', margin: 0, fontFamily: 'monospace' }}>{cert.code}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '14px 16px', background: 'var(--bg-primary)' }}>
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
