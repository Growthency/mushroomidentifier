'use client'
import { createContext, useContext, useEffect, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggle: () => void
}

// Dark mode is currently disabled site-wide. The provider is kept (rather
// than ripping out every `useTheme()` call site) so that consumers continue
// to compile and just always read 'light'. `toggle()` is a no-op.
//
// To re-enable dark mode in the future:
//   1. Restore the previous useState/localStorage logic here
//   2. Restore the inline theme script in app/layout.tsx
//   3. Restore the toggle buttons in AdminShell + DashboardShell
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Force light on every mount so any leftover localStorage value
    // ('mi-theme=dark' from before this change) is wiped, and the DOM
    // attribute matches.
    try {
      localStorage.setItem('mi-theme', 'light')
    } catch {
      /* ignore — private mode etc. */
    }
    if (document.documentElement.getAttribute('data-theme') !== 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    }
    // Reveal the page once theme attr is settled (kept from previous
    // version so any CSS that gates on .theme-ready continues to work).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add('theme-ready')
      })
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggle: () => {} }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
