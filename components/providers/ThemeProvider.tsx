'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggle: () => {},
})

// Public site is light-mode only. The public navbar no longer exposes
// the toggle. Admin dashboard still calls useTheme() for its own
// light/dark switching (it has its own toggle inside AdminShell).
// We still honor a saved localStorage preference on load so admins
// who previously chose dark mode don't get silently flipped to light
// when they navigate back to their admin pages.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
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
