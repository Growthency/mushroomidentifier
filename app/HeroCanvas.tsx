'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

const PARTICLE_COUNT = 40
const CONNECTION_DISTANCE = 120

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0]
      if (entry) {
        canvas.width = entry.contentRect.width
        canvas.height = entry.contentRect.height
      }
    }
    const ro = new ResizeObserver(resizeCanvas)
    ro.observe(canvas)

    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
        })
      }
    }

    initParticles()

    let isLight = document.documentElement.getAttribute('data-theme') === 'light'
    const themeObserver = new MutationObserver(() => {
      isLight = document.documentElement.getAttribute('data-theme') === 'light'
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = isLight ? 'rgba(30, 80, 45, 0.5)' : 'rgba(126, 200, 138, 0.6)'
        ctx.fill()
      })

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x
          const dy = particlesRef.current[i].y - particlesRef.current[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < CONNECTION_DISTANCE) {
            ctx.beginPath()
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y)
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y)
            ctx.strokeStyle = isLight
              ? `rgba(30, 80, 45, ${0.35 * (1 - distance / CONNECTION_DISTANCE)})`
              : `rgba(126, 200, 138, ${0.2 * (1 - distance / CONNECTION_DISTANCE)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(animate)
    }

    const startTimer = setTimeout(() => { animate() }, 2500)

    return () => {
      clearTimeout(startTimer)
      cancelAnimationFrame(animId)
      themeObserver.disconnect()
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40"
      style={{ pointerEvents: 'none' }}
    />
  )
}
