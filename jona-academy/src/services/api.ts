const API_BASE = 'https://app.jonacademy.com'
const TOKEN_KEY = 'jona_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function authedFetch(path: string, options: RequestInit = {}) {
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Ndodhi një gabim')
  return data
}

export interface ApiUser {
  id: number
  full_name: string
  email: string
  membership_type?: string
  avatar_url?: string
  created_at?: string
}

export async function registerUser(full_name: string, email: string, password: string): Promise<{ token: string; user: ApiUser }> {
  return authedFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ full_name, email, password }) })
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: ApiUser }> {
  return authedFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export async function fetchMe(): Promise<ApiUser> {
  return authedFetch('/api/user/me')
}

export async function updateProfileName(full_name: string): Promise<void> {
  await authedFetch('/api/user/profile', { method: 'PATCH', body: JSON.stringify({ full_name }) })
}

export async function updateEmail(email: string, password: string): Promise<void> {
  await authedFetch('/api/user/email', { method: 'PATCH', body: JSON.stringify({ email, password }) })
}

export async function updatePassword(current_password: string, new_password: string): Promise<void> {
  await authedFetch('/api/user/password', { method: 'PATCH', body: JSON.stringify({ current_password, new_password }) })
}

export interface ApiEnrollment extends ApiCourse {
  enrollmentId: number
  progress: number
  status: 'aktiv' | 'perfunduar'
  enrolledAt: string
}

export async function fetchEnrollments(): Promise<ApiEnrollment[]> {
  const rows = await authedFetch('/api/user/enrollments')
  return rows.map((r: any) => ({
    ...mapCourse(r),
    enrollmentId: r.enrollment_id,
    progress: Math.round(parseFloat(r.progress_percent) || 0),
    status: r.enrollment_status,
    enrolledAt: r.enrolled_at,
  }))
}

export interface ApiCertificate {
  id: number
  course_id: number
  course_title: string
  certificate_code: string
  issued_at: string
}

export async function fetchCertificates(): Promise<ApiCertificate[]> {
  return authedFetch('/api/user/certificates')
}

export interface ApiSubscription {
  id: number
  plan_id: number
  plan_name: string
  status: string
  renews_at: string
}

export async function fetchSubscription(): Promise<ApiSubscription | null> {
  return authedFetch('/api/user/subscription')
}

export async function purchaseCourse(courseId: number): Promise<void> {
  await authedFetch('/api/user/enrollments', { method: 'POST', body: JSON.stringify({ course_id: courseId }) })
}

export async function purchaseSubscription(planId: number): Promise<void> {
  await authedFetch('/api/user/subscriptions', { method: 'POST', body: JSON.stringify({ plan_id: planId }) })
}

export interface ApiLessonDetail {
  id: number
  course_id: number
  section_id: number
  title: string
  video_url: string | null
  duration_seconds: number
  is_free: boolean
  order_index: number
  course_title: string
  section_title: string
  siblings: { id: number; title: string; is_free: boolean; order_index: number; section_id: number }[]
}

export async function fetchLesson(id: number): Promise<ApiLessonDetail> {
  return authedFetch(`/api/lessons/${id}`)
}

export async function postLessonProgress(id: number, watched_seconds: number, is_completed: boolean, enrollment_id?: number): Promise<void> {
  await authedFetch(`/api/lessons/${id}/progress`, { method: 'POST', body: JSON.stringify({ watched_seconds, is_completed, enrollment_id }) })
}

export interface NotificationSettings {
  new_courses: number
  lesson_reminders: number
  offers_promotions: number
  certificates: number
  messages: number
}

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  return authedFetch('/api/user/notification-settings')
}

export async function updateNotificationSettings(settings: NotificationSettings): Promise<void> {
  await authedFetch('/api/user/notification-settings', { method: 'PATCH', body: JSON.stringify(settings) })
}

const CATEGORY_COLORS: Record<string, string> = {
  'Motivim': '#7A4F2D',
  'Shëndet': '#4A9B6F',
  'Mirëqenie': '#0EA5E9',
  'Jetesë': '#D4904A',
  'Zhvillim Personal': '#6366F1',
  'Biznes': '#C0392B',
  'Familje': '#E67E22',
  'Krijimtari': '#8E44AD',
  'Psikologji': '#2980B9',
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function mapLevel(level: string): string {
  const map: Record<string, string> = {
    fillestare: 'Fillestar',
    mesatar: 'Mesatar',
    avancuar: 'Avancuar',
    te_gjitha_nivelet: 'Të gjitha nivelet',
  }
  return map[level] || 'Të gjitha nivelet'
}

export interface ApiCourse {
  id: number
  title: string
  instructor: string
  category: string
  duration: string
  lessons: number
  level: string
  price: string
  isFree: boolean
  isPremium: boolean
  color: string
  emoji: string
  image: string
  shortDesc: string
  description: string
  sections?: ApiSection[]
}

export interface ApiSection {
  id: number
  title: string
  order_index: number
  lessons: ApiLesson[]
}

export interface ApiLesson {
  id: number
  title: string
  duration_seconds: number
  is_free: boolean
  order_index: number
}

export interface ApiCategory {
  id: number
  name: string
  count: number
  emoji: string
  color: string
}

export function mapCourse(c: any): ApiCourse {
  return {
    id: c.id,
    title: c.title,
    instructor: c.instructor_name || '',
    category: c.category_name || '',
    duration: formatDuration(c.duration_minutes || 0),
    lessons: c.lessons_count || 0,
    level: mapLevel(c.level),
    price: c.price ? `€${parseFloat(c.price).toFixed(0)}` : 'Falas',
    isFree: c.access_type === 'free',
    isPremium: c.access_type !== 'free',
    color: CATEGORY_COLORS[c.category_name] || '#7A4F2D',
    emoji: c.category_icon || '📚',
    image: c.cover_image_url || '',
    shortDesc: c.short_description || '',
    description: c.long_description || c.short_description || '',
    sections: c.sections || [],
  }
}

export async function fetchCourses(): Promise<ApiCourse[]> {
  const res = await fetch(`${API_BASE}/api/courses`)
  if (!res.ok) throw new Error('Gabim duke marrë kurset')
  const data = await res.json()
  return data.map(mapCourse)
}

export async function fetchCourse(id: number): Promise<ApiCourse> {
  const res = await fetch(`${API_BASE}/api/courses/${id}`)
  if (!res.ok) throw new Error('Kursi nuk u gjet')
  const data = await res.json()
  return mapCourse(data)
}

export async function fetchCategories(courses: ApiCourse[]): Promise<ApiCategory[]> {
  const map: Record<string, ApiCategory & { _id: number }> = {}
  let idCounter = 1
  courses.forEach(c => {
    if (!map[c.category]) {
      map[c.category] = { id: idCounter++, _id: idCounter, name: c.category, count: 0, emoji: c.emoji, color: c.color }
    }
    map[c.category].count++
  })
  return Object.values(map)
}
