'use client'
import { useEffect, useRef } from 'react'

interface Props {
  className?: string
  children: React.ReactNode
}

/**
 * Server-renders the H1 with a solid accent colour (LCP-safe — browser can
 * measure solid text as the LCP candidate). After mount, swaps to the
 * animated gradient so the shimmer only starts once LCP has been recorded.
 */
export default function HeroH1({ className, children }: Props) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (ref.current) {
      // Remove inline solid colour and apply gradient class after first paint
      ref.current.style.color = ''
      ref.current.classList.add('gradient-text-animate')
    }
  }, [])

  return (
    <h1
      ref={ref}
      className={className}
      style={{ color: 'var(--accent)' }}
    >
      {children}
    </h1>
  )
}
