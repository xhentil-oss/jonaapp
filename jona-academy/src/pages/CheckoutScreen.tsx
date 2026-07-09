import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, LockIcon, CreditCardIcon, MailIcon } from '../components/Icons'
import { fetchCourse, purchaseCourse, purchaseSubscription, type ApiCourse } from '../services/api'
import { useAuth } from '../context/AuthContext'

const subPlanIds: Record<string, number> = { 'sub-mujor': 1, 'sub-vjetor': 2 }

function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(val: string) {
  const v = val.replace(/\D/g, '').slice(0, 4)
  return v.length >= 3 ? `${v.slice(0, 2)}/${v.slice(2)}` : v
}
function detectCard(num: string): string | null {
  const n = num.replace(/\s/g, '')
  if (/^4/.test(n)) return 'VISA'
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'MASTERCARD'
  if (/^3[47]/.test(n)) return 'AMEX'
  return null
}

type Method = 'card' | 'paypal' | 'visa'

function VisaLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.32} viewBox="0 0 80 26" fill="none">
      <rect width="80" height="26" rx="4" fill="#1A1F71"/>
      <text x="40" y="20" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif" fontStyle="italic">VISA</text>
    </svg>
  )
}

function PayPalLogo({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.3} viewBox="0 0 100 30" fill="none">
      <text x="2" y="23" fill="#003087" fontSize="20" fontWeight="bold" fontFamily="Arial, sans-serif">Pay</text>
      <text x="34" y="23" fill="#009cde" fontSize="20" fontWeight="bold" fontFamily="Arial, sans-serif">Pal</text>
    </svg>
  )
}

const subPlans: Record<string, { emri: string; cmimi: string; periudha: string; desc: string; emoji: string }> = {
  'sub-mujor': { emri: 'Abonim Mujor', cmimi: '€9.99', periudha: '/muaj', desc: 'Akses i plotë në të gjitha kurset premium', emoji: '📅' },
  'sub-vjetor': { emri: 'Abonim Vjetor', cmimi: '€59.99', periudha: '/vit', desc: 'Akses i plotë — kursej 50% krahasuar me mujor', emoji: '⭐' },
}

export default function CheckoutScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refreshEnrollments } = useAuth()

  const isSub = id?.startsWith('sub-') ?? false
  const subPlan = isSub ? subPlans[id!] ?? subPlans['sub-vjetor'] : null
  const [course, setCourse] = useState<ApiCourse | null>(null)

  useEffect(() => {
    if (!isSub && id) {
      fetchCourse(Number(id)).then(setCourse).catch(console.error)
    }
  }, [id, isSub])

  const price = isSub ? subPlan!.cmimi : (course?.price ?? '€0')
  const itemTitle = isSub ? subPlan!.emri : (course?.title ?? '')

  const [method, setMethod] = useState<Method>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [email, setEmail] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const cardType = detectCard(cardNumber)
  const isValidCard = cardNumber.replace(/\s/g, '').length === 16 && cardName.trim().length > 2 && expiry.length === 5 && cvv.length >= 3 && email.includes('@')
  const isValidPaypal = paypalEmail.includes('@')
  const isValidVisa = cardNumber.replace(/\s/g, '').length === 16 && cardName.trim().length > 2 && expiry.length === 5 && cvv.length >= 3 && email.includes('@') && (cardType === 'VISA')

  const isValid = method === 'card' ? isValidCard : method === 'paypal' ? isValidPaypal : isValidVisa

  const handlePay = async () => {
    if (!isValid) return
    setLoading(true)
    try {
      if (isSub) {
        await purchaseSubscription(subPlanIds[id!] ?? 2)
      } else if (course) {
        await purchaseCourse(course.id)
      }
      await refreshEnrollments()
      setSuccess(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!isSub && !course) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <p style={{ color: 'var(--text-muted)' }}>Duke ngarkuar...</p>
    </div>
  )

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #4A9B6F, #3a8a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(74,155,111,0.3)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>{isSub ? 'Abonimi u aktivizua!' : 'Pagesa u krye!'}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 8, lineHeight: 1.6 }}>{isSub ? 'Mirë se erdhe! Ke akses të plotë në të gjitha kurset premium.' : 'Faleminderit! Keni blerë me sukses kursin:'}</p>
        <p style={{ color: 'var(--primary)', fontSize: 15, fontWeight: 700, marginBottom: 32, lineHeight: 1.4 }}>{itemTitle}</p>
        <button className="btn btn-primary btn-full" style={{ padding: '16px' }} onClick={() => isSub ? navigate('/courses') : navigate(`/course/${course!.id}`)}>
          {isSub ? 'Shfleto Kurset' : 'Shko te Kursi'}
        </button>
        <button onClick={() => navigate('/home')} style={{ marginTop: 14, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer' }}>Kthehu në Kryefaqe</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 8px rgba(28,23,20,0.06)' }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', flexShrink: 0 }}>
          <ChevronLeftIcon size={18} strokeWidth={2} />
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Pagesa</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, color: '#4A9B6F', fontSize: 12, fontWeight: 600 }}>
          <LockIcon size={13} color="#4A9B6F" strokeWidth={2} /> Pagesë e sigurt
        </div>
      </div>

      <div style={{ padding: '20px' }}>

        {/* Order summary */}
        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '14px', marginBottom: 20, boxShadow: 'var(--shadow-card)', display: 'flex', gap: 12, alignItems: 'center' }}>
          {isSub ? (
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(145deg, #5C3317 0%, #7A4F2D 50%, #A0673A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(122,79,45,0.4)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -8, right: -8, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
              <svg width="26" height="22" viewBox="0 0 26 22" fill="none">
                <path d="M2 17.5L5 6L9.5 12L13 2L16.5 12L21 6L24 17.5H2Z" fill="white" fillOpacity="0.95"/>
                <rect x="2" y="19" width="22" height="2.5" rx="1.25" fill="rgba(255,255,255,0.6)"/>
                <circle cx="2.5" cy="5.5" r="1.5" fill="rgba(255,220,100,0.9)"/>
                <circle cx="13" cy="2" r="1.5" fill="rgba(255,220,100,0.9)"/>
                <circle cx="23.5" cy="5.5" r="1.5" fill="rgba(255,220,100,0.9)"/>
              </svg>
            </div>
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
              <img src={course!.image} alt={course!.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{itemTitle}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{isSub ? subPlan!.desc : course!.instructor}</p>
            {isSub && <p style={{ fontSize: 10, color: '#4A9B6F', fontWeight: 600, marginTop: 2 }}>Ripërtërihet automatikisht {subPlan!.periudha}</p>}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{price}</p>
            {isSub && <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{subPlan!.periudha}</p>}
          </div>
        </div>

        {/* Payment method tabs */}
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Mënyra e Pagesës</p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {([
            { id: 'card',   label: 'Kartë',   icon: <CreditCardIcon size={16} color={method === 'card' ? 'var(--primary)' : 'var(--text-muted)'} strokeWidth={1.8} /> },
            { id: 'visa',   label: 'Visa',    icon: <VisaLogo size={36} /> },
            { id: 'paypal', label: 'PayPal',  icon: <PayPalLogo size={52} /> },
          ] as const).map(m => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              style={{ flex: 1, padding: '12px 8px', background: 'var(--bg-primary)', border: `2px solid ${method === m.id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.2s', boxShadow: method === m.id ? '0 2px 12px rgba(122,79,45,0.15)' : 'none' }}
            >
              <div style={{ height: 20, display: 'flex', alignItems: 'center' }}>{m.icon}</div>
              {m.id === 'card' && <span style={{ fontSize: 11, fontWeight: 600, color: method === m.id ? 'var(--primary)' : 'var(--text-muted)' }}>{m.label}</span>}
            </button>
          ))}
        </div>

        {/* Card / Visa form */}
        {(method === 'card' || method === 'visa') && (
          <>
            <div style={{ background: 'linear-gradient(135deg, #2D1B0E 0%, #4A2E1A 60%, #7A4F2D 100%)', borderRadius: 20, padding: '22px', marginBottom: 20, boxShadow: '0 10px 32px rgba(28,23,20,0.25)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
              <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div style={{ width: 40, height: 28, borderRadius: 4, background: 'rgba(255,220,100,0.85)' }} />
                {(method === 'visa' || cardType === 'VISA') && <VisaLogo size={44} />}
                {cardType === 'MASTERCARD' && <span style={{ fontSize: 12, fontWeight: 800, color: 'white', letterSpacing: 1 }}>MC</span>}
              </div>
              <p style={{ fontSize: 17, fontWeight: 600, color: 'white', letterSpacing: 3, marginBottom: 18, fontFamily: 'monospace' }}>
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 2, letterSpacing: 1, textTransform: 'uppercase' }}>Mbajtësi</p>
                  <p style={{ fontSize: 12, color: 'white', fontWeight: 600, letterSpacing: 1 }}>{cardName || '— — — —'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 2, letterSpacing: 1, textTransform: 'uppercase' }}>Skadenca</p>
                  <p style={{ fontSize: 12, color: 'white', fontWeight: 600, fontFamily: 'monospace' }}>{expiry || 'MM/VV'}</p>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '18px', boxShadow: 'var(--shadow-card)', marginBottom: 14 }}>
              {method === 'visa' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(26,31,113,0.06)', border: '1px solid rgba(26,31,113,0.15)', borderRadius: 8, padding: '8px 12px', marginBottom: 14 }}>
                  <VisaLogo size={36} />
                  <span style={{ fontSize: 12, color: '#1A1F71', fontWeight: 600 }}>Vendos kartën tënde Visa</span>
                </div>
              )}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>Numri i Kartës</label>
                <input className="input-field" type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: 2 }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>Emri mbi Kartë</label>
                <input className="input-field" type="text" placeholder="EMRI MBIEMRI" value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} style={{ textTransform: 'uppercase', letterSpacing: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>Skadenca</label>
                  <input className="input-field" type="text" inputMode="numeric" placeholder="MM/VV" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} style={{ fontFamily: 'monospace', fontSize: 15, letterSpacing: 2 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 5 }}>CVV</label>
                  <input className="input-field" type="text" inputMode="numeric" placeholder="•••" maxLength={4} value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: 4 }} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* PayPal form */}
        {method === 'paypal' && (
          <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px', boxShadow: 'var(--shadow-card)', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <PayPalLogo size={100} />
            </div>
            <div style={{ background: 'rgba(0,156,222,0.06)', border: '1px solid rgba(0,156,222,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 16, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#003087', fontWeight: 600, marginBottom: 4 }}>Pagesë e sigurt me PayPal</p>
              <p style={{ fontSize: 12, color: '#009cde' }}>Do ridrejtoheni te PayPal për të konfirmuar pagesën</p>
            </div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email-i i llogarisë PayPal</label>
            <div className="input-wrapper has-icon">
              <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <MailIcon size={15} color="var(--text-muted)" strokeWidth={1.8} />
              </span>
              <input className="input-field" type="email" placeholder="emaili@juaj.com" value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} />
            </div>
          </div>
        )}

        {/* Email konfirmim */}
        {(method === 'card' || method === 'visa') && (
          <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '18px', boxShadow: 'var(--shadow-card)', marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email për konfirmim</label>
            <div className="input-wrapper has-icon">
              <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <MailIcon size={15} color="var(--text-muted)" strokeWidth={1.8} />
              </span>
              <input className="input-field" type="email" placeholder="emaili@juaj.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
        )}
        {method === 'paypal' && <div style={{ marginBottom: 20 }} />}

        {/* Total */}
        <div style={{ background: 'rgba(122,79,45,0.06)', border: '1px solid rgba(122,79,45,0.15)', borderRadius: 'var(--radius-md)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Total</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{price}</span>
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ padding: '17px', fontSize: 16, opacity: isValid ? 1 : 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: method === 'paypal' ? '#009cde' : undefined, border: method === 'paypal' ? 'none' : undefined }}
          onClick={handlePay}
          disabled={!isValid || loading}
        >
          {loading ? (
            <>
              <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Duke procesuar...
            </>
          ) : (
            <>
              <LockIcon size={15} color="white" strokeWidth={2.2} />
              {method === 'paypal' ? `Vazhdo me PayPal · ${price}` : `Paguaj ${price}`}
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 14, lineHeight: 1.6 }}>
          Pagesa juaj është e sigurt dhe e enkriptuar SSL.
        </p>
      </div>
    </div>
  )
}
