import { Eye } from 'lucide-react'

interface Props {
  views: number
  className?: string
}

function formatViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export default function ArticleViewCount({ views, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={`${views.toLocaleString()} views`}
    >
      <Eye className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
      <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
        {formatViews(views)} views
      </span>
    </span>
  )
}
