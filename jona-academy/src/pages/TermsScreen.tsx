import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeftIcon } from '../components/Icons'

const seksionet = [
  {
    id: 'kushtet',
    titulli: 'Kushtet e Përdorimit',
    permbajtja: [
      {
        nentitulli: '1. Pranimi i Kushteve',
        teksti: 'Duke përdorur platformën JonaAcademy, ju pranoni këto kushte të përdorimit. Nëse nuk pajtoheni me ndonjë pjesë të këtyre kushteve, ju lutemi mos e përdorni platformën tonë.',
      },
      {
        nentitulli: '2. Llogaria Juaj',
        teksti: 'Jeni përgjegjës për ruajtjen e konfidencialitetit të fjalëkalimit tuaj dhe për të gjitha aktivitetet që ndodhin nën llogarinë tuaj. Duhet të na njoftoni menjëherë për çdo përdorim të paautorizuar të llogarisë tuaj.',
      },
      {
        nentitulli: '3. Pronësia Intelektuale',
        teksti: 'Të gjitha kurset, videot, materialet dhe përmbajtjet në JonaAcademy janë pronë e platformës ose e instruktorëve të licencuar. Ndalohet kopjimi, shpërndarja ose rishitja e çdo materiali pa leje me shkrim.',
      },
      {
        nentitulli: '4. Politika e Rimbursimit',
        teksti: 'Ofrojmë rimbursim të plotë brenda 7 ditëve nga blerja, nëse nuk keni konsumuar më shumë se 20% të kursit. Pas kësaj periudhe, rimbursimi vlerësohet rast pas rasti.',
      },
      {
        nentitulli: '5. Ndryshimet e Kushteve',
        teksti: 'Rezervojmë të drejtën të ndryshojmë këto kushte në çdo kohë. Ndryshimet hyjnë në fuqi menjëherë pas publikimit. Përdorimi i vazhdueshëm i platformës pas ndryshimeve përbën pranimin e kushteve të reja.',
      },
    ],
  },
  {
    id: 'privatesia',
    titulli: 'Politika e Privatësisë',
    permbajtja: [
      {
        nentitulli: '1. Kush Jemi',
        teksti: 'Jona Academy është një platformë online kursesh e ofruar përmes këtij aplikacioni dhe faqes sonë të internetit. Kjo politikë shpjegon çfarë të dhënash mbledhim, pse i mbledhim, dhe çfarë të drejtash keni mbi to.',
      },
      {
        nentitulli: '2. Të Dhënat që Mbledhim',
        teksti: 'Kur krijoni një llogari, mbledhim emrin tuaj të plotë, adresën email dhe fjalëkalimin (i ruajtur gjithmonë i enkriptuar, kurrë në tekst të thjeshtë). Kur regjistroheni në një kurs ose abonim, ruajmë të dhëna mbi kursin/planin e blerë dhe statusin e pagesës. Gjatë përdorimit të platformës, ruajmë progresin tuaj në mësime (p.sh. sa video keni parë, cilat kurse i keni përfunduar) që t\'ju ndihmojmë të vazhdoni ku e latë. Nuk mbledhim të dhëna të kartës bankare — pagesat kryhen nga procesorë të pagesave të palëve të treta që janë vetë përgjegjës për sigurinë e këtyre të dhënave.',
      },
      {
        nentitulli: '3. Si i Përdorim të Dhënat',
        teksti: 'Të dhënat tuaja përdoren për: krijimin dhe menaxhimin e llogarisë suaj, dhënien e aksesit te kurset që keni blerë, dërgimin e email-eve të rëndësishme (konfirmim regjistrimi, rivendosje fjalëkalimi, njoftime për kurse/certifikata të reja nëse i keni aktivizuar), dhe përmirësimin e vetë platformës. Nuk i shesim dhe nuk i japim me qira të dhënat tuaja personale palëve të treta për qëllime reklamimi.',
      },
      {
        nentitulli: '4. Me Kë i Ndajmë të Dhënat',
        teksti: 'Për të ofruar shërbimin, disa të dhëna kalojnë përmes ofruesve teknikë që na ndihmojnë të operojmë: shërbimi i email-eve (për dërgimin e njoftimeve dhe rivendosjen e fjalëkalimit) dhe, kur aplikohet, procesori i pagesave për blerjet e kurseve/abonimeve. Videot e mësimeve mund të shërbehen përmes Google Drive; hapja e tyre i nënshtrohet edhe politikës së privatësisë së Google. Këta ofrues përpunojnë të dhënat vetëm në emrin tonë dhe sipas udhëzimeve tona, jo për qëllime të tyre.',
      },
      {
        nentitulli: '5. Ruajtja e të Dhënave',
        teksti: 'Të dhënat tuaja ruhen për sa kohë llogaria juaj është aktive. Nëse kërkoni fshirjen e llogarisë, i fshijmë të dhënat tuaja personale brenda një afati të arsyeshëm, përveç rasteve kur ligji na detyron t\'i mbajmë (p.sh. të dhëna faturimi për qëllime kontabiliteti).',
      },
      {
        nentitulli: '6. Siguria e të Dhënave',
        teksti: 'Fjalëkalimet ruhen gjithmonë të enkriptuara (hash-uara), asnjëherë në tekst të thjeshtë. Komunikimi mes aplikacionit dhe serverëve tanë kryhet përmes lidhjeve të enkriptuara (HTTPS). Aksesi te të dhënat brenda organizatës sonë kufizohet vetëm te personeli që ka nevojë të vërtetë për të.',
      },
      {
        nentitulli: '7. Të Drejtat Tuaja',
        teksti: 'Keni të drejtë të: shihni çfarë të dhënash kemi për ju, të kërkoni korrigjimin e të dhënave të pasakta, të kërkoni fshirjen e llogarisë dhe të dhënave tuaja, dhe të tërhiqni pëlqimin për marrjen e njoftimeve promocionale (nga Cilësimet e llogarisë). Për të ushtruar këto të drejta, na kontaktoni në email-in më poshtë.',
      },
      {
        nentitulli: '8. Privatësia e Fëmijëve',
        teksti: 'Platforma jonë nuk synohet për persona nën moshën 16 vjeç, dhe nuk mbledhim me dije të dhëna nga fëmijë nën këtë moshë. Nëse besoni se një fëmijë na ka dhënë të dhëna personale, na kontaktoni që t\'i fshijmë menjëherë.',
      },
      {
        nentitulli: '9. Ndryshimet e Kësaj Politike',
        teksti: 'Mund ta përditësojmë këtë politikë herë pas here për të reflektuar ndryshime në shërbimet tona ose kërkesa ligjore. Data e përditësimit të fundit shfaqet në krye të kësaj faqeje.',
      },
      {
        nentitulli: '10. Na Kontaktoni',
        teksti: 'Për çdo pyetje rreth kësaj politike ose të dhënave tuaja, na shkruani në privacy@jonacademy.com.',
      },
    ],
  },
]

export default function TermsScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tabFillestar = searchParams.get('tab') === 'privatesia' ? 'privatesia' : 'kushtet'
  const [tabAktiv, setTabAktiv] = useState<'kushtet' | 'privatesia'>(tabFillestar)
  const [hapur, setHapur] = useState<string | null>(null)

  const seksioni = seksionet.find(s => s.id === tabAktiv)!

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
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>Kushtet & Privatësia</h2>
      </div>

      {/* Tabs */}
      <div style={{
        background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)',
        padding: '0 20px', display: 'flex', gap: 0,
      }}>
        {(['kushtet', 'privatesia'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setTabAktiv(tab); setHapur(null) }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '14px 16px', fontSize: 14, fontWeight: 600,
              color: tabAktiv === tab ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: tabAktiv === tab ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            {tab === 'kushtet' ? 'Kushtet e Përdorimit' : 'Privatësia'}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: '20px' }}>

        {/* Data e fundit */}
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
          Përditësuar së fundmi: 22 Korrik 2026
        </p>

        {/* Seksionet */}
        <div style={{
          background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', overflow: 'hidden',
        }}>
          {seksioni.permbajtja.map((p, i) => (
            <div key={i}>
              <button
                onClick={() => setHapur(hapur === `${tabAktiv}-${i}` ? null : `${tabAktiv}-${i}`)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '15px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  borderBottom: hapur === `${tabAktiv}-${i}` ? '1px solid var(--border)' : i < seksioni.permbajtja.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'left' }}>
                  {p.nentitulli}
                </span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transform: hapur === `${tabAktiv}-${i}` ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {hapur === `${tabAktiv}-${i}` && (
                <div style={{ padding: '12px 18px 16px', background: 'var(--bg-secondary)' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                    {p.teksti}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Kontakt footer */}
        <div style={{
          marginTop: 20, background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(122,79,45,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>Pyetje rreth kushteve?</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{tabAktiv === 'privatesia' ? 'privacy@jonacademy.com' : 'legal@jonacademy.com'}</p>
          </div>
        </div>

      </div>
    </div>
  )
}
