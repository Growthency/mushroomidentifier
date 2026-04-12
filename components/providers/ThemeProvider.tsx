'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('mi-theme') as Theme | null
    if (saved) setTheme(saved)
    setMounted(true)
    // Double rAF ensures React has flushed the theme state to DOM before revealing
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add('theme-ready')
      })
    })
  }, [])

  useEffect(() => {
    if (mounted) {
      // Only write to DOM if value actually changed (inline script may have already set it)
      if (document.documentElement.getAttribute('data-theme') !== theme) {
        document.documentElement.setAttribute('data-theme', theme)
      }
      localStorage.setItem('mi-theme', theme)
    }
  }, [theme, mounted])

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
