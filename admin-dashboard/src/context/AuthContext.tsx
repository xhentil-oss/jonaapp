import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getToken, setToken, loginAdmin, fetchMe, type AdminUser } from '../services/api'

interface AuthContextType {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    fetchMe()
      .then(me => {
        if (me.role !== 'admin') { setToken(null); setUser(null) }
        else setUser(me)
      })
      .catch(() => { setToken(null); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const { token, user: loggedInUser } = await loginAdmin(email, password)
    if (loggedInUser.role !== 'admin') {
      throw new Error('Kjo llogari nuk ka të drejta admin')
    }
    setToken(token)
    setUser(loggedInUser)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth duhet të përdoret brenda AuthProvider')
  return ctx
}
