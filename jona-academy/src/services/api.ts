const API_BASE = 'https://app.jonacademy.com'

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

function mapCourse(c: any): ApiCourse {
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
