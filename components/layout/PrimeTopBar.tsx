'use client'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { blackFridayUrl, isBlackFriday, primeUrl } from '@/lib/affiliate'

const KEY = 'mi_prime_bar_closed'
const BF_KEY = 'mi_bf_bar_closed'
const QUIET_MS = 7 * 24 * 60 * 60 * 1000

/**
 * Prime trial bar in the page header. It sits in the header area and pushes
 * the page down through --mi-bar-h, so it never floats over content: Amazon's
 * policy bars pop-ups and layer ads for anything but related products.
 */
export default function PrimeTopBar() {
  const [open, setOpen] = useState(true)
  const bf = isBlackFriday()

  useEffect(() => {
    try {
      const at = Number(localStorage.getItem(bf ? BF_KEY : KEY) || 0)
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
        localStorage.setItem(bf ? BF_KEY : KEY, String(Date.now()))
      } catch {
        /* storage blocked: the bar returns on the next visit */
      }
    }
  }

  if (!open) return null

  if (bf) {
    return (
      <div className="mi-topbar mi-bf" role="region" aria-label="Amazon Black Friday deals">
        <span className="mi-topbar-text">
          <span className="mi-bf-dot" aria-hidden="true" />
          <strong>Black Friday deals are live</strong>
          <span className="mi-topbar-more"> on Amazon &middot; limited-time discounts, grab them before they&rsquo;re gone</span>
        </span>
        <a className="mi-topbar-btn" href={blackFridayUrl('topbar')} target="_blank" rel="sponsored nofollow noopener">
          Grab the deals
        </a>
        <button type="button" className="mi-topbar-x" aria-label="Close" onClick={() => close()}>
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="mi-topbar" role="region" aria-label="Amazon Prime trial">
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
