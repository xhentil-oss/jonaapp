const API_BASE = 'https://app.jonacademy.com'
const TOKEN_KEY = 'jona_admin_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  const isForm = options.body instanceof FormData
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Ndodhi një gabim')
  return data
}

const get = (path: string) => request(path)
const post = (path: string, body?: unknown) => request(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined })
const put = (path: string, body?: unknown) => request(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined })
const del = (path: string) => request(path, { method: 'DELETE' })

// ---------------- Auth ----------------

export interface AdminUser {
  id: number
  full_name: string
  email: string
  role: string
}

export async function loginAdmin(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export async function fetchMe(): Promise<AdminUser> {
  return get('/api/user/me')
}

// ---------------- Stats ----------------

export interface AdminStats {
  totalCourses: number
  totalCategories: number
  totalStudents: number
  totalRevenue: string
  totalEnrollments: number
  activeSubscriptions: number
  recentEnrollments: { id: number; enrolled_at: string; student_name: string; course_title: string }[]
  recentUsers: { id: number; full_name: string; email: string; created_at: string }[]
}

export const fetchStats = (): Promise<AdminStats> => get('/api/admin/stats')

// ---------------- Categories ----------------

export interface Category { id: number; name: string; icon: string | null; color: string | null; courses_count: number }

export const fetchCategories = (): Promise<Category[]> => get('/api/admin/categories')
export const createCategory = (data: Partial<Category>) => post('/api/admin/categories', data)
export const updateCategory = (id: number, data: Partial<Category>) => put(`/api/admin/categories/${id}`, data)
export const deleteCategory = (id: number) => del(`/api/admin/categories/${id}`)

// ---------------- Instructors ----------------

export interface Instructor { id: number; full_name: string; bio: string | null; avatar_url: string | null; courses_count: number }

export const fetchInstructors = (): Promise<Instructor[]> => get('/api/admin/instructors')
export const createInstructor = (data: Partial<Instructor>) => post('/api/admin/instructors', data)
export const updateInstructor = (id: number, data: Partial<Instructor>) => put(`/api/admin/instructors/${id}`, data)
export const deleteInstructor = (id: number) => del(`/api/admin/instructors/${id}`)

// ---------------- Courses ----------------

export interface AdminLesson {
  id: number
  section_id: number
  course_id: number
  title: string
  video_url: string | null
  duration_seconds: number
  is_free: number
  order_index: number
}

export interface AdminSection {
  id: number
  course_id: number
  title: string
  order_index: number
  lessons: AdminLesson[]
}

export interface AdminCourse {
  id: number
  title: string
  short_description: string | null
  long_description: string | null
  category_id: number
  instructor_id: number
  level: string
  duration_minutes: number
  price: string
  access_type: string
  cover_image_url: string | null
  is_new: number
  is_featured: number
  students_count: number
  lessons_count: number
  instructor_name?: string
  category_name?: string
  sections?: AdminSection[]
}

export interface CourseInput {
  title: string
  short_description: string
  long_description: string
  category_id: number
  instructor_id: number
  level: string
  duration_minutes: number
  price: number
  access_type: string
  cover_image_url: string
  is_new: boolean
  is_featured: boolean
}

export interface LessonInput {
  title: string
  video_url?: string
  duration_seconds: number
  is_free: boolean
  order_index: number
}

export const fetchCourses = (params: Record<string, string> = {}): Promise<AdminCourse[]> => {
  const qs = new URLSearchParams(params).toString()
  return get(`/api/admin/courses${qs ? `?${qs}` : ''}`)
}
export const fetchCourse = (id: number): Promise<AdminCourse> => get(`/api/admin/courses/${id}`)
export const createCourse = (data: CourseInput): Promise<{ id: number }> => post('/api/admin/courses', data)
export const updateCourse = (id: number, data: CourseInput) => put(`/api/admin/courses/${id}`, data)
export const deleteCourse = (id: number) => del(`/api/admin/courses/${id}`)

export const createSection = (courseId: number, data: { title: string; order_index?: number }) => post(`/api/admin/courses/${courseId}/sections`, data)
export const updateSection = (id: number, data: { title: string; order_index?: number }) => put(`/api/admin/sections/${id}`, data)
export const deleteSection = (id: number) => del(`/api/admin/sections/${id}`)

export const createLesson = (sectionId: number, data: LessonInput) => post(`/api/admin/sections/${sectionId}/lessons`, data)
export const updateLesson = (id: number, data: LessonInput) => put(`/api/admin/lessons/${id}`, data)
export const deleteLesson = (id: number) => del(`/api/admin/lessons/${id}`)

export async function uploadImage(file: File): Promise<{ url: string }> {
  const form = new FormData()
  form.append('image', file)
  return request('/api/admin/upload', { method: 'POST', body: form })
}

// ---------------- Users ----------------

export interface AdminUserListItem {
  id: number
  full_name: string
  email: string
  membership_type: string
  role: string
  created_at: string
  enrollments_count: number
  certificates_count: number
  has_active_subscription: number
}

export interface AdminUserDetail extends AdminUserListItem {
  enrollments: { id: number; course_id: number; course_title: string; progress_percent: string; status: string; enrolled_at: string }[]
  certificates: { id: number; course_id: number; course_title: string; certificate_code: string; issued_at: string }[]
  subscriptions: { id: number; plan_name: string; status: string; started_at: string; renews_at: string }[]
  payments: { id: number; amount: string; currency: string; status: string; created_at: string; course_id: number | null; subscription_id: number | null }[]
}

export const fetchUsers = (search?: string): Promise<AdminUserListItem[]> => get(`/api/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`)
export const fetchUser = (id: number): Promise<AdminUserDetail> => get(`/api/admin/users/${id}`)

// ---------------- Certificates ----------------

export interface AdminCertificate {
  id: number
  user_id: number
  course_id: number
  certificate_code: string
  issued_at: string
  student_name: string
  student_email: string
  course_title: string
}

export const fetchCertificates = (): Promise<AdminCertificate[]> => get('/api/admin/certificates')
export const issueCertificate = (user_id: number, course_id: number) => post('/api/admin/certificates', { user_id, course_id })
export const revokeCertificate = (id: number) => del(`/api/admin/certificates/${id}`)

// ---------------- Subscriptions & Payments ----------------

export interface AdminSubscription {
  id: number
  user_id: number
  plan_id: number
  status: string
  started_at: string
  renews_at: string
  student_name: string
  student_email: string
  plan_name: string
  plan_price: string
}

export interface AdminPayment {
  id: number
  user_id: number
  course_id: number | null
  subscription_id: number | null
  amount: string
  currency: string
  payment_method: string | null
  status: string
  created_at: string
  student_name: string
  student_email: string
  course_title: string | null
}

export const fetchSubscriptions = (): Promise<AdminSubscription[]> => get('/api/admin/subscriptions')
export const fetchPayments = (): Promise<AdminPayment[]> => get('/api/admin/payments')
