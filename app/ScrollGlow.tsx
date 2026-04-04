'use client'
import { useEffect, useRef } from 'react'

export default function ScrollGlow() {
  const orb1 = useRef<HTMLDivElement>(null)
  const orb2 = useRef<HTMLDivElement>(null)
  const orb3 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false
    const update = () => {
      const y = window.scrollY
      const max = Math.max(document.body.scrollHeight - window.innerHeight, 1)
      const p = Math.min(y / max, 1)

      if (orb1.current) orb1.current.style.transform = `translate(${p * 160}px, ${-p * 260}px) scale(${1 + p * 0.18})`
      if (orb2.current) orb2.current.style.transform = `translate(${-p * 120}px, ${p * 200}px) scale(${1 + p * 0.12})`
      if (orb3.current) orb3.current.style.transform = `translate(${p * 70}px, ${p * 140}px)`
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div ref={orb1} className="scroll-orb orb-1" />
      <div ref={orb2} className="scroll-orb orb-2" />
      <div ref={orb3} className="scroll-orb orb-3" />
    </div>
  )
}
