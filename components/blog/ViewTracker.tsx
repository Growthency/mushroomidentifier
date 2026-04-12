'use client'

import { useEffect } from 'react'

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed:${slug}`
    if (sessionStorage.getItem(key)) return // already counted this session
    sessionStorage.setItem(key, '1')
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).catch(() => {})
  }, [slug])

  return null
}
