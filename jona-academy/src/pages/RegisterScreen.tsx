import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, GlobeIcon, ChevronLeftIcon } from '../components/Icons'

export default function RegisterScreen() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
          <ChevronLeftIcon size={18} strokeWidth={2} />
        </button>
      </div>

      <div style={{ flex: 1, padding: '24px 24px 40px' }}>
        <h1 style={{ fontSize: 24, marginBottom: 6, color: 'var(--text-primary)' }}>Krijo Llogari</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Fillo udhëtimin tënd të mësimit sot</p>

        <div className="input-group">
          <label className="input-label">Emri i Plotë</label>
          <div className="input-wrapper has-icon">
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <UserIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
            </span>
            <input className="input-field" type="text" placeholder="Emri juaj i plotë" />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Email</label>
          <div className="input-wrapper has-icon">
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <MailIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
            </span>
            <input className="input-field" type="email" placeholder="emaili@juaj.com" />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Fjalëkalimi</label>
          <div className="input-wrapper has-icon">
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
            </span>
            <input className="input-field" type={showPass ? 'text' : 'password'} placeholder="Min. 8 karaktere" />
            <button className="input-icon-right" onClick={() => setShowPass(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              {showPass ? <EyeOffIcon size={16} strokeWidth={1.8} /> : <EyeIcon size={16} strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: 24 }}>
          <label className="input-label">Konfirmo Fjalëkalimin</label>
          <div className="input-wrapper has-icon">
            <span className="input-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <LockIcon size={16} color="var(--text-muted)" strokeWidth={1.8} />
            </span>
            <input className="input-field" type="password" placeholder="Përsërit fjalëkalimin" />
          </div>
        </div>

        <button className="btn btn-primary btn-full" onClick={() => navigate('/home')} style={{ marginBottom: 16, padding: '16px' }}>Krijo Llogari</button>

        <div className="divider-text">ose</div>

        <button className="btn btn-secondary btn-full" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <GlobeIcon size={17} color="var(--text-secondary)" strokeWidth={1.8} /> Regjistrohu me Google
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Duke krijuar llogari, pranon{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Kushtet e Shërbimit</span>{' '}dhe{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Politikën e Privatësisë</span>
        </p>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Ke llogari?{' '}
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Hyr</button>
        </p>
      </div>
    </div>
  )
}
