import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { courses } from '../data/mockData'

interface Subscription {
  tipi: 'monthly' | 'yearly'
  skadanNe: any
}

interface UserProfile {
  uid: string
  emri: string
  email: string
  fotoja?: string
  krijuarNe: any
  kursetBlerë: number[]
  abonimi?: Subscription | null
  adminAccess?: number[]
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (emri: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  hasSubscription: () => boolean
  hasCourseAccess: (courseId: number) => boolean
  hasLessonAccess: (lesson: { isFree: boolean }, courseId: number) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const hasSubscription = (): boolean => {
    if (!profile?.abonimi) return false
    const skadan = profile.abonimi.skadanNe?.toDate?.() ?? new Date(profile.abonimi.skadanNe)
    return skadan > new Date()
  }

  const hasCourseAccess = (courseId: number): boolean => {
    const course = courses.find(c => c.id === courseId)
    if (course?.isFree) return true
    if (!user) return false
    if (hasSubscription()) return true
    if (profile?.kursetBlerë?.includes(courseId)) return true
    if (profile?.adminAccess?.includes(courseId)) return true
    return false
  }

  const hasLessonAccess = (lesson: { isFree: boolean }, courseId: number): boolean => {
    if (lesson.isFree) return true
    return hasCourseAccess(courseId)
  }

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const { user: gUser } = await signInWithPopup(auth, provider)
    const snap = await getDoc(doc(db, 'users', gUser.uid))
    if (!snap.exists()) {
      await setDoc(doc(db, 'users', gUser.uid), {
        uid: gUser.uid,
        emri: gUser.displayName || '',
        email: gUser.email || '',
        fotoja: gUser.photoURL || '',
        krijuarNe: serverTimestamp(),
        kursetBlerë: [],
        abonimi: null,
        adminAccess: [],
      })
    }
  }

  const register = async (emri: string, email: string, password: string) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(newUser, { displayName: emri })
    await setDoc(doc(db, 'users', newUser.uid), {
      uid: newUser.uid,
      emri,
      email,
      krijuarNe: serverTimestamp(),
      kursetBlerë: [],
      abonimi: null,
      adminAccess: [],
    })
  }

  const logout = async () => {
    await signOut(auth)
    setProfile(null)
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, loginWithGoogle, register, logout, resetPassword, hasSubscription, hasCourseAccess, hasLessonAccess }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth duhet të përdoret brenda AuthProvider')
  return ctx
}
