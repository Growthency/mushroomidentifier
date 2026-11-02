'use client'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { primeUrl } from '@/lib/affiliate'

const KEY = 'mi_prime_bar_closed'
const QUIET_MS = 7 * 24 * 60 * 60 * 1000

/**
 * Prime trial bar in the page header. It sits in the header area and pushes
 * the page down through --mi-bar-h, so it never floats over content: Amazon's
 * policy bars pop-ups and layer ads for anything but related products.
 */
export default function PrimeTopBar() {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    try {
      const at = Number(localStorage.getItem(KEY) || 0)
      if (at && Date.now() - at < QUIET_MS) close(false)
    } catch {
      /* storage blocked: keep the bar */
    }
  }, [])

  function close(remember = true) {
    setOpen(false)
    document.documentElement.style.setProperty('--mi-bar-h', '0px')
    if (remember) {
      try {
        localStorage.setItem(KEY, String(Date.now()))
      } catch {
        /* storage blocked: the bar returns on the next visit */
      }
    }
  }

  if (!open) return null

  return (
    <div className="mi-topbar" role="region" aria-label="Amazon Prime trial">
      <span className="mi-topbar-ad">Ad</span>
      <span className="mi-topbar-text">
        <strong>Try Amazon Prime free for 30 days</strong>
        <span className="mi-topbar-more"> for fast delivery on field guides, kits and gear</span>
      </span>
      <a className="mi-topbar-btn" href={primeUrl('topbar')} target="_blank" rel="sponsored nofollow noopener">
        Start free trial
      </a>
      <button type="button" className="mi-topbar-x" aria-label="Close" onClick={() => close()}>
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
