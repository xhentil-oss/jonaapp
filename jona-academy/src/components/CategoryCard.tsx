import { useNavigate } from 'react-router-dom'
import { CategoryIcon } from './Icons'

interface CategoryCardProps {
  id: number
  name: string
  count: number
  emoji: string
  color: string
}

export default function CategoryCard({ id, name, count, color }: CategoryCardProps) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/courses?category=${id}`)}
      style={{
        background: `linear-gradient(135deg, ${color}18, ${color}0A)`,
        border: `1px solid ${color}28`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px 14px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'transform 0.2s, box-shadow 0.2s',
        width: 110,
        minWidth: 110,
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 42, height: 42,
        borderRadius: 12,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <CategoryIcon name={name} size={22} color={color} />
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3, lineHeight: 1.3 }}>{name}</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{count} kurse</p>
      </div>
    </div>
  )
}
