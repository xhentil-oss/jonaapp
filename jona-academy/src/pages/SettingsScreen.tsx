import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import {
  UserIcon, LockIcon, BellIcon, BookOpenIcon, MailIcon,
  CreditCardIcon, HelpCircleIcon, FileTextIcon,
  SettingsIcon, LogOutIcon, ChevronRightIcon,
} from '../components/Icons'
import { useAuth } from '../context/AuthContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function SettingsScreen() {
  const navigate = useNavigate()
  const { user, profile, logout } = useAuth()

  const p = profile as any
  const [njoftime, setNjoftime] = useState<boolean>(true)
  const [emailUpdates, setEmailUpdates] = useState<boolean>(false)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (p) {
      if (typeof p.njoftimet === 'boolean') setNjoftime(p.njoftimet)
      if (typeof p.emailUpdates === 'boolean') setEmailUpdates(p.emailUpdates)
    }
  }, [profile])

  const toggleNjoftime = async () => {
    const val = !njoftime
    setNjoftime(val)
    if (user) await updateDoc(doc(db, 'users', user.uid), { njoftimet: val })
  }

  const toggleEmailUpdates = async () => {
    const val = !emailUpdates
    setEmailUpdates(val)
    if (user) await updateDoc(doc(db, 'users', user.uid), { emailUpdates: val })
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} style={{ width: 46, height: 26, borderRadius: 13, background: value ? 'var(--primary)' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </button>
  )

  const Seksioni = ({ titulli, children }: { titulli: string; children: React.ReactNode }) => (
    <div style={{ padding: '0 20px', marginBottom: 24 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{titulli}</p>
      <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>{children}</div>
    </div>
  )

  const Rreshti = ({ Icon, label, value, onPress, isToggle, toggleValue, onToggle, last, accent }: {
    Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>
    label: string; value?: string; onPress?: () => void
    isToggle?: boolean; toggleValue?: boolean; onToggle?: () => void; last?: boolean; accent?: boolean
  }) => (
    <button
      onClick={isToggle ? onToggle : onPress}
      style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, borderBottom: last ? 'none' : '1px solid var(--border)' }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={15} color="var(--text-secondary)" strokeWidth={1.8} />
      </div>
      <span style={{ flex: 1, fontSize: 14, color: accent ? 'var(--primary)' : 'var(--text-primary)', textAlign: 'left', fontWeight: accent ? 600 : 400 }}>{label}</span>
      {isToggle
        ? <Toggle value={toggleValue!} onChange={onToggle!} />
        : value
          ? <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{value}</span>
          : <ChevronRightIcon size={16} color="var(--text-muted)" strokeWidth={2} />
      }
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: 40 }}>
      <Header title="Cilësimet" showBack />
      <div style={{ paddingTop: 16 }}>

        <Seksioni titulli="Llogaria">
          <Rreshti Icon={UserIcon}     label="Ndrysho Profilin"     onPress={() => navigate('/edit-profile')} accent />
          <Rreshti Icon={LockIcon}     label="Ndrysho Fjalëkalimin" onPress={() => navigate('/edit-password')} accent />
          <Rreshti Icon={MailIcon} label="Ndrysho Email-in" onPress={() => navigate('/edit-email')} accent last />
        </Seksioni>

        <Seksioni titulli="Njoftimet">
          <Rreshti Icon={BellIcon}     label="Njoftime Push"      isToggle toggleValue={njoftime}     onToggle={toggleNjoftime} />
          <Rreshti Icon={BookOpenIcon} label="Azhurnime me Email" isToggle toggleValue={emailUpdates} onToggle={toggleEmailUpdates} last />
        </Seksioni>

        <Seksioni titulli="Luajtja">
          <Rreshti Icon={SettingsIcon} label="Luaj Automatikisht Mësimet" isToggle toggleValue={autoplay} onToggle={() => setAutoplay(n => !n)} />
          <Rreshti Icon={SettingsIcon} label="Cilësia e Videos"  value="Auto" />
          <Rreshti Icon={SettingsIcon} label="Shkarkimet"        value="Vetëm Wi-Fi" last />
        </Seksioni>

        <Seksioni titulli="Abonimi">
          <Rreshti Icon={CreditCardIcon} label="Menaxho Abonimin" onPress={() => navigate('/paywall')} />
          <Rreshti Icon={CreditCardIcon} label="Rikthe Blerjet"   onPress={() => {}} last />
        </Seksioni>

        <Seksioni titulli="Mbështetja">
          <Rreshti Icon={HelpCircleIcon} label="Qendra e Ndihmës"      onPress={() => {}} />
          <Rreshti Icon={HelpCircleIcon} label="Kontakto Mbështetjen"  onPress={() => {}} />
          <Rreshti Icon={SettingsIcon}   label="Vlerëso Aplikacionin"  onPress={() => {}} last />
        </Seksioni>

        <Seksioni titulli="Ligjore">
          <Rreshti Icon={FileTextIcon} label="Kushtet e Shërbimit"    onPress={() => {}} />
          <Rreshti Icon={FileTextIcon} label="Politika e Privatësisë" onPress={() => {}} last />
        </Seksioni>

        <div style={{ padding: '0 20px' }}>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Jona Academy v1.0.0</p>
          <button
            onClick={async () => { await logout(); navigate('/login') }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', background: 'rgba(217,79,79,0.06)', color: 'var(--danger)', border: '1px solid rgba(217,79,79,0.2)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
          >
            <LogOutIcon size={16} color="var(--danger)" strokeWidth={2} />
            Dil nga Llogaria
          </button>
        </div>
      </div>
    </div>
  )
}
