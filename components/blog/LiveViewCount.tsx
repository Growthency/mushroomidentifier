'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

function formatViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export default function LiveViewCount({ slug, className = '' }: { slug: string; className?: string }) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    fetch(`/api/views?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => setViews(d.views ?? 0))
      .catch(() => setViews(0))
  }, [slug])

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={views !== null ? `${views.toLocaleString()} views` : 'Loading views'}
    >
      <Eye className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
      <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
        {views !== null ? `${formatViews(views)} views` : '— views'}
      </span>
    </span>
  )
}
