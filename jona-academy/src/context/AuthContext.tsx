import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import {
  getToken, setToken, loginUser, registerUser, fetchMe, fetchEnrollments, fetchSubscription,
  type ApiUser, type ApiEnrollment, type ApiSubscription,
} from '../services/api'

interface AuthContextType {
  user: ApiUser | null
  enrollments: ApiEnrollment[]
  subscription: ApiSubscription | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  refreshEnrollments: () => Promise<void>
  hasSubscription: () => boolean
  hasCourseAccess: (courseId: number) => boolean
  hasLessonAccess: (lesson: { isFree: boolean }, courseId: number) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [enrollments, setEnrollments] = useState<ApiEnrollment[]>([])
  const [subscription, setSubscription] = useState<ApiSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  // Enrollments/subscription are secondary data — a failure there (e.g. an
  // endpoint not deployed yet) must never break login/session restore.
  const refreshEnrollments = useCallback(async () => {
    const [enr, sub] = await Promise.all([
      fetchEnrollments().catch(() => []),
      fetchSubscription().catch(() => null),
    ])
    setEnrollments(enr)
    setSubscription(sub)
  }, [])

  const refreshUser = useCallback(async () => {
    const me = await fetchMe()
    setUser(me)
  }, [])

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    fetchMe()
      .then(async me => { setUser(me); await refreshEnrollments() })
      .catch(() => { setToken(null); setUser(null) })
      .finally(() => setLoading(false))
  }, [refreshEnrollments])

  const login = async (email: string, password: string) => {
    const { token, user: loggedInUser } = await loginUser(email, password)
    setToken(token)
    setUser(loggedInUser)
    await refreshEnrollments()
  }

  const register = async (fullName: string, email: string, password: string) => {
    await registerUser(fullName, email, password)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setEnrollments([])
    setSubscription(null)
  }

  const hasSubscription = (): boolean => {
    if (!subscription) return false
    if (!subscription.renews_at) return true
    return new Date(subscription.renews_at) > new Date()
  }

  const hasCourseAccess = (courseId: number): boolean => {
    if (!user) return false
    if (hasSubscription()) return true
    return enrollments.some(e => e.id === courseId)
  }

  const hasLessonAccess = (lesson: { isFree: boolean }, courseId: number): boolean => {
    if (lesson.isFree) return true
    return hasCourseAccess(courseId)
  }

  return (
    <AuthContext.Provider value={{
      user, enrollments, subscription, loading,
      login, register, logout, refreshUser, refreshEnrollments,
      hasSubscription, hasCourseAccess, hasLessonAccess,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth duhet të përdoret brenda AuthProvider')
  return ctx
}
