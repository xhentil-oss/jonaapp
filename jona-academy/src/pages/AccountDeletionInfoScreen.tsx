import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '../components/Icons'

export default function AccountDeletionInfoScreen() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>

      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', flexShrink: 0 }}
        >
          <ChevronLeftIcon size={18} strokeWidth={2} />
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Fshirja e Llogarisë dhe të Dhënave</h2>
      </div>

      <div style={{ flex: 1, padding: '24px 20px' }}>

        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, marginBottom: 10, color: 'var(--text-primary)' }}>Opsioni 1 — Brenda Aplikacionit</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Nëse ke aplikacionin Jona Academy të instaluar, hyr në llogarinë tënde dhe shko te: <strong>Profili → Cilësimet → Fshi Llogarinë</strong>. Do të të kërkohet të konfirmosh me fjalëkalimin, dhe llogaria fshihet menjëherë.
          </p>
        </div>

        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, marginBottom: 10, color: 'var(--text-primary)' }}>Opsioni 2 — Me Email (pa nevojë për app-in)</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 10 }}>
            Nëse s'ke më qasje te aplikacioni ose preferon ta bësh kërkesën me email, na shkruaj në <strong>privacy@jonacademy.com</strong> nga adresa email e llogarisë tënde, me subjekt "Fshirje Llogarie". Do ta procesojmë kërkesën brenda 30 ditëve.
          </p>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '18px' }}>
          <h3 style={{ fontSize: 14, marginBottom: 8, color: 'var(--text-primary)' }}>Çfarë fshihet</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Fshirja e llogarisë heq përgjithmonë: emrin, email-in, fjalëkalimin, regjistrimet në kurse, progresin e mësimeve, certifikatat dhe abonimin tënd. Të dhëna faturimi mund të mbahen për një periudhë shtesë kur ligji e kërkon (p.sh. për qëllime kontabiliteti).
          </p>
        </div>

      </div>
    </div>
  )
}
